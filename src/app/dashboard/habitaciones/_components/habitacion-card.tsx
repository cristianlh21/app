// src/app/dashboard/habitaciones/_components/habitacion-card.tsx
"use client";

import { useTransition } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Eraser, Wrench, User, Banknote, Loader2 } from "lucide-react";
import { HabitacionCardProps } from "../typesHabitaciones";
import { toggleLimpiezaAction, toggleMantenimientoAction } from "../_actions";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function HabitacionCard({ habitacion, reserva }: HabitacionCardProps) {
  const [isPending, startTransition] = useTransition();

  const colors = {
    libre: "#88c54c",       // Verde
    ocupada: "#b5604f",     // Marrón/Rojo
    mantenimiento: "#cb2a46",// Rojo intenso
    checkin: "#a6527c",     // Violeta
    sucia: "#c6e819"        // Amarillo/Verde limón
  };

  // Función para que el texto se vea bien (quita guiones bajos)
  const formatStatusText = (text: string) => {
    return text.replace(/_/g, " ");
  };

  const getStatusColor = () => {
    // 1. Prioridad: Mantenimiento
    if (habitacion.estadoLimpieza === "EN_MANTENIMIENTO") return colors.mantenimiento;
    
    // 2. Prioridad: Ocupada (si está ocupada, no importa si está sucia para el color principal)
    if (habitacion.disponibilidad === "OCUPADA") return colors.ocupada;
    
    // 3. Prioridad: Check-In hoy (Reserva pendiente de entrar)
    if (reserva?.esCheckInHoy) return colors.checkin;
    
    // 4. Prioridad: Sucia (Si está libre pero sucia, debe resaltar en amarillo)
    if (habitacion.estadoLimpieza === "SUCIA") return colors.sucia;
    
    // 5. Por defecto: Libre y Limpia
    return colors.libre;
  };

  const statusColor = getStatusColor();

  const handleLimpieza = () => {
    startTransition(() => toggleLimpiezaAction(habitacion.id, habitacion.estadoLimpieza));
  };

  const handleMantenimiento = () => {
    startTransition(() => toggleMantenimientoAction(habitacion.id, habitacion.estadoLimpieza));
  };

  return (
    <Card 
      className={cn(
        "group overflow-hidden border border-slate-200 border-l-4 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full bg-white p-0",
        isPending && "opacity-60"
      )}
      style={{ borderLeftColor: statusColor }}
    >
      {/* CABECERA */}
      <div 
        className="flex justify-between items-center px-4 py-3 border-b w-full m-0"
        style={{ backgroundColor: `${statusColor}08` }} 
      >
        <div className="flex flex-col">
          <span 
            className="text-3xl font-black tracking-tighter leading-none" 
            style={{ color: statusColor }}
          >
            {habitacion.numero}
          </span>
          <span 
            className="text-[10px] font-bold uppercase tracking-wider mt-1"
            style={{ 
                color: habitacion.estadoLimpieza === "LIMPIA" ? colors.libre : colors.sucia 
            }}
          >
            {formatStatusText(habitacion.estadoLimpieza)}
          </span>
        </div>
        
        <div 
          className="text-[10px] font-black px-3 py-1 rounded-md text-white uppercase shadow-sm flex items-center gap-2"
          style={{ backgroundColor: statusColor }}
        >
          {isPending && <Loader2 size={10} className="animate-spin" />}
          {reserva?.esCheckInHoy ? "Check-In" : habitacion.disponibilidad}
        </div>
      </div>

      {/* CUERPO */}
      <div className="p-5 grow flex flex-col gap-4">
        <div className="flex flex-col border-b border-slate-100 pb-2">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Configuración</span>
          <div className="flex justify-between items-baseline mt-1">
            <span className="text-sm font-semibold text-slate-600">{habitacion.tipoBase?.nombre}</span>
            <span className="text-[10px] text-slate-400 italic">Base</span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-sm font-bold text-slate-800">{habitacion.tipoActual?.nombre}</span>
            <span className="text-[10px] text-slate-400 italic">Vendido</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          {habitacion.disponibilidad === "OCUPADA" || reserva?.esCheckInHoy ? (
            <div className="flex items-center gap-2 text-slate-700 bg-slate-50 p-2 rounded-lg w-full">
              <User size={16} style={{ color: statusColor }} />
              <span className="text-sm font-bold truncate">
                {reserva?.titular || "Nombre del Huésped"}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Banknote size={18} className="text-slate-400" />
              <span className="text-xl font-black text-slate-800">
                ${Number(habitacion.tipoActual?.precioBase || 0).toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-auto grid grid-cols-3 divide-x divide-slate-100 border-t bg-slate-50 w-full m-0">
        <Button 
          variant="ghost" 
          onClick={handleLimpieza}
          disabled={isPending}
          className="rounded-none h-12 hover:bg-white hover:text-green-600 transition-colors p-0"
        >
          <Eraser 
            size={18} 
            className={cn(
                habitacion.estadoLimpieza === "SUCIA" ? "text-yellow-600" : "text-slate-400"
            )} 
          />
        </Button>
        <Button 
          variant="ghost" 
          onClick={handleMantenimiento}
          disabled={isPending}
          className="rounded-none h-12 hover:bg-white hover:text-red-600 transition-colors p-0"
        >
          <Wrench 
            size={18} 
            className={cn(
                habitacion.estadoLimpieza === "EN_MANTENIMIENTO" ? "text-red-600" : "text-slate-400"
            )} 
          />
        </Button>
        <Button 
          variant="ghost" 
          asChild
          className="rounded-none h-12 hover:bg-white hover:text-blue-600 transition-colors p-0"
        >
          <Link href={`/dashboard/habitaciones/${habitacion.id}`}>
            <Settings size={18} className="text-slate-400" />
          </Link>
        </Button>
      </div>
    </Card>
  );
}