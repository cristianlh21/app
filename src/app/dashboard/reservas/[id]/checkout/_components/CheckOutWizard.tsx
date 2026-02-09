/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/dashboard/reservas/[id]/checkout/_components/CheckOutWizard.tsx
"use client";

import { useEffect } from "react";
import { useCheckOutStore } from "../_lib/useCheckOutStore";
import { Step1EstadoCuenta } from "./Step1EstadoCuenta";
import { Step2CobroFinal } from "./Step2CobroFinal";
import { Step3Confirmacion } from "./Step3Confirmacion";
import { 
  Receipt, 
  CreditCard, 
  CheckCircle2, 
  ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Props {
  initialData: {
    reservaId: number;
    titularNombre: string;
    habitacionNumero: string;
    totalEstadia: number;
    pagosRealizados: any[];
    consumosExtras: any[];
  };
}

export function CheckOutWizard({ initialData }: Props) {
  const currentStep = useCheckOutStore((state) => state.currentStep);
  const setInitialData = useCheckOutStore((state) => state.setInitialData);
  const router = useRouter();

  // Extraemos el ID para usarlo como disparador estable
  const { reservaId } = initialData;

  useEffect(() => {
    setInitialData(initialData);
    
    // Usamos el disable de eslint porque solo queremos sincronizar cuando 
    // cambia el ID de la reserva, evitando bucles por cambios en el objeto initialData
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reservaId, setInitialData]); 

  const steps = [
    { id: 1, label: "Estado de Cuenta", icon: <Receipt size={16} /> },
    { id: 2, label: "Cobro de Saldo", icon: <CreditCard size={16} /> },
    { id: 3, label: "Finalizar", icon: <CheckCircle2 size={16} /> },
  ];

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-700">
      
      {/* HEADER DE LA OPERACIÓN */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-[1.8rem] bg-slate-900 text-white flex items-center justify-center font-black text-2xl shadow-xl shadow-slate-200">
            {initialData.habitacionNumero}
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-none">
              Check-Out: {initialData.titularNombre}
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">
                Folio de Salida • Reserva #{initialData.reservaId}
            </p>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          onClick={() => router.push(`/dashboard/reservas/${initialData.reservaId}`)}
          className="rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-slate-600"
        >
          <ArrowLeft className="mr-2" size={14} /> Volver a la Reserva
        </Button>
      </div>

      {/* INDICADOR DE PASOS */}
      <nav className="flex justify-center">
        <div className="flex items-center gap-1 bg-slate-100/50 p-1.5 rounded-full border border-slate-100">
          {steps.map((step, idx) => (
            <div key={step.id} className="flex items-center">
              <div className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-500",
                currentStep === step.id 
                  ? "bg-white text-slate-900 shadow-md scale-105" 
                  : "text-slate-400 opacity-60"
              )}>
                <span className={cn(
                  "p-1.5 rounded-xl transition-colors",
                  currentStep === step.id ? "bg-blue-600 text-white" : "bg-transparent"
                )}>
                  {step.icon}
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {step.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className="w-4 h-px bg-slate-200 mx-1" />
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* RENDERIZADO DE PASOS */}
      <main className="max-w-3xl mx-auto pt-4">
        {currentStep === 1 && <Step1EstadoCuenta />}
        {currentStep === 2 && <Step2CobroFinal />}
        {currentStep === 3 && <Step3Confirmacion />}
      </main>

    </div>
  );
}