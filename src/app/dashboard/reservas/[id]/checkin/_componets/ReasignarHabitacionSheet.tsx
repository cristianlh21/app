/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/dashboard/reservas/[id]/checkin/_components/ReasignarHabitacionSheet.tsx
"use client";

import { useState } from "react";
import { useCheckInStore } from "../_lib/useCheckInStore";
import { getDisponibilidadAction } from "../../../_actions";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetDescription 
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Hotel, Check, MapPin, Sparkles, Info } from "lucide-react";
import { cn } from "@/lib/utils";

// Mapeo para mostrar los Enums de forma amigable
const PISOS_LABELS: Record<string, string> = {
  PLANTA_BAJA: "Planta Baja",
  PRIMER_PISO: "Primer Piso",
  SEGUNDO_PISO: "Segundo Piso",
  TERCER_PISO: "Tercer Piso",
  CUARTO_PISO: "Cuarto Piso",
};

// Orden de visualización para que no queden mezclados
const PISOS_ORDEN = ["PLANTA_BAJA", "PRIMER_PISO", "SEGUNDO_PISO", "TERCER_PISO", "CUARTO_PISO"];

export function ReasignarHabitacionSheet() {
  const store = useCheckInStore();
  const [habitaciones, setHabitaciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const cargarDisponibilidad = async () => {
    if (!store.fechaCheckIn || !store.fechaCheckOut) return;
    setLoading(true);
    try {
        const data = await getDisponibilidadAction(store.fechaCheckIn, store.fechaCheckOut);
        setHabitaciones(data);
    } finally {
        setLoading(false);
    }
  };

  // LÓGICA DE AGRUPACIÓN POR EL ENUM 'PISO'
  const habitacionesPorPiso = habitaciones.reduce((acc: any, hab) => {
    const piso = hab.piso; 
    if (!acc[piso]) acc[piso] = [];
    acc[piso].push(hab);
    return acc;
  }, {});

  const handleSeleccionar = (hab: any) => {
    store.cambiarHabitacion({
      id: hab.id,
      numero: hab.numero,
      tipoId: hab.tipoActualId,
      tipoNombre: hab.tipoActual.nombre,
      precio: hab.tipoActual.precioBase
    });
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={(val) => {
      setOpen(val);
      if (val) cargarDisponibilidad();
    }}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-full text-[10px] font-black uppercase h-8 border-blue-200 text-blue-600 hover:bg-blue-50">
           Cambiar Unidad
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-137.5 bg-white p-0 border-l-0 shadow-2xl flex flex-col">
        
        <SheetHeader className="p-8 border-b border-slate-100 bg-slate-50/50">
          <SheetTitle className="text-3xl font-black tracking-tighter uppercase italic text-slate-900">
            Reasignar Unidad
          </SheetTitle>
          <SheetDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            Inventario real de ShaurdHotel por Niveles
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-300">
               <div className="animate-bounce mb-4"><Hotel size={40}/></div>
               <p className="text-[10px] font-black uppercase tracking-widest">Consultando disponibilidad...</p>
            </div>
          ) : (
            <Accordion type="multiple" defaultValue={PISOS_ORDEN} className="w-full space-y-6">
              {PISOS_ORDEN.map((pisoKey) => {
                const habs = habitacionesPorPiso[pisoKey] || [];
                if (habs.length === 0) return null;

                return (
                  <AccordionItem key={pisoKey} value={pisoKey} className="border-none">
                    <AccordionTrigger className="hover:no-underline py-0 mb-4">
                        <div className="flex items-center gap-3 w-full">
                            <div className="h-10 w-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500">
                                <MapPin size={18} />
                            </div>
                            <div className="text-left">
                                <h5 className="text-sm font-black uppercase text-slate-800 tracking-tighter">
                                    {PISOS_LABELS[pisoKey]}
                                </h5>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                    {habs.length} Unidades Disponibles
                                </p>
                            </div>
                            <div className="flex-1 border-b border-dashed border-slate-200 ml-4" />
                        </div>
                    </AccordionTrigger>

                    <AccordionContent className="pt-2 pb-6">
                      <div className="grid grid-cols-1 gap-4 px-2">
                        {habs.map((hab: any) => (
                          <button
                            key={hab.id}
                            onClick={() => handleSeleccionar(hab)}
                            className={cn(
                              "group relative w-full p-8 rounded-[3rem] border-2 transition-all duration-300 flex flex-col items-center justify-center text-center",
                              store.habitacionId === hab.id 
                                ? "bg-slate-900 border-slate-900 text-white shadow-2xl shadow-slate-300" 
                                : "bg-white border-slate-100 hover:border-blue-400 hover:shadow-xl text-slate-600"
                            )}
                          >
                            {/* TIPO ACTUAL */}
                            <p className={cn(
                              "text-[10px] font-black uppercase tracking-[0.2em] mb-3",
                              store.habitacionId === hab.id ? "text-slate-400" : "text-slate-300 group-hover:text-blue-500"
                            )}>
                              {hab.tipoActual.nombre}
                            </p>

                            {/* NÚMERO CENTRADO E IMPACTANTE */}
                            <h4 className="text-6xl font-black tracking-tighter leading-none mb-4">
                              {hab.numero}
                            </h4>
                            
                            {/* PRECIO Y ESTADO */}
                            <div className="flex flex-col items-center gap-3">
                              <div className={cn(
                                "flex items-center gap-1 font-black text-xl",
                                store.habitacionId === hab.id ? "text-emerald-400" : "text-slate-900"
                              )}>
                                  <span className="text-xs opacity-50">$</span>
                                  {hab.tipoActual.precioBase.toLocaleString()}
                                  <span className="text-[10px] opacity-40 uppercase ml-1">/ Noche</span>
                              </div>

                              <div className="flex gap-2">
                                <span className={cn(
                                    "text-[9px] font-black uppercase px-4 py-1.5 rounded-full flex items-center gap-1.5",
                                    hab.estadoLimpieza === "LIMPIA" 
                                        ? "bg-emerald-500 text-white" 
                                        : "bg-amber-500 text-white"
                                )}>
                                    <Sparkles size={10} /> {hab.estadoLimpieza}
                                </span>
                              </div>
                            </div>

                            {store.habitacionId === hab.id && (
                              <div className="absolute top-8 right-10 bg-emerald-500 text-white p-1 rounded-full shadow-lg">
                                 <Check size={18} />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-100">
            <div className="flex items-center gap-4 text-slate-400">
                <Info size={16} />
                <p className="text-[9px] font-bold uppercase tracking-widest leading-relaxed">
                    Al seleccionar una unidad de categoría diferente, se recalculará el total automáticamente.
                </p>
            </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}