"use client";

import { useWalkInStore } from "./_lib/useWalkInStore";
import { Step1Fechas } from "./_components/Step1Fechas";
// Importaremos los demás a medida que los creemos:
// import { Step2Huespedes } from "./_components/Step2Huespedes";
// import { Step3Servicios } from "./_components/Step3Servicios";
// import { Step4Confirmacion } from "./_components/Step4Confirmacion";

import { 
  UserPlus, 
  ArrowLeft,
  LayoutDashboard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Step2Huespedes } from "./_components/Step2Huespedes";
import { Step3Servicios } from "./_components/Step3Servicios";
import { Step4Confirmacion } from "./_components/Step4Confirmacion";

export default function WalkInPage() {
  const step = useWalkInStore((state) => state.currentStep);
  const habitacionId = useWalkInStore((state) => state.habitacionId);
  const numeroHab = useWalkInStore((state) => state.numeroHabitacion);
  const router = useRouter();

  // SEGURIDAD: Si no hay habitación cargada (ej: refresh de página), 
  // volvemos al mapa de habitaciones.
  if (habitacionId === 0) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center space-y-4">
        <div className="p-6 bg-slate-50 rounded-full text-slate-300">
           <LayoutDashboard size={64} />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Sin unidad seleccionada</h2>
          <p className="text-sm text-slate-500 font-medium">Por favor, seleccioná una habitación desde el mapa.</p>
        </div>
        <Button 
          onClick={() => router.push("/dashboard/habitaciones")}
          className="rounded-2xl bg-slate-900 font-black uppercase tracking-widest text-xs h-12 px-8"
        >
          Volver al Mapa
        </Button>
      </div>
    );
  }

  // Definición de los pasos para el indicador visual
  const steps = [
    { id: 1, label: "Fechas" },
    { id: 2, label: "Huéspedes" },
    { id: 3, label: "Servicios" },
    { id: 4, label: "Finalizar" },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 pb-24">
      
      {/* HEADER DINÁMICO */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-blue-100 animate-in zoom-in duration-500">
            <UserPlus size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">
              Check-In Rápido
            </h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              Unidad Seleccionada: <span className="text-blue-600">Habitación {numeroHab}</span>
            </p>
          </div>
        </div>

        <Button 
          variant="ghost" 
          onClick={() => router.push("/dashboard/habitaciones")}
          className="rounded-2xl text-slate-400 font-bold hover:bg-slate-50 self-start md:self-center"
        >
          <ArrowLeft className="mr-2" size={18} /> Cancelar Proceso
        </Button>
      </header>

      {/* INDICADOR DE PROGRESO (Stepper) */}
      <nav className="flex items-center justify-between max-w-2xl mx-auto bg-white p-2 rounded-full border border-slate-100 shadow-sm">
        {steps.map((s, idx) => (
          <div key={s.id} className="flex items-center flex-1 last:flex-none">
            <div className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-500",
              step === s.id ? "bg-slate-900 text-white shadow-lg scale-105" : "text-slate-400"
            )}>
              <span className={cn(
                "h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-black",
                step === s.id ? "bg-blue-500" : "bg-slate-100 text-slate-400"
              )}>
                {s.id}
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">
                {s.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className="flex-1 h-px bg-slate-100 mx-2" />
            )}
          </div>
        ))}
      </nav>

      {/* CONTENIDO DEL PASO ACTUAL */}
      <main className="min-h-[500px]">
        {step === 1 && <Step1Fechas />}
        {step === 2 && <Step2Huespedes />}
        {step === 3 && <Step3Servicios />}
        {/* Aquí irán los demás pasos... */}
        {step === 4 && <Step4Confirmacion/>}
      </main>

    </div>
  );
}