// dashboard/reservas/_actions.ts
"use server"

import { prisma } from "@/lib/prisma";
import { ClienteReserva, PagoReserva } from "./typesReserva";
import { MetodoPago } from "@/generated/client/client";
import { getSession } from "@/lib/auth";


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