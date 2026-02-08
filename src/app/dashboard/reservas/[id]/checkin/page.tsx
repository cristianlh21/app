// src/app/dashboard/reservas/[id]/checkin/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { CheckInWizard } from "./_componets/CheckInWizard";

export default async function CheckInPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  const reserva = await prisma.reserva.findUnique({
    where: { id: parseInt(id) },
    include: {
      cliente: true,
      habitaciones: {
        include: {
          habitacion: true,
          tipoVendido: true,
        }
      }
    }
  });

  if (!reserva || reserva.habitaciones.length === 0) notFound();

  const relHab = reserva.habitaciones[0];

  // IMPORTANTE: Aquí armamos el paquete de datos que viaja al Store
  const initialData = {
    reservaId: reserva.id,
    reservaHabitacionId: relHab.id,
    habitacionId: relHab.habitacionId,
    titularNombre: reserva.cliente.nombre,
    capacidadMaxima: relHab.tipoVendido.capacidadMaxima,
    numeroHabitacion: relHab.habitacion.numero,
    tipoVendidoNombre: relHab.tipoVendido.nombre,
    tipoVendidoId: relHab.tipoVendidoId,
    fechaCheckIn: reserva.fechaCheckIn,
    fechaCheckOut: reserva.fechaCheckOut,
    
    // AQUÍ ESTABA EL ERROR: Faltaban estos dos campos de dinero
    precioPorNoche: Number(relHab.precioAplicado), // El precio pactado por noche
    totalEstadia: Number(reserva.totalReserva),    // El total de la reserva (ej: $90.000)
  };

  return (
    <div className="p-4 md:p-10 max-w-5xl mx-auto space-y-8">
      <CheckInWizard initialData={initialData} />
    </div>
  );
}