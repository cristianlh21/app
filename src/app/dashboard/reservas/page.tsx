// dashboard/reservas/page.tsx
import { prisma } from "@/lib/prisma";
import { ReservaCard } from "./_components/ReservaCard";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default async function ReservasPage() {
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
    orderBy: { fechaCheckIn: "asc" },
  });

  // --- LIMPIEZA PROFUNDA DE DECIMALES ---
  const reservas = reservasDb.map((res) => ({
    ...res,
    // 1. Convertimos el total de la reserva
    totalReserva: Number(res.totalReserva),
    
    // 2. Limpiamos cada habitación vinculada
    habitaciones: res.habitaciones.map((h) => ({
      ...h,
      precioAplicado: Number(h.precioAplicado), // Limpiamos el precio pactado
      tipoVendido: {
        ...h.tipoVendido,
        precioBase: Number(h.tipoVendido.precioBase) // Limpiamos precio base del tipo
      },
      habitacion: {
        ...h.habitacion,
        tipoActual: {
          ...h.habitacion.tipoActual,
          precioBase: Number(h.habitacion.tipoActual.precioBase) // Limpiamos el tipo actual físico
        }
      }
    })),
    
    // Simplificamos para la card
    tipoActualNombre: res.habitaciones[0]?.habitacion.tipoActual.nombre || "Estándar",
  }));

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto space-y-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-[0.2em]">
            <Calendar size={14} strokeWidth={3} /> Recepción Hotel
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">
            Reservas <span className="text-blue-600">({reservas.length})</span>
          </h1>
        </div>

        <Link href="/dashboard/reservas/nueva">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-black px-8 h-16 rounded-[2rem] shadow-2xl shadow-blue-200 border-none">
            <Plus className="mr-2" size={24} strokeWidth={3} /> NUEVA RESERVA
          </Button>
        </Link>
      </div>

      {/* BÚSQUEDA */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <Input 
            placeholder="Buscar por cliente, documento o habitación..." 
            className="pl-12 h-14 bg-white rounded-2xl border-slate-100 shadow-sm"
          />
        </div>
      </div>

      {/* LISTADO */}
      <div className="grid grid-cols-1 gap-5">
        {reservas.length === 0 ? (
          <div className="py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-bold">No hay reservas para mostrar</p>
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