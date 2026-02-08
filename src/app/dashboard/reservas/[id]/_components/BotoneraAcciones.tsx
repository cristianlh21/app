// app/dashboard/reservas/[id]/_components/BotoneraAcciones.tsx
"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation"; // Importamos el router
import { actualizarEstadoReservaAction } from "../../_actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  XCircle, 
  AlertTriangle, 
  Loader2, 
  CheckCircle, 
  CreditCard,
  Edit3,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Props {
  reservaId: number;
  estado: string;
  total: number;
  pagado: number;
}

export function BotoneraAcciones({ reservaId, estado, total, pagado }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter(); // Inicializamos el router
  const saldo = total - pagado;

  // Acción para estados simples (Cancelar / No-Show)
  const handleCambioEstado = (nuevoEstado: any) => {
    const mensajes: Record<string, string> = {
      CANCELADA: "¿Estás seguro de que deseas CANCELAR esta reserva?",
      NO_SHOW: "¿Confirmas que el huésped NO SE PRESENTÓ?",
    };

    if (!confirm(mensajes[nuevoEstado] || "¿Confirmar acción?")) return;

    startTransition(async () => {
      const res = await actualizarEstadoReservaAction(reservaId, nuevoEstado);
      if (res.success) {
        toast.success(`Estado actualizado: ${nuevoEstado}`);
      } else {
        toast.error(res.error);
      }
    });
  };

  // Función para iniciar el proceso de Check-In (Redirección al Wizard)
  const irAlCheckIn = () => {
    router.push(`/dashboard/reservas/${reservaId}/checkin`);
  };

  return (
    <Card className="p-6 border-slate-200 shadow-xl rounded-[2.5rem] space-y-8 sticky top-10 bg-white">
      
      {/* INDICADOR DE ESTADO */}
      <div className="space-y-2">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Control de Recepción</p>
        <div className={cn(
            "flex items-center gap-3 p-3 rounded-2xl border",
            estado === "CHECK_IN" ? "bg-emerald-50 border-emerald-100" : "bg-blue-50 border-blue-100"
        )}>
           <div className={cn(
             "h-3 w-3 rounded-full animate-pulse",
             estado === "CHECK_IN" ? "bg-emerald-500" : "bg-blue-500"
           )} />
           <span className="text-xl font-black text-slate-900 tracking-tighter uppercase">{estado}</span>
        </div>
      </div>

      <div className="h-[1px] bg-slate-100 w-full" />

      {/* BOTONERA DINÁMICA */}
      <div className="flex flex-col gap-3">
        
        {/* BOTÓN PRINCIPAL: Solo aparece si está CONFIRMADA */}
        {estado === "CONFIRMADA" && (
           <Button 
            onClick={irAlCheckIn} // Redirige al Wizard de 4 pasos
            className="h-16 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl text-lg shadow-lg shadow-emerald-50 group transition-all"
           >
             INICIAR CHECK-IN <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
           </Button>
        )}

        {/* ACCIONES SECUNDARIAS (Solo para reservas no ingresadas aún) */}
        {(estado === "CONFIRMADA" || estado === "PENDIENTE") && (
          <>
            <Button 
              variant="outline" 
              disabled={isPending}
              onClick={() => handleCambioEstado("NO_SHOW")}
              className="h-14 border-slate-100 font-bold rounded-2xl text-slate-600 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-100"
            >
              {isPending ? <Loader2 className="animate-spin" /> : <AlertTriangle className="mr-2 text-amber-500" size={18} />}
              MARCAR NO-SHOW
            </Button>

            <Button 
              variant="ghost" 
              disabled={isPending}
              onClick={() => handleCambioEstado("CANCELADA")}
              className="h-14 font-bold rounded-2xl text-rose-500 hover:bg-rose-50"
            >
              {isPending ? <Loader2 className="animate-spin" /> : <XCircle className="mr-2" size={18} />}
              CANCELAR RESERVA
            </Button>
          </>
        )}

        {/* ACCIÓN DE CHECK-OUT (Solo si ya está In-House) */}
        {estado === "CHECK_IN" && (
          <Button className="h-16 bg-slate-900 hover:bg-black text-white font-black rounded-2xl text-lg shadow-lg">
            REALIZAR CHECK-OUT
          </Button>
        )}

        {/* SIEMPRE VISIBLE: EDITAR */}
        <Button variant="secondary" className="h-14 font-bold rounded-2xl bg-slate-100 text-slate-500 hover:bg-slate-200">
          <Edit3 className="mr-2" size={18} /> EDITAR DATOS
        </Button>
      </div>

      {/* MONITOR DE SALDO */}
      <div className={cn(
        "p-5 rounded-3xl space-y-1",
        saldo > 0 ? "bg-rose-50 border border-rose-100" : "bg-emerald-50 border border-emerald-100"
      )}>
        <p className="text-[10px] font-bold text-slate-400 uppercase">Balance Pendiente</p>
        <div className="flex justify-between items-center">
          <span className={cn(
            "text-2xl font-black tracking-tighter",
            saldo > 0 ? "text-rose-600" : "text-emerald-600"
          )}>
            ${saldo.toLocaleString()}
          </span>
          <CreditCard size={20} className={saldo > 0 ? "text-rose-300" : "text-emerald-300"} />
        </div>
      </div>

    </Card>
  );
}