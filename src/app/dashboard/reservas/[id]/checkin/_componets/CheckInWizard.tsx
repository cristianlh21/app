/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/dashboard/reservas/[id]/checkin/_components/CheckInWizard.tsx
"use client";

import { useEffect } from "react";
import { useCheckInStore } from "../_lib/useCheckInStore";
import { Step1Habitacion } from "./Step1Habitacion";
import { Step2Huespedes } from "./Step2Huespedes";
import { Step3Servicios } from "./Step3Servicios";
import { Step4Finalizar } from "./Step4Finalizar";
import { Progress } from "@/components/ui/progress";

export function CheckInWizard({ initialData }: { initialData: any }) {
  const { currentStep, setInitialData, reset } = useCheckInStore();

  useEffect(() => {
    reset(); 
    setInitialData(initialData);
    return () => reset();
  }, [initialData, setInitialData, reset]);

  const progressValue = (currentStep / 4) * 100;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="space-y-3">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Registro de Ingreso</p>
            <h2 className="text-sm font-black text-slate-900 uppercase">
              Paso {currentStep}: {currentStep === 1 ? "Verificación" : currentStep === 2 ? "Huéspedes" : currentStep === 3 ? "Cargos" : "Finalizar"}
            </h2>
          </div>
          <span className="text-2xl font-black text-slate-200 tracking-tighter">0{currentStep} / 04</span>
        </div>
        <Progress value={progressValue} className="h-1.5 bg-slate-100" />
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl p-6 md:p-12 min-h-125">
        {currentStep === 1 && <Step1Habitacion />}
        {currentStep === 2 && <Step2Huespedes />}
        {currentStep === 3 && <Step3Servicios />}
        {currentStep === 4 && <Step4Finalizar />}
      </div>
    </div>
  );
}