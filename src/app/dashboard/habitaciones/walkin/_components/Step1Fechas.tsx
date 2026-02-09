// src/app/dashboard/habitaciones/walkin/_components/Step1Fechas.tsx
"use client";

import { useWalkInStore } from "../_lib/useWalkInStore";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Moon, 
  Info, 
  Hotel,
  CalendarIcon
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export function Step1Fechas() {
  const store = useWalkInStore();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const noches = store.getNoches();
  const totalEstadia = store.calcTotalEstadia();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LADO IZQUIERDO: CALENDARIO */}
        <Card className="lg:col-span-7 p-6 rounded-[2.5rem] border-slate-100 shadow-xl bg-white">
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
              <CalendarIcon size={20} />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tighter">Fecha de Salida</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">¿Cuándo libera la habitación?</p>
            </div>
          </div>

          <div className="flex justify-center border-t border-slate-50 pt-6">
            <Calendar
              mode="single"
              selected={store.fechaCheckOut}
              onSelect={(date) => date && store.setFechaOut(date)}
              disabled={(date) => date <= today}
              initialFocus
              locale={es}
              className="rounded-md border-none"
            />
          </div>
        </Card>

        {/* LADO DERECHO: RESUMEN OPERATIVO */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-8 rounded-[2.5rem] bg-slate-900 text-white shadow-2xl relative border-none overflow-hidden">
            <Hotel className="absolute -right-4 -top-4 opacity-10" size={120} />
            
            <div className="relative z-10 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Unidad</p>
                  <h4 className="text-4xl font-black italic tracking-tighter">{store.numeroHabitacion}</h4>
                </div>
                <div className="px-3 py-1 bg-white/10 rounded-full border border-white/10">
                   <span className="text-[9px] font-black uppercase tracking-widest">{store.tipoNombre}</span>
                </div>
              </div>

              <div className="h-px bg-white/10 w-full" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Moon className="text-blue-400" size={16} />
                  <span className="text-sm font-bold uppercase tracking-tight">Noches</span>
                </div>
                <span className="text-2xl font-black">{noches}</span>
              </div>

              <div className="space-y-1 pt-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Monto Estadía</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black tracking-tighter">${totalEstadia.toLocaleString()}</span>
                  <span className="text-xs font-bold text-slate-500">ARS</span>
                </div>
              </div>
            </div>
          </Card>

          <div className="p-5 bg-blue-50/50 border border-blue-100 rounded-[2rem] flex items-start gap-3">
             <Info className="text-blue-500 shrink-0 mt-0.5" size={16} />
             <p className="text-[11px] font-bold text-blue-800 leading-relaxed uppercase tracking-tight">
               Salida programada: {format(store.fechaCheckOut, "PPPP", { locale: es })}
             </p>
          </div>

          <Button 
            onClick={() => store.setStep(2)}
            className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl transition-all active:scale-95 group"
          >
            Continuar a Huéspedes <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}