// dashboard/reservas/_actions.ts
"use server"

import { prisma } from "@/lib/prisma";
import { ClienteReserva, PagoReserva } from "./typesReserva";
import { EstadoReserva, MetodoPago } from "@/generated/client/client";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";


export async function getDisponibilidadAction(checkIn: Date, checkOut: Date) {
  const reservasSolapadas = await prisma.reservaHabitacion.findMany({
    where: {
      reserva: {
        estado: { notIn: ["CANCELADA", "NO_SHOW"] },
        AND: [
          { fechaCheckIn: { lt: checkOut } },
          { fechaCheckOut: { gt: checkIn } }
        ]
      }
    },
    select: { habitacionId: true }
  });

  const idsOcupados = reservasSolapadas.map(r => r.habitacionId);

  const habitaciones = await prisma.habitacion.findMany({
    where: {
      id: { notIn: idsOcupados },
      estadoLimpieza: { not: "EN_MANTENIMIENTO" }
    },
    include: { tipoBase: true, tipoActual: true },
    orderBy: { tipoBase: { capacidadMaxima: 'asc' } }
  });

  return habitaciones.map(h => ({
    ...h,
    tipoBase: { ...h.tipoBase, precioBase: h.tipoBase.precioBase.toNumber() },
    tipoActual: { ...h.tipoActual, precioBase: h.tipoActual.precioBase.toNumber() }
  }));
}

export async function getTiposHabitacionAction() {
  const tipos = await prisma.tipoHabitacion.findMany();
  return tipos.map(t => ({ ...t, precioBase: t.precioBase.toNumber() }));
}



interface GuardarReservaParams {
  cliente: ClienteReserva;
  habitacionId: number;
  tipoVendidoId: number;
  precioVendido: number;
  fechaCheckIn: Date;
  fechaCheckOut: Date;
  pagos: PagoReserva[];
  totalEstadia: number;
}

export async function crearReservaCompletaAction(params: GuardarReservaParams) {
  try {
    // 1. Buscamos la sesión directamente en el servidor
    const session = await getSession();
    
    if (!session) {
      return { success: false, error: "No hay una sesión activa de empleado." };
    }

    const resultado = await prisma.$transaction(async (tx) => {
      
      // --- FASE A: EL CLIENTE (Upsert) ---
      const clienteDb = await tx.cliente.upsert({
        where: { documento: params.cliente.documento },
        update: {
          nombre: params.cliente.nombre,
          telefono: params.cliente.telefono,
          email: params.cliente.email,
          direccion: params.cliente.direccion,
          esEmpresa: params.cliente.esEmpresa,
        },
        create: {
          nombre: params.cliente.nombre,
          documento: params.cliente.documento,
          telefono: params.cliente.telefono,
          email: params.cliente.email,
          direccion: params.cliente.direccion,
          esEmpresa: params.cliente.esEmpresa,
        },
      });

      // --- FASE B: LA RESERVA (Aquí estaba el error) ---
      const nuevaReserva = await tx.reserva.create({
        data: {
          clienteId: clienteDb.id,
          // AGREGA ESTA LÍNEA DE ABAJO:
          empleadoId: session.id, 
          fechaCheckIn: params.fechaCheckIn,
          fechaCheckOut: params.fechaCheckOut,
          estado: "CONFIRMADA",
          totalReserva: params.totalEstadia,
        },
      });

      // --- FASE C: VINCULAR HABITACIÓN ---
      await tx.reservaHabitacion.create({
        data: {
          reservaId: nuevaReserva.id,
          habitacionId: params.habitacionId,
          tipoVendidoId: params.tipoVendidoId,
          // AGREGA ESTA LÍNEA DE ABAJO:
          precioAplicado: params.precioVendido, 
        },
      });

      // --- FASE D: LOS COBROS ---
      if (params.pagos.length > 0) {
  await tx.pago.createMany({
    data: params.pagos.map((p) => ({
      reservaId: nuevaReserva.id,
      monto: p.monto,
      // Usamos "as MetodoPago" para decirle a TS que el string es válido
      metodo: p.metodo as MetodoPago, 
      referencia: p.referencia,
      esAdelanto: true,
      fecha: new Date(),
    })),
  });
}

      return nuevaReserva;
    });

    return { success: true, reservaId: resultado.id };
  } catch (error) {
    console.error("ERROR AL GUARDAR RESERVA:", error);
    return { success: false, error: "No se pudo guardar la reserva." };
  }
}






/**
 * Función genérica para cambiar el estado de una reserva.
 * Se usa para Cancelar, No-Show, etc.
 */
export async function actualizarEstadoReservaAction(reservaId: number, nuevoEstado: EstadoReserva) {
  try {
    await prisma.reserva.update({
      where: { id: reservaId },
      data: { estado: nuevoEstado },
    });

    // Refrescamos las rutas para que el cambio sea instantáneo en la UI
    revalidatePath("/dashboard/reservas");
    revalidatePath(`/dashboard/reservas/${reservaId}`);

    return { success: true };
  } catch (error) {
    console.error(`ERROR AL CAMBIAR ESTADO A ${nuevoEstado}:`, error);
    return { success: false, error: "No se pudo actualizar el estado de la reserva." };
  }
}

export async function finalizarCheckInAction(data: {
  reservaId: number;
  reservaHabitacionId: number;
  nuevaHabitacionId: number;
  huespedes: { nombre: string; apellido: string; documento: string; nacionalidad: string }[];
  titularSeHospeda: boolean;
  servicios: { descripcion: string; monto: number; cantidad: number }[];
  totalEstadiaFinal: number;
}) {
  try {
    await prisma.$transaction(async (tx) => {
      
      // 1. Buscamos la relación actual
      const relOriginal = await tx.reservaHabitacion.findUnique({
        where: { id: data.reservaHabitacionId }
      });

      if (!relOriginal) throw new Error("No se encontró el vínculo de habitación.");

      // 2. Si el recepcionista cambió la habitación en el Wizard, actualizamos el vínculo
      if (relOriginal.habitacionId !== data.nuevaHabitacionId) {
        await tx.reservaHabitacion.update({
          where: { id: data.reservaHabitacionId },
          data: { habitacionId: data.nuevaHabitacionId }
        });
        
        // El estado de la habitación vieja lo manejamos aquí si es necesario
        // Pero lo más importante es marcar la NUEVA como OCUPADA
      }

      // 3. Actualizamos la Reserva a CHECK_IN y su nuevo total (por si hubo descuento)
      await tx.reserva.update({
        where: { id: data.reservaId },
        data: { 
          estado: "CHECK_IN",
          totalReserva: data.totalEstadiaFinal 
        },
      });

      // 4. Marcamos la habitación física como OCUPADA
      await tx.habitacion.update({
        where: { id: data.nuevaHabitacionId },
        data: { disponibilidad: "OCUPADA" },
      });

      // 5. REGISTRO DE HUÉSPEDES
      // Nota: Aquí podrías sumar al titular si data.titularSeHospeda es true
      for (const h of data.huespedes) {
        const persona = await tx.huesped.upsert({
          where: { documento: h.documento },
          update: { nombre: h.nombre, apellido: h.apellido, nacionalidad: h.nacionalidad },
          create: { nombre: h.nombre, apellido: h.apellido, documento: h.documento, nacionalidad: h.nacionalidad },
        });

        await tx.ocupacionHuesped.create({
          data: {
            reservaHabitacionId: data.reservaHabitacionId,
            huespedId: persona.id,
          }
        });
      }

      // 6. CARGOS EXTRAS
      if (data.servicios.length > 0) {
        await tx.cargoExtra.createMany({
          data: data.servicios.map(s => ({
            reservaId: data.reservaId,
            descripcion: s.descripcion,
            monto: s.monto,
            cantidad: s.cantidad
          }))
        });
      }
    });

    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/reservas/${data.reservaId}`);
    
    return { success: true };
  } catch (error) {
    console.error("ERROR EN CHECK-IN:", error);
    return { success: false, error: "No se pudo completar el ingreso." };
  }
}