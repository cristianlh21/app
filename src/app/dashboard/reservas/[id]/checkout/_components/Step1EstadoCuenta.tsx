// src/app/dashboard/reservas/[id]/checkout/_components/Step1EstadoCuenta.tsx
"use client";

import { useCheckOutStore } from "../_lib/useCheckOutStore";
import { Button } from "@/components/ui/button";
import { 
  Receipt, 
  Plus, 
  Minus, 
  ArrowRight, 
  Info,
  ShoppingCart,
  CreditCard,
  Wallet
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Step1EstadoCuenta() {
  const store = useCheckOutStore();

  const totalConsumos = store.getTotalConsumos();
  const totalPagado = store.getTotalPagado();
  const saldoPendiente = store.getSaldoPendiente();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* EL "TICKET" DE CONSUMO */}
      <div className="bg-white border border-slate-200 rounded-[3rem] shadow-xl overflow-hidden">
        
        {/* Cabecera del Ticket */}
        <div className="bg-slate-50 p-8 border-b border-dashed border-slate-200 text-center space-y-2">
            <Receipt className="mx-auto text-blue-500 mb-2" size={32} />
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Resumen de Consumos</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Detalle de Cargos y Abonos</p>
        </div>

        <div className="p-8 space-y-8">
            
            {/* 1. SECCIÓN DE CARGOS (DEBE) */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 px-2">
                    <Plus className="text-rose-500" size={16} />
                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Cargos a la Cuenta</h4>
                </div>

                <div className="space-y-3">
                    {/* Estadía Base */}
                    <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <span className="text-sm font-bold text-slate-700 uppercase tracking-tight">Total Estadía Registrada</span>
                        <span className="font-black text-slate-900">${store.totalEstadia.toLocaleString()}</span>
                    </div>

                    {/* Extras */}
                    {store.cargosExtras.map((cargo, idx) => (
                        <div key={idx} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div>
                                <p className="text-sm font-bold text-slate-700 uppercase tracking-tight">{cargo.descripcion}</p>
                                <p className="text-[9px] text-slate-400 font-bold uppercase">Cant: {cargo.cantidad} x ${cargo.monto.toLocaleString()}</p>
                            </div>
                            <span className="font-black text-slate-900">${(cargo.monto * cargo.cantidad).toLocaleString()}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* 2. SECCIÓN DE PAGOS (HABER) */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 px-2">
                    <Minus className="text-emerald-500" size={16} />
                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Pagos y Señas Realizados</h4>
                </div>

                <div className="space-y-3">
                    {store.pagosPrevios.map((pago, idx) => (
                        <div key={idx} className="flex justify-between items-center p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                            <div className="flex items-center gap-3">
                                <CreditCard className="text-emerald-600" size={14} />
                                <span className="text-sm font-bold text-emerald-800 uppercase tracking-tight">{pago.metodo}</span>
                            </div>
                            <span className="font-black text-emerald-800">-${pago.monto.toLocaleString()}</span>
                        </div>
                    ))}
                    {store.pagosPrevios.length === 0 && (
                        <p className="text-center py-4 text-[10px] font-bold text-slate-400 uppercase italic">No se registran pagos previos</p>
                    )}
                </div>
            </section>

            {/* 3. TOTAL FINAL (BALANCE) */}
            <section className="pt-8 border-t-2 border-slate-900">
                <div className="flex justify-between items-center px-2">
                    <div className="space-y-1">
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tighter">Saldo Final a Cobrar</h4>
                        <p className="text-[10px] font-medium text-slate-400 italic">Monto a cancelar para liberar habitación</p>
                    </div>
                    <div className={cn(
                        "px-8 py-4 rounded-[2rem] text-center transition-all",
                        saldoPendiente > 0 ? "bg-rose-600 text-white shadow-xl shadow-rose-100" : "bg-emerald-600 text-white shadow-xl shadow-emerald-100"
                    )}>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Saldo</p>
                        <p className="text-4xl font-black tracking-tighter">${Math.max(0, saldoPendiente).toLocaleString()}</p>
                    </div>
                </div>
            </section>
        </div>
      </div>

      {/* AVISO DE ACCIÓN */}
      {saldoPendiente > 0 ? (
        <div className="flex items-start gap-4 p-6 bg-amber-50 border border-amber-100 rounded-[2rem] text-amber-800">
            <Info className="shrink-0" size={20} />
            <div>
                <p className="text-xs font-black uppercase tracking-tight mb-1">Requiere Pago Adicional</p>
                <p className="text-[11px] font-medium leading-relaxed">
                    Para finalizar el check-out es necesario registrar el cobro de la diferencia de <strong>${saldoPendiente.toLocaleString()}</strong>.
                </p>
            </div>
        </div>
      ) : (
        <div className="flex items-start gap-4 p-6 bg-emerald-50 border border-emerald-100 rounded-[2rem] text-emerald-800">
            <CheckCircle2 className="shrink-0" size={20} />
            <div>
                <p className="text-xs font-black uppercase tracking-tight mb-1">Cuenta Saldada</p>
                <p className="text-[11px] font-medium leading-relaxed">
                    La reserva está cubierta. Puede proceder al cierre operativo y liberación de la unidad.
                </p>
            </div>
        </div>
      )}

      {/* BOTÓN DE SIGUIENTE */}
      <div className="flex justify-end pt-4">
        <Button 
          onClick={() => store.setStep(2)}
          className="h-16 px-12 rounded-3xl bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest shadow-xl transition-all active:scale-95"
        >
          {saldoPendiente > 0 ? "Ir a Cobro Final" : "Continuar al Cierre"} <ArrowRight className="ml-2" />
        </Button>
      </div>
    </div>
  );
}

// Función auxiliar para el icono de check (opcional)
function CheckCircle2({ className, size }: { className?: string, size: number }) {
  return <div className={cn("h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center", className)}><Plus size={size - 8} className="text-white" /></div>;
}