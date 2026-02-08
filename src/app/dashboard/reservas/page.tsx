// src/app/dashboard/reservas/page.tsx
import { prisma } from "@/lib/prisma";
import { ReservaCard } from "./_components/ReservaCard";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default async function ReservasPage() {
  // 1. Traemos los datos de la base de datos
  const reservasDb = await prisma.reserva.findMany({
    include: {
      cliente: true,
      habitaciones: {
        include: {
          habitacion: {
            include: { tipoActual: true }
          },
          tipoVendido: true,
        },
      },
    },
  });

  // 2. Prioridad de los estados para el orden visual
  const prioridadEstado: Record<string, number> = {
    'CHECK_IN': 1,    // Huéspedes en casa
    'CONFIRMADA': 2,  // Entradas próximas
    'PENDIENTE': 3,   // Por confirmar
    'CANCELADA': 4,   // Canceladas (abajo)
    'NO_SHOW': 5,     // No vinieron (abajo)
    'CHECK_OUT': 6    // Finalizadas (al fondo)
  };

  // 3. LIMPIEZA PROFUNDA (Deep Map) para eliminar todos los objetos Decimal
  const reservas = reservasDb
    .map((res) => ({
      ...res,
      totalReserva: Number(res.totalReserva), // Limpiamos total
      
      // Entramos a limpiar cada habitación vinculada a la reserva
      habitaciones: res.habitaciones.map((h) => ({
        ...h,
        precioAplicado: Number(h.precioAplicado), // Limpiamos precio pactado
        tipoVendido: {
          ...h.tipoVendido,
          precioBase: Number(h.tipoVendido.precioBase) // Limpiamos precio del tipo vendido
        },
        habitacion: {
          ...h.habitacion,
          tipoActual: {
            ...h.habitacion.tipoActual,
            precioBase: Number(h.habitacion.tipoActual.precioBase) // Limpiamos precio del tipo físico
          }
        }
      })),
      
      // Creamos un campo simple para el nombre del tipo de habitación física
      tipoActualNombre: res.habitaciones[0]?.habitacion.tipoActual.nombre || "Estándar",
    }))
    // Ordenamos por prioridad y luego por fecha
    .sort((a, b) => {
      const prioA = prioridadEstado[a.estado] || 99;
      const prioB = prioridadEstado[b.estado] || 99;
      if (prioA !== prioB) return prioA - prioB;
      return new Date(a.fechaCheckIn).getTime() - new Date(b.fechaCheckIn).getTime();
    });

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest">
            <Calendar size={14} /> Recepción Shauard
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">
            Reservas <span className="text-blue-600">({reservas.length})</span>
          </h1>
        </div>

        <Link href="/dashboard/reservas/nueva">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-black px-8 h-16 rounded-[2rem] shadow-2xl border-none transition-transform active:scale-95">
            <Plus className="mr-2" size={24} /> NUEVA RESERVA
          </Button>
        </Link>
      </div>

      {/* BUSCADOR */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <Input 
          placeholder="Buscar cliente o habitación..." 
          className="pl-12 h-14 bg-white rounded-2xl border-slate-100 shadow-sm font-medium focus-visible:ring-blue-500"
        />
      </div>

      {/* LISTADO DE TARJETAS */}
      <div className="grid grid-cols-1 gap-5">
        {reservas.length === 0 ? (
          <div className="py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No hay registros para mostrar</p>
          </div>
        ) : (
          reservas.map((reserva) => (
            <ReservaCard key={reserva.id} reserva={reserva} />
          ))
        )}
      </div>
    </div>
  );
}