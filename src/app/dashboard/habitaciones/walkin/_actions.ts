/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/dashboard/habitaciones/walkin/_actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function crearWalkInAction(data: any) {
  try {
    const res = await prisma.$transaction(async (tx) => {
      
      // 1. Crear o Buscar el Cliente (usando el 1er huésped)
      const primerHuesped = data.huespedes[0];
      const cliente = await tx.cliente.upsert({
        where: { documento: primerHuesped.documento },
        update: {},
        create: {
          nombre: `${primerHuesped.nombre} ${primerHuesped.apellido}`,
          documento: primerHuesped.documento,
          esEmpresa: false
        }
      });

      // 2. Crear la Reserva
      const reserva = await tx.reserva.create({
        data: {
          fechaCheckIn: new Date(),
          fechaCheckOut: data.fechaCheckOut,
          estado: "CHECK_IN",
          clienteId: cliente.id,
          empleadoId: data.empleadoId, 
          totalReserva: data.totalGeneral,
          habitaciones: {
            create: {
              habitacionId: data.habitacionId,
              tipoVendidoId: data.tipoVendidoId,
              // ERROR CORREGIDO AQUÍ: Mapeamos precioPactado -> precioAplicado
              precioAplicado: data.precioPactado, 
            }
          }
        },
        include: { habitaciones: true }
      });

      const reservaHabitacionId = reserva.habitaciones[0].id;

      // 3. Crear Huéspedes y vincular Ocupación
      for (const h of data.huespedes) {
        const huesped = await tx.huesped.upsert({
          where: { documento: h.documento },
          update: { 
            nombre: h.nombre, 
            apellido: h.apellido, 
            nacionalidad: h.nacionalidad 
          },
          create: { 
            nombre: h.nombre, 
            apellido: h.apellido, 
            documento: h.documento, 
            nacionalidad: h.nacionalidad 
          }
        });

        await tx.ocupacionHuesped.create({
          data: {
            reservaHabitacionId: reservaHabitacionId,
            huespedId: huesped.id
          }
        });
      }

      // 4. Cargar Servicios Extras
      if (data.servicios && data.servicios.length > 0) {
        await tx.cargoExtra.createMany({
          data: data.servicios.map((s: any) => ({
            reservaId: reserva.id,
            descripcion: s.descripcion,
            monto: s.monto,
            cantidad: s.cantidad
          }))
        });
      }

      // 5. Registrar Pago Inicial
      if (data.pago) {
        await tx.pago.create({
          data: {
            reservaId: reserva.id,
            monto: data.pago.monto,
            metodo: data.pago.metodo,
            referencia: data.pago.referencia,
            esAdelanto: true,
            fecha: new Date()
          }
        });
      }

      // 6. Marcar Habitación como OCUPADA
      await tx.habitacion.update({
        where: { id: data.habitacionId },
        data: { disponibilidad: "OCUPADA" }
      });

      return reserva;
    });

    revalidatePath("/dashboard/habitaciones");
    return { success: true, id: res.id };
  } catch (e: any) {
    console.error("ERROR EN WALK-IN:", e);
    return { success: false, error: e.message };
  }
}