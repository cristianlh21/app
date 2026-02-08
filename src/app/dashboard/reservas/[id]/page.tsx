// app/dashboard/reservas/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { DetalleTicket } from "./_components/DetalleTicket";
import { BotoneraAcciones } from "./_components/BotoneraAcciones";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function DetalleReservaPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  const reservaDb = await prisma.reserva.findUnique({
    where: { id: parseInt(id) },
    include: {
      cliente: true,
      pagos: true,
      habitaciones: {
        include: {
          tipoVendido: true,
          habitacion: {
            include: {
              tipoActual: true,
            }
          }
        }
      }
    },
  });

  if (!reservaDb) notFound();

  // SERIALIZACIÓN PROFUNDA: Convertimos CADA Decimal a Number
  const reserva = {
    ...reservaDb,
    totalReserva: Number(reservaDb.totalReserva),
    pagos: reservaDb.pagos.map(p => ({
      ...p,
      monto: Number(p.monto)
    })),
    habitaciones: reservaDb.habitaciones.map(h => ({
      ...h,
      precioAplicado: Number(h.precioAplicado),
      tipoVendido: {
        ...h.tipoVendido,
        precioBase: Number(h.tipoVendido.precioBase) // <-- Aquí faltaba la conversión
      },
      habitacion: {
        ...h.habitacion,
        tipoActual: {
          ...h.habitacion.tipoActual,
          precioBase: Number(h.habitacion.tipoActual.precioBase) // <-- Y aquí también
        }
      }
    })),
    // Extraemos el nombre para la card de forma simplificada
    tipoActualNombre: reservaDb.habitaciones[0]?.habitacion.tipoActual.nombre || "Estándar"
  };

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* CABECERA */}
      <div className="flex flex-col gap-4">
        <Link href="/dashboard/reservas" className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors font-bold text-xs uppercase">
          <ArrowLeft size={16} /> Volver al listado
        </Link>
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">
            Gestión de Reserva <span className="text-blue-600">#{reserva.id}</span>
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* COLUMNA IZQUIERDA: EL TICKET */}
        <div className="lg:col-span-2">
          <DetalleTicket reserva={reserva} />
        </div>

        {/* COLUMNA DERECHA: BOTONERA INTELIGENTE */}
        <div className="space-y-6">
          <BotoneraAcciones 
            reservaId={reserva.id} 
            estado={reserva.estado} 
            total={reserva.totalReserva}
            pagado={reserva.pagos.reduce((acc, p) => acc + p.monto, 0)}
          />
        </div>

      </div>
    </div>
  );
}