// src/app/dashboard/reservas/[id]/checkout/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { CheckOutWizard } from "./_components/CheckOutWizard";

export default async function CheckOutPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  const reserva = await prisma.reserva.findUnique({
    where: { id: parseInt(id) },
    include: {
      cliente: true,
      habitaciones: { include: { habitacion: true, tipoVendido: true } },
      pagos: true,
      cargosExtras: true,
    }
  });

  if (!reserva) notFound();

  // Preparamos los datos económicos para el Wizard
  const initialData = {
    reservaId: reserva.id,
    titularNombre: reserva.cliente.nombre,
    habitacionNumero: reserva.habitaciones[0]?.habitacion.numero,
    totalEstadia: Number(reserva.totalReserva),
    pagosRealizados: reserva.pagos.map(p => ({
      monto: Number(p.monto),
      metodo: p.metodo,
      fecha: p.fecha
    })),
    consumosExtras: reserva.cargosExtras.map(c => ({
      descripcion: c.descripcion,
      monto: Number(c.monto),
      cantidad: c.cantidad
    })),
  };

  return (
    <div className="p-4 md:p-10 max-w-5xl mx-auto space-y-8">
      <CheckOutWizard initialData={initialData} />
    </div>
  );
}