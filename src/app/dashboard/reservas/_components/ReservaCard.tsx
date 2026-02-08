/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/dashboard/reservas/_components/ReservaCard.tsx
"use client";

import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Phone, Mail, ArrowRight, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ReservaCardProps {
  reserva: {
    id: number;
    estado: string;
    totalReserva: number;
    fechaCheckIn: Date;
    fechaCheckOut: Date;
    cliente: { 
        nombre: string; 
        telefono: string | null; 
        email: string | null; 
    };
    habitaciones: any[];
    tipoActualNombre?: string; 
  };
}

export function ReservaCard({ reserva }: ReservaCardProps) {
  const router = useRouter();
  const detalleHab = reserva.habitaciones[0];

  // Configuración de estados (Colores y etiquetas)
  const statusConfig: Record<string, { color: string, label: string }> = {
    CONFIRMADA: { color: "bg-blue-500", label: "Confirmada" },
    PENDIENTE: { color: "bg-amber-500", label: "Pendiente" },
    CHECK_IN: { color: "bg-emerald-500", label: "In House" },
    CHECK_OUT: { color: "bg-slate-500", label: "Finalizada" },
    CANCELADA: { color: "bg-rose-500", label: "Cancelada" },
    NO_SHOW: { color: "bg-gray-800", label: "No-Show" },
  };

  const config = statusConfig[reserva.estado] || statusConfig.PENDIENTE;

  // Función de formato de moneda (es-AR para Salta, Argentina)
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card 
      onClick={() => router.push(`/dashboard/reservas/${reserva.id}`)}
      className="group relative overflow-hidden border-slate-200 transition-all cursor-pointer hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]"
    >
      {/* Indicador lateral de color */}
      <div className={cn("absolute left-0 top-0 bottom-0 w-1", config.color)} />

      <div className="flex flex-col md:flex-row items-stretch p-5 gap-6">
        
        {/* AVATAR NÚMERO HABITACIÓN */}
        <div className="flex items-center justify-center">
          <div className="h-20 w-20 rounded-2xl bg-white border-2 border-slate-100 shadow-sm flex flex-col items-center justify-center transition-colors group-hover:border-blue-100">
            <span className="text-[10px] font-black text-slate-400 uppercase leading-none">HAB</span>
            <span className="text-3xl font-black text-slate-800 tracking-tighter leading-none">
              {detalleHab?.habitacion.numero || "---"}
            </span>
          </div>
        </div>

        {/* INFO CLIENTE Y FECHAS */}
        <div className="flex-1 space-y-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                {reserva.cliente.nombre}
              </h3>
              <Badge className={cn("text-[10px] uppercase font-bold text-white border-none", config.color)}>
                {config.label}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <Phone size={14} className="text-slate-400" /> {reserva.cliente.telefono || "---"}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <Mail size={14} className="text-slate-400" /> {reserva.cliente.email || "---"}
              </span>
            </div>
          </div>

          <div className="inline-flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
            <span className="text-sm font-black text-slate-700">
                {format(new Date(reserva.fechaCheckIn), "dd MMM", { locale: es })}
            </span>
            <ArrowRight size={14} className="text-slate-300" />
            <span className="text-sm font-black text-slate-700">
                {format(new Date(reserva.fechaCheckOut), "dd MMM", { locale: es })}
            </span>
          </div>
        </div>

        {/* TIPOS Y TOTAL */}
        <div className="flex flex-col justify-between items-end min-w-50 border-t md:border-t-0 md:border-l border-dashed border-slate-200 pt-4 md:pt-0 md:pl-6">
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase">
                Vendido: <span className="text-blue-600">{detalleHab?.tipoVendido.nombre}</span>
            </p>
            <p className="text-[10px] text-slate-300 italic uppercase">
                Física: {reserva.tipoActualNombre}
            </p>
          </div>
          
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Reserva</p>
            <div className="flex items-center justify-end gap-1">
              {/* USAMOS suppressHydrationWarning PARA EVITAR EL ERROR DE HIDRATACIÓN */}
              <span 
                suppressHydrationWarning 
                className="text-2xl font-black text-slate-900 leading-none"
              >
                {formatCurrency(reserva.totalReserva)}
              </span>
              <CreditCard size={18} className="text-slate-200" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}