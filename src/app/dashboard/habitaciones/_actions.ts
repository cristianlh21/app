// dashboard/habitaciones/_actions.ts
"use server"
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleLimpiezaAction(id: number, estadoActual: string) {
  const nuevoEstado = estadoActual === "LIMPIA" ? "SUCIA" : "LIMPIA";

  await prisma.habitacion.update({
    where: { id },
    data: { 
      estadoLimpieza: nuevoEstado as any 
    }
  });

  revalidatePath("/dashboard/habitaciones");
}

export async function toggleMantenimientoAction(id: number, estadoActual: string) {
  // Aquí es donde estaba el error: ahora aceptamos un STRING
  const nuevoEstado = estadoActual === "EN_MANTENIMIENTO" ? "LIMPIA" : "EN_MANTENIMIENTO";

  await prisma.habitacion.update({
    where: { id },
    data: { 
      estadoLimpieza: nuevoEstado as any 
    }
  });

  revalidatePath("/dashboard/habitaciones");
}