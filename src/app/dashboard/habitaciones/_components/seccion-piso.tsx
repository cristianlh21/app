// dashboard/habitaciones/_components/seccion-piso.tsx
"use client";

import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { HabitacionCard } from "./habitacion-card";
import { HabitacionExtended } from "../typesHabitaciones";

interface SeccionPisoProps {
  nombrePiso: string;
  habitaciones: HabitacionExtended[];
}

const formatPisoName = (name: string) => {
  return name.replace("_", " ").toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
};

export function SeccionPiso({ nombrePiso, habitaciones }: SeccionPisoProps) {
  return (
    <AccordionItem 
      value={nombrePiso} 
      className="border-none mb-6 bg-white/40 backdrop-blur-md rounded-xl overflow-hidden shadow-sm border border-slate-200/50"
    >
      <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-slate-50/50 transition-colors">
        <div className="flex items-center gap-4">
          <span className="text-xl font-bold text-slate-700 tracking-tight">
            {formatPisoName(nombrePiso)}
          </span>
          <span className="text-xs font-bold px-3 py-1 bg-slate-200/50 text-slate-600 rounded-full">
            {habitaciones.length} Unidades
          </span>
        </div>
      </AccordionTrigger>
      
      <AccordionContent className="px-6 pb-8 pt-4">
        {/* Mantenemos el grid de 4 para que respiren las cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {habitaciones.map((hab) => (
            <HabitacionCard 
              key={hab.id} 
              habitacion={hab} 
            />
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}