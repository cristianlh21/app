/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Eraser, Wrench, User, CalendarClock } from "lucide-react";
import { toggleLimpiezaAction, toggleMantenimientoAction } from "../_actions";
import { useWalkInStore } from "../walkin/_lib/useWalkInStore";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function HabitacionCard({ habitacion }: { habitacion: any }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const store = useWalkInStore();

  const reservaRelacion = habitacion.reservas?.[0]; 
  const reservaData = reservaRelacion?.reserva;
  const hoyStr = new Date().setHours(0, 0, 0, 0);

  const esCheckInHoy = reservaData && new Date(reservaData.fechaCheckIn).setHours(0, 0, 0, 0) === hoyStr;
  const esCheckOutHoy = reservaData && new Date(reservaData.fechaCheckOut).setHours(0, 0, 0, 0) === hoyStr;
  const estaOcupada = habitacion.disponibilidad === "OCUPADA";

  const colors = {
    libre: "#88c54c", ocupada: "#b5604f", checkin: "#a6527c", checkout: "#f97316", sucia: "#c6e819", mantenimiento: "#cb2a46"
  };

  const getStatus = () => {
    if (habitacion.estadoLimpieza === "EN_MANTENIMIENTO") return { color: colors.mantenimiento, label: "Bloqueada", glow: false };
    if (estaOcupada && esCheckOutHoy) return { color: colors.checkout, label: "Salida Hoy", glow: true };
    if (estaOcupada) return { color: colors.ocupada, label: "Ocupada", glow: false };
    if (esCheckInHoy) return { color: colors.checkin, label: "Ingreso Hoy", glow: true };
    if (habitacion.estadoLimpieza === "SUCIA") return { color: colors.sucia, label: "Sucia", glow: false };
    return { color: colors.libre, label: "Libre", glow: false };
  };

  const status = getStatus();

  return (
    <Card 
      onClick={() => {
        if (estaOcupada || esCheckInHoy) return router.push(`/dashboard/reservas/${reservaData.id}`);
        if (habitacion.disponibilidad === "LIBRE") {
          store.reset();
          store.setRoom(habitacion.id, habitacion.numero, habitacion.tipoActual.id, habitacion.tipoActual.nombre, habitacion.tipoActual.precioBase);
          router.push(`/dashboard/habitaciones/walkin`);
        }
      }}
      className={cn(
        "group overflow-hidden border border-slate-200 border-l-[6px] shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full bg-white p-0 cursor-pointer active:scale-[0.98]",
        isPending && "opacity-60"
      )}
      style={{ borderLeftColor: status.color }}
    >
      {/* HEADER - OCUPA TODO EL ANCHO SUPERIOR */}
      <div 
        className="flex justify-between items-center px-4 py-3 border-b w-full m-0" 
        style={{ backgroundColor: `${status.color}08` }}
      >
        <div className="flex flex-col">
          <span className={cn("text-3xl font-black tracking-tighter leading-none transition-all", status.glow && "animate-pulse")} style={{ color: status.color }}>
            {habitacion.numero}
          </span>
          <span className="text-[10px] font-black uppercase text-slate-400 mt-1">{habitacion.tipoActual.nombre}</span>
        </div>
        <div className="text-[9px] font-black px-3 py-1 rounded-full text-white uppercase shadow-sm" style={{ backgroundColor: status.color }}>
          {status.label}
        </div>
      </div>

      {/* CUERPO - CON PADDING INTERNO */}
      <div className="p-5 grow flex flex-col justify-center gap-4">
        {estaOcupada ? (
          <div className="space-y-2">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Huéspedes</p>
            <div className="flex flex-wrap gap-1.5">
              {reservaRelacion?.huespedes?.map((h: any) => (
                <div key={h.huesped.id} className="bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                  <User size={10} style={{ color: status.color }} />
                  <span className="text-[10px] font-black text-slate-700 uppercase">{h.huesped.apellido}</span>
                </div>
              ))}
            </div>
          </div>
        ) : esCheckInHoy ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-violet-600 bg-violet-50 p-2.5 rounded-xl border border-violet-100 shadow-inner">
               <CalendarClock size={16} />
               <span className="text-xs font-black uppercase italic truncate">{reservaData?.cliente.nombre}</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Disponible</p>
             <span className="text-2xl font-black text-slate-800">${habitacion.tipoActual.precioBase.toLocaleString()}</span>
          </div>
        )}
      </div>

      {/* FOOTER - OCUPA TODO EL ANCHO INFERIOR */}
      <div className="mt-auto grid grid-cols-3 divide-x divide-slate-100 border-t bg-slate-50 w-full m-0">
        <Button variant="ghost" className="h-12 rounded-none hover:bg-white p-0" onClick={(e) => {
          e.stopPropagation();
          startTransition(() => toggleLimpiezaAction(habitacion.id, habitacion.estadoLimpieza));
        }}>
          <Eraser size={18} className={habitacion.estadoLimpieza === "SUCIA" ? "text-yellow-600" : "text-slate-300"} />
        </Button>
        <Button variant="ghost" className="h-12 rounded-none hover:bg-white p-0" onClick={(e) => {
          e.stopPropagation();
          startTransition(() => toggleMantenimientoAction(habitacion.id, habitacion.estadoLimpieza));
        }}>
          <Wrench size={18} className={habitacion.estadoLimpieza === "EN_MANTENIMIENTO" ? "text-rose-600" : "text-slate-300"} />
        </Button>
        <Button variant="ghost" asChild className="h-12 rounded-none hover:bg-white p-0" onClick={(e) => e.stopPropagation()}>
          <Link href={`/dashboard/habitaciones/${habitacion.id}`} className="flex items-center justify-center w-full h-full">
            <Settings size={18} className="text-slate-300" />
          </Link>
        </Button>
      </div>
    </Card>
  );
}