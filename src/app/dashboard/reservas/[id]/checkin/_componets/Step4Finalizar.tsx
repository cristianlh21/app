// src/app/dashboard/reservas/[id]/checkin/_components/Step4Finalizar.tsx
"use client";

import { useCheckInStore } from "../_lib/useCheckInStore";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { finalizarCheckInAction } from "../../../_actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Users, 
  CheckCircle, 
  ArrowLeft, 
  Loader2, 
  Hotel, 
  ShoppingCart,
} from "lucide-react";
import { toast } from "sonner";

export function Step4Finalizar() {
  const store = useCheckInStore();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const totalExtras = store.cargosExtras.reduce((acc, c) => acc + (c.monto * c.cantidad), 0);
  
  const listaCompleta = [
    ...(store.titularSeHospeda ? [{ nombre: store.titularNombre, apellido: "(TITULAR)", documento: "-", nacionalidad: "-" }] : []),
    ...store.huespedesAdicionales
  ];

  const handleConfirmar = () => {
    startTransition(async () => {
      const res = await finalizarCheckInAction({
        reservaId: store.reservaId,
        reservaHabitacionId: store.reservaHabitacionId, // ID para actualizar el vínculo
        nuevaHabitacionId: store.habitacionId,         // Por si la cambió en el Paso 1
        huespedes: store.huespedesAdicionales,         // Acompañantes para OcupacionHuesped
        titularSeHospeda: store.titularSeHospeda,     // Flag para saber si creamos ocupación para el titular
        servicios: store.cargosExtras,
        totalEstadiaFinal: store.totalEstadia,         // El precio pactado final
      });

      if (res.success) {
        toast.success("Check-In finalizado. ¡Huéspedes registrados!");
        store.reset();
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error(res.error || "Ocurrió un error");
      }
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      
      <div className="text-center space-y-2">
         <div className="inline-flex p-4 bg-emerald-50 text-emerald-600 rounded-full mb-2">
            <CheckCircle size={40} />
         </div>
         <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Resumen de Ingreso</h3>
         <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Revise los datos antes de confirmar el acceso</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* RESUMEN UNIDAD */}
        <Card className="p-6 border-slate-100 rounded-[2.5rem] bg-slate-50/50 flex flex-col items-center text-center">
           <Hotel className="text-blue-500 mb-4" size={32} />
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Habitación Asignada</p>
           <h4 className="text-4xl font-black text-slate-900 mb-2">{store.numeroHabitacion}</h4>
           <p className="text-[10px] font-bold text-slate-500 uppercase">{store.tipoVendidoNombre}</p>
        </Card>

        {/* RESUMEN PASAJEROS */}
        <Card className="p-6 border-slate-100 rounded-[2.5rem] bg-slate-50/50">
           <div className="flex items-center gap-2 mb-4">
              <Users className="text-blue-500" size={20} />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pasajeros ({listaCompleta.length})</p>
           </div>
           <div className="space-y-2">
              {listaCompleta.map((h, i) => (
                <div key={i} className="flex justify-between items-center text-[11px] font-bold uppercase py-1 border-b border-slate-100 last:border-0">
                   <span className="text-slate-700">{h.nombre} {h.apellido}</span>
                </div>
              ))}
           </div>
        </Card>

        {/* RESUMEN EXTRAS */}
        <Card className="p-6 border-slate-100 rounded-[2.5rem] bg-slate-50/50">
           <div className="flex items-center gap-2 mb-4">
              <ShoppingCart className="text-blue-500" size={20} />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Servicios Extras</p>
           </div>
           <div className="space-y-2">
              {store.cargosExtras.map((s, i) => (
                <div key={i} className="flex justify-between items-center text-[11px] font-bold uppercase">
                   <span className="text-slate-500">{s.descripcion}</span>
                   <span className="text-slate-900">${(s.monto * s.cantidad).toLocaleString()}</span>
                </div>
              ))}
              {store.cargosExtras.length === 0 && <p className="text-[10px] italic text-slate-400 py-4 text-center uppercase font-bold tracking-widest">Sin extras</p>}
           </div>
        </Card>
      </div>

      {/* BALANCE FINAL */}
      <div className="bg-slate-900 rounded-[3rem] p-10 text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl">
         <div className="text-center md:text-left">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">Total de la Operación</p>
            <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-emerald-400 tracking-tighter">
                    ${(store.totalEstadia + totalExtras).toLocaleString()}
                </span>
                <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Final</span>
            </div>
         </div>
         <div className="flex flex-col items-end text-right opacity-60">
            <p className="text-[10px] font-bold uppercase">Estancia: ${store.totalEstadia.toLocaleString()}</p>
            <p className="text-[10px] font-bold uppercase">Servicios: ${totalExtras.toLocaleString()}</p>
         </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-100 gap-4">
        <Button variant="ghost" disabled={isPending} onClick={() => store.setStep(3)} className="h-14 px-10 rounded-2xl font-black text-slate-400 uppercase text-[10px]">
          <ArrowLeft className="mr-2" size={18} /> Volver y Corregir
        </Button>
        
        <Button 
          onClick={handleConfirmar} 
          disabled={isPending} 
          className="h-20 px-16 rounded-[2.5rem] bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-[0.2em] shadow-2xl shadow-emerald-100 transition-all active:scale-95 text-sm"
        >
          {isPending ? <><Loader2 className="mr-2 animate-spin" /> Procesando Ingreso...</> : <><CheckCircle className="mr-2" /> Finalizar Check-In</>}
        </Button>
      </div>
    </div>
  );
}