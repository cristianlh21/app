/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useWalkInStore } from "../_lib/useWalkInStore";
import { crearWalkInAction } from "../_actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  ReceiptText, 
  Pencil, 
  CheckCircle2, 
  ArrowLeft,
  Calendar,
  Users,
  CreditCard,
  Loader2,
  Trash2
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CobroForm } from "@/app/dashboard/reservas/_components/cobro-form";

export function Step4Confirmacion() {
  const store = useWalkInStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mostrarCobro, setMostrarCobro] = useState(false);

  // Cálculos finales
  const totalGeneral = store.calcTotalGeneral();
  const pagoRegistrado = store.pago?.monto || 0;
  const saldoRestante = totalGeneral - pagoRegistrado;

  const handleFinalizar = async () => {
    setLoading(true);
    const res = await crearWalkInAction({
      ...store, // Pasamos todo el estado del store
      totalGeneral,
      // Aquí pasarías el empleadoId real del usuario logueado
      empleadoId: 1 
    });
    setLoading(false);

    if (res.success) {
      toast.success("¡Check-In realizado con éxito!");
      router.push("/dashboard/habitaciones");
      store.reset();
    } else {
      toast.error(res.error || "Error al procesar el ingreso");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* LADO IZQUIERDO: EL TICKET DETALLADO */}
        <Card className="p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl bg-white flex flex-col">
          <div className="bg-slate-900 p-8 text-white">
            <div className="flex justify-between items-start mb-4">
              <ReceiptText size={32} className="text-blue-400" />
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Resumen de Estadía</p>
                <h3 className="text-2xl font-black italic">Habitación {store.numeroHabitacion}</h3>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
                <Calendar size={14} className="text-blue-400" />
                <span className="text-[9px] font-bold uppercase">{format(store.fechaCheckOut, "dd MMM yyyy", { locale: es })}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
                <Users size={14} className="text-blue-400" />
                <span className="text-[9px] font-bold uppercase">{store.huespedes.length} Pers.</span>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-6 flex-grow">
            {/* Detalle Habitación */}
            <div className="flex justify-between items-center group">
              <div>
                <p className="text-xs font-black text-slate-900 uppercase">Estadía ({store.getNoches()} noches)</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{store.tipoNombre}</p>
              </div>
              <span className="font-black text-slate-900">${store.calcTotalEstadia().toLocaleString()}</span>
            </div>

            {/* Detalle Servicios */}
            {store.servicios.map((s, i) => (
              <div key={i} className="flex justify-between items-center group animate-in slide-in-from-left-2">
                <div>
                  <p className="text-xs font-black text-slate-900 uppercase">{s.descripcion}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Cantidad: {s.cantidad}</p>
                </div>
                <span className="font-black text-slate-900">${(s.monto * s.cantidad).toLocaleString()}</span>
              </div>
            ))}

            <div className="border-t border-dashed border-slate-200 pt-6 mt-6">
              <div className="flex justify-between items-center">
                <span className="text-sm font-black text-slate-900 uppercase tracking-widest">Total General</span>
                <span className="text-3xl font-black text-slate-900 tracking-tighter">${totalGeneral.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* LADO DERECHO: COBRO Y BALANCE */}
        <div className="space-y-6">
          <Card className="p-8 rounded-[2.5rem] border-none shadow-xl bg-slate-50 space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Registro de Cobro</h4>
              {!store.pago ? (
                <Button 
                  onClick={() => setMostrarCobro(true)}
                  className="h-10 w-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg p-0"
                >
                  <Pencil size={16} />
                </Button>
              ) : (
                <Button 
                  onClick={() => store.setPago(undefined)}
                  variant="ghost"
                  className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-full h-8 w-8 p-0"
                >
                  <Trash2 size={16} />
                </Button>
              )}
            </div>

            {mostrarCobro && !store.pago ? (
              <div className="bg-white p-6 rounded-3xl shadow-inner border border-slate-100 animate-in fade-in slide-in-from-top-4">
                <CobroForm
                  labelBoton="Confirmar Pago"
                  onAdd={(p) => {
                    store.setPago(p as any);
                    setMostrarCobro(false);
                    toast.success("Pago registrado en el ticket");
                  }} 
                />
              </div>
            ) : store.pago ? (
              <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-3xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white">
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{store.pago.metodo}</p>
                    <p className="text-lg font-black text-emerald-900">${store.pago.monto.toLocaleString()}</p>
                  </div>
                </div>
                <CheckCircle2 className="text-emerald-500" size={24} />
              </div>
            ) : (
              <div className="py-10 text-center border-2 border-dashed border-slate-200 rounded-[2rem] space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase italic">Sin pagos registrados</p>
                <p className="text-[9px] text-slate-400 px-4">Hacé clic en el lápiz para cargar un pago inicial.</p>
              </div>
            )}

            <div className="pt-6 border-t border-slate-200 space-y-3">
              <div className="flex justify-between text-[10px] font-bold uppercase text-slate-500">
                <span>Saldo Pendiente</span>
                <span className={saldoRestante === 0 ? "text-emerald-600" : "text-slate-900"}>
                  ${saldoRestante.toLocaleString()}
                </span>
              </div>
            </div>
          </Card>

          <div className="flex flex-col gap-4">
            <Button 
              onClick={handleFinalizar}
              disabled={loading}
              className="w-full h-20 bg-slate-900 hover:bg-black text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>Finalizar Check-In <CheckCircle2 size={24} className="text-emerald-400" /></>
              )}
            </Button>

            <Button 
              variant="ghost" 
              onClick={() => store.setStep(3)}
              disabled={loading}
              className="h-12 rounded-2xl font-black text-slate-400 uppercase text-[10px] tracking-widest"
            >
              <ArrowLeft className="mr-2" size={16} /> Corregir Servicios
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}