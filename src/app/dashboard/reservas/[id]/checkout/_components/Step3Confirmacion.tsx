// src/app/dashboard/reservas/[id]/checkout/_components/Step3Confirmacion.tsx
"use client";

import { useCheckOutStore } from "../_lib/useCheckOutStore";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { finalizarCheckOutAction } from "../../../_actions";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  ArrowLeft, 
  Loader2, 
  Sparkles,
  ShieldCheck,
  LogOut
} from "lucide-react";
import { toast } from "sonner";

export function Step3Confirmacion() {
  const store = useCheckOutStore();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const totalFinal = store.getTotalConsumos();

  const handleFinalizar = () => {
    startTransition(async () => {
      const res = await finalizarCheckOutAction({
        reservaId: store.reservaId,
        pagosFinales: store.nuevosPagos
      });

      if (res.success) {
        toast.success("Check-Out completado. Habitación liberada.");
        store.reset();
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error(res.error || "Error al finalizar");
      }
    });
  };

  return (
    <div className="max-w-md mx-auto space-y-8 animate-in fade-in zoom-in duration-500">
      
      {/* ICONO CENTRAL */}
      <div className="text-center space-y-4">
        <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 shadow-inner">
          <CheckCircle2 size={48} className="animate-pulse" />
        </div>
        <div>
           <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">¡Todo Listo!</h3>
           <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">La cuenta está saldada y verificada</p>
        </div>
      </div>

      {/* BOX DE RESUMEN FINAL */}
      <div className="bg-white border-2 border-slate-100 rounded-[3rem] p-8 space-y-6 shadow-xl">
        <div className="flex justify-between items-center border-b border-slate-50 pb-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Facturado</span>
            <span className="text-xl font-black text-slate-900">${totalFinal.toLocaleString()}</span>
        </div>
        
        <div className="space-y-4">
            <div className="flex items-center gap-3 text-emerald-600">
                <ShieldCheck size={18} />
                <p className="text-[11px] font-bold uppercase tracking-tight">Cobros validados correctamente</p>
            </div>
            <div className="flex items-center gap-3 text-amber-600">
                <Sparkles size={18} />
                <p className="text-[11px] font-bold uppercase tracking-tight">Habitación pasará a estado: SUCIA</p>
            </div>
        </div>
      </div>

      {/* BOTONES DE ACCIÓN */}
      <div className="flex flex-col gap-3">
        <Button 
          onClick={handleFinalizar}
          disabled={isPending}
          className="h-20 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-[0.2em] rounded-[2.5rem] shadow-2xl shadow-emerald-100 transition-all active:scale-95"
        >
          {isPending ? (
            <><Loader2 className="mr-2 animate-spin" /> Procesando Salida...</>
          ) : (
            <><LogOut className="mr-2" size={20} /> Finalizar y Liberar</>
          )}
        </Button>

        <Button 
          variant="ghost" 
          disabled={isPending}
          onClick={() => store.setStep(2)}
          className="h-14 font-black text-slate-400 uppercase text-[10px] tracking-widest rounded-2xl"
        >
          <ArrowLeft className="mr-2" size={16} /> Corregir Pagos
        </Button>
      </div>

      {/* MENSAJE DE SEGURIDAD */}
      <p className="text-center text-[9px] text-slate-400 font-medium uppercase tracking-[0.3em] px-8">
        Al finalizar, se emitirá el cierre de folio y la unidad quedará disponible para mantenimiento.
      </p>
    </div>
  );
}