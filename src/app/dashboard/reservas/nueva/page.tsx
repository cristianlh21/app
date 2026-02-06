// dashboard/reservas/page.tsx
"use client";

import { useReservaStore } from "../useReservaStore";
import { Step1Fechas } from "./_components/Step1Fechas";
import { cn } from "@/lib/utils";
import { Step2Cliente } from "./_components/Step2Cliente";
import { Step3Pagos } from "./_components/Step3Pagos";
import { Step4Resumen } from "./_components/Step4Resumen";

export default function NuevaReservaPage() {
  const { currentStep } = useReservaStore();

  const steps = [
    { id: 1, label: "Fechas y Habitación" },
    { id: 2, label: "Titular" },
    { id: 3, label: "Pagos" },
    { id: 4, label: "Confirmación" },
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-black text-slate-800 tracking-tighter">Nueva Reserva</h1>
        <p className="text-slate-500">Sigue los pasos para registrar una nueva estadía.</p>
      </header>

      {/* INDICADOR DE PASOS (Stepper) */}
      <nav className="flex justify-between relative before:content-[''] before:absolute before:top-5 before:left-0 before:w-full before:h-0.5 before:bg-slate-200 before:-z-10">
        {steps.map((s) => (
          <div key={s.id} className="flex flex-col items-center gap-2 bg-white px-4">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-colors",
              currentStep === s.id ? "bg-blue-600 border-blue-600 text-white shadow-lg" : 
              currentStep > s.id ? "bg-green-500 border-green-500 text-white" : "bg-white border-slate-300 text-slate-400"
            )}>
              {currentStep > s.id ? "✓" : s.id}
            </div>
            <span className={cn(
              "text-[10px] uppercase font-black tracking-widest",
              currentStep === s.id ? "text-blue-600" : "text-slate-400"
            )}>
              {s.label}
            </span>
          </div>
        ))}
      </nav>

      {/* CONTENIDO DEL PASO ACTUAL */}
      <main className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 min-h-100">
        {currentStep === 1 && <Step1Fechas />}
        {currentStep === 2 && <Step2Cliente/>}
        {currentStep === 3 && <Step3Pagos />}
        {currentStep === 4 && <Step4Resumen/>}
      </main>
    </div>
  );
}