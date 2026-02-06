/* eslint-disable @typescript-eslint/no-explicit-any */
// dashboard/reservas/_components/ReservaCard.tsx
"use client";

import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  Phone, 
  Mail, 
  ArrowRight, 
  CreditCard,
} from "lucide-react";
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
  const total = Number(reserva.totalReserva);

  const statusConfig: Record<string, { color: string, label: string }> = {
    CONFIRMADA: { color: "bg-blue-500", label: "Confirmada" },
    PENDIENTE: { color: "bg-amber-500", label: "Pendiente" },
    CHECK_IN: { color: "bg-emerald-500", label: "In House" },
    CHECK_OUT: { color: "bg-slate-500", label: "Finalizada" },
  };

  const config = statusConfig[reserva.estado] || statusConfig.PENDIENTE;

  return (
    <Card 
      // Hacemos que toda la tarjeta sea clicable
      onClick={() => router.push(`/dashboard/reservas/${reserva.id}`)}
      className={cn(
        "group relative overflow-hidden border-slate-200 transition-all cursor-pointer",
        "hover:shadow-xl hover:border-blue-300 hover:scale-[1.01] active:scale-[0.99]"
      )}
    >
      <div className={cn("absolute left-0 top-0 bottom-0 w-1", config.color)} />

      <div className="flex flex-col md:flex-row items-stretch p-5 gap-6">
        
        {/* IZQUIERDA: BADGE DEL NÚMERO */}
        <div className="flex items-center md:items-start justify-center">
          <div className="h-20 w-20 rounded-2xl bg-white border-2 border-slate-100 shadow-sm flex flex-col items-center justify-center transition-all group-hover:border-blue-100 group-hover:bg-blue-50/30">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">HAB</span>
            <span className="text-3xl font-black text-slate-800 tracking-tighter">
              {detalleHab?.habitacion.numero || "---"}
            </span>
          </div>
        </div>

        {/* CENTRO: DATOS DEL CLIENTE */}
        <div className="flex-1 space-y-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                {reserva.cliente.nombre}
              </h3>
              <Badge className={cn("text-[10px] uppercase font-bold text-white border-none shadow-none", config.color)}>
                {config.label}
              </Badge>
            </div>
            
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <Phone size={14} className="text-slate-400" /> {reserva.cliente.telefono || "Sin teléfono"}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <Mail size={14} className="text-slate-400" /> {reserva.cliente.email || "Sin email"}
              </span>
            </div>
          </div>

          {/* BLOQUE DE FECHAS */}
          <div className="inline-flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 group-hover:bg-white transition-colors">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-slate-400 uppercase">Entrada</span>
              <span className="text-sm font-black text-slate-700">
                {format(reserva.fechaCheckIn, "dd MMM yyyy", { locale: es })}
              </span>
            </div>
            <ArrowRight size={16} className="text-slate-300" />
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-slate-400 uppercase">Salida</span>
              <span className="text-sm font-black text-slate-700">
                {format(reserva.fechaCheckOut, "dd MMM yyyy", { locale: es })}
              </span>
            </div>
          </div>
        </div>

        {/* DERECHA: TIPOS Y TOTAL */}
        <div className="flex flex-col justify-between items-end min-w-50 border-t md:border-t-0 md:border-l border-dashed border-slate-200 pt-4 md:pt-0 md:pl-6">
          <div className="text-right space-y-1">
            <div className="flex items-center justify-end gap-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Vendido como:</span>
              <span className="text-[11px] font-black text-blue-600 uppercase">
                {detalleHab?.tipoVendido.nombre}
              </span>
            </div>
            <div className="flex items-center justify-end gap-1.5">
              <span className="text-[10px] font-bold text-slate-300 uppercase italic">Física:</span>
              <span className="text-[11px] font-bold text-slate-400 uppercase italic">
                {reserva.tipoActualNombre || "Estándar"}
              </span>
            </div>
          </div>

          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Reserva</p>
            <div className="flex items-center justify-end gap-1">
              <span className="text-2xl font-black text-slate-900">
                ${total.toLocaleString()}
              </span>
              <CreditCard size={18} className="text-slate-300" />
            </div>
          </div>
        </div>

        {/* EL BOTÓN DE ACCIÓN HA SIDO ELIMINADO */}
      </div>
    </Card>
  );
}