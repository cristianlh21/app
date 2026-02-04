"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";



// 1. REGISTRO POR CLIC (Recepcionista)
export async function registrarAsistencia(
  empleadoId: number, 
  tipo: "ENTRADA" | "SALIDA", 
  turno: "MAÑANA" | "TARDE" | "NOCHE"
) {
  const session = await getSession();
  if (!session) return { success: false, error: "No hay sesión" };

  // 1. Tomamos la hora actual UTC
  const ahora = new Date();
  
  // 2. Le restamos 3 horas (Matemática pura: 3 hs * 60 min * 60 seg * 1000 ms)
  // Esto fuerza que el objeto tenga la hora de Salta en sus componentes UTC
  const offsetSalta = 3 * 60 * 60 * 1000;
  const fechaRestada = new Date(ahora.getTime() - offsetSalta);

  // 3. Construimos el string ISO manualmente paso a paso
  // Usamos getUTC...() porque 'fechaRestada' ya tiene la hora de Salta en sus campos UTC
  const pad = (n: number) => n.toString().padStart(2, '0');
  
  const anio = fechaRestada.getUTCFullYear();
  const mes = pad(fechaRestada.getUTCMonth() + 1);
  const dia = pad(fechaRestada.getUTCDate());
  const hora = pad(fechaRestada.getUTCHours());
  const min = pad(fechaRestada.getUTCMinutes());
  const seg = pad(fechaRestada.getUTCSeconds());

  // Resultado: "2026-02-03T14:30:00.000Z" (Siendo las 14:30 en Salta)
  const horaString = `${anio}-${mes}-${dia}T${hora}:${min}:${seg}.000Z`;
  
  // 4. Creamos el objeto Date final que Prisma va a guardar sin chistar
  const horaFinalParaDB = new Date(horaString);

  // 5. Fecha de referencia (Mediodía del día calculado)
  const fechaReferencia = new Date(horaFinalParaDB);
  fechaReferencia.setUTCHours(0, 0, 0, 0);

  // 6. Lógica Turno Noche (Si son las 06:00 AM, restamos un día)
  if (tipo === "SALIDA" && turno === "NOCHE" && horaFinalParaDB.getUTCHours() < 10) {
    fechaReferencia.setUTCDate(fechaReferencia.getUTCDate() - 1);
  }

  await prisma.asistencia.create({
    data: { 
      empleadoId, 
      tipo, 
      turno, 
      hora: horaFinalParaDB, 
      fecha: fechaReferencia, 
      registradoPor: session.id 
    }
  });

  revalidatePath("/dashboard/horarios");
  revalidatePath(`/dashboard/horarios/${empleadoId}`);
  
  return { success: true };
}

export async function crearAsistenciaManual(data: { 
  empleadoId: number; fecha: string; turno: "MAÑANA" | "TARDE" | "NOCHE"; entrada: string; salida: string; 
}) {
  const session = await getSession();
  if (!session || session.rol !== "ADMIN") return { success: false, error: "No autorizado" };

  const horaEntrada = new Date(`${data.fecha}T${data.entrada}:00.000Z`);
  
  // ✅ Cambiamos 'let' por 'const' porque el objeto se muta, no se reasigna
  const horaSalida = new Date(`${data.fecha}T${data.salida}:00.000Z`);

  if (data.turno === "NOCHE" && horaSalida < horaEntrada) {
    // Aquí mutamos el objeto, lo cual es válido con 'const'
    horaSalida.setUTCDate(horaSalida.getUTCDate() + 1);
  }

  const fechaBase = new Date(`${data.fecha}T00:00:00.000Z`);

  await prisma.asistencia.createMany({
    data: [
      { empleadoId: data.empleadoId, tipo: "ENTRADA", turno: data.turno, hora: horaEntrada, fecha: fechaBase, registradoPor: session.id },
      { empleadoId: data.empleadoId, tipo: "SALIDA", turno: data.turno, hora: horaSalida, fecha: fechaBase, registradoPor: session.id }
    ]
  });

  revalidatePath(`/dashboard/horarios/${data.empleadoId}`);
  return { success: true };
}

export async function updateAsistenciaHora(id: number, nuevaHoraStr: string, fechaOriginal: Date) {
  const session = await getSession();
  if (!session || session.rol !== "ADMIN") return { success: false };

  // Tomamos el día de la fecha original y le pegamos la nueva hora "Z"
  const isoDate = new Date(fechaOriginal).toISOString().split('T')[0];
  const nuevaFechaHora = new Date(`${isoDate}T${nuevaHoraStr}:00.000Z`);

  await prisma.asistencia.update({
    where: { id },
    data: { hora: nuevaFechaHora }
  });

  revalidatePath("/dashboard/horarios");
  revalidatePath(`/dashboard/horarios/${id}`);
  return { success: true };
}