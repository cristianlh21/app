// src/app/dashboard/reservas/[id]/checkout/_components/Step2CobroFinal.tsx
"use client";

import { useCheckOutStore } from "../_lib/useCheckOutStore";
import { Button } from "@/components/ui/button";
import { 
  Banknote, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  CreditCard,
  Wallet
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CobroForm } from "../../../_components/cobro-form";

export function Step2CobroFinal() {
  const store = useCheckOutStore();
  
  const saldoPendiente = store.getSaldoPendiente();
  const yaEstaSaldado = saldoPendiente <= 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* INDICADOR DE SALDO RESTANTE */}
      <div className={cn(
        "p-8 rounded-[3rem] text-white flex justify-between items-center shadow-xl transition-all duration-500",
        yaEstaSaldado ? "bg-emerald-600 shadow-emerald-100" : "bg-slate-900 shadow-slate-200"
      )}>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">
            {yaEstaSaldado ? "Cuenta Cubierta" : "Saldo por Cobrar"}
          </p>
          <h3 className="text-4xl font-black tracking-tighter">
            ${Math.max(0, saldoPendiente).toLocaleString()}
          </h3>
        </div>
        <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center">
          {yaEstaSaldado ? <CheckCircle2 size={32} /> : <Banknote size={32} />}
        </div>
      </div>

      {!yaEstaSaldado ? (
        <>
          {/* FORMULARIO DE COBRO */}
          <div className="bg-white rounded-[2.5rem] border border-slate-200 p-2 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
              <Wallet size={18} className="text-slate-400" />
              <h4 className="font-black text-slate-700 uppercase text-[10px] tracking-widest">Registrar Pago Final</h4>
            </div>
            <div className="p-4">
              <CobroForm
                onAdd={(pago) => store.agregarPagoFinal({ ...pago, fecha: new Date() })} 
                labelBoton="Confirmar Cobro" 
              />
            </div>
          </div>

          {/* LISTADO DE NUEVOS PAGOS (Solo los de este momento) */}
          {store.nuevosPagos.length > 0 && (
            <div className="space-y-3">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Pagos registrados ahora</p>
              {store.nuevosPagos.map((p, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 bg-emerald-50 border border-emerald-100 rounded-2xl animate-in slide-in-from-right-2">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <CreditCard size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-800 uppercase leading-none mb-1">${p.monto.toLocaleString()}</p>
                      <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{p.metodo}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        /* MENSAJE CUANDO YA NO DEBE NADA */
        <div className="py-20 text-center space-y-4 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
           <div className="inline-flex p-4 bg-emerald-100 text-emerald-600 rounded-full">
              <CheckCircle2 size={40} />
           </div>
           <div className="max-w-xs mx-auto">
              <h4 className="text-lg font-black text-slate-900 uppercase tracking-tighter">¡Todo en orden!</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                El saldo ha sido cancelado en su totalidad. Ya puede proceder a finalizar el Check-Out.
              </p>
           </div>
        </div>
      )}

      {/* NAVEGACIÓN */}
      <div className="flex justify-between items-center pt-8 border-t border-slate-100">
        <Button 
          variant="ghost" 
          onClick={() => store.setStep(1)}
          className="h-14 px-8 rounded-2xl font-black text-slate-400 uppercase text-[10px] tracking-widest"
        >
          <ArrowLeft className="mr-2" size={16} /> Ver Resumen
        </Button>
        
        <Button 
          onClick={() => store.setStep(3)}
          disabled={!yaEstaSaldado}
          className={cn(
            "h-16 px-12 rounded-3xl font-black uppercase tracking-widest shadow-xl transition-all active:scale-95",
            yaEstaSaldado 
              ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-100" 
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          )}
        >
          Siguiente: Finalizar <ArrowRight className="ml-2" size={16} />
        </Button>
      </div>
    </div>
  );
}