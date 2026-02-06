// dashboard/reservas/_components/Step3Pagos.tsx
"use client";

import { useReservaStore } from "../../useReservaStore";
import { CobroForm } from "./cobro-form"; // Importamos el formulario modular
import { Button } from "@/components/ui/button";
import { 
  Trash2, 
  ArrowLeft, 
  ArrowRight, 
  Banknote, 
  Receipt, 
  Info,
  CreditCard,
  Wallet,
  ArrowUpRight
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Step3Pagos() {
  const store = useReservaStore();
  
  // Cálculos dinámicos basados en lo que hay en Zustand
  const totalCobrado = store.pagos.reduce((acc, p) => acc + p.monto, 0);
  const saldoPendiente = store.totalEstadia - totalCobrado;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* 1. SECCIÓN DE INDICADORES FINANCIEROS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tarjeta: Total de la Estancia */}
        <div className="relative overflow-hidden p-6 bg-slate-900 text-white rounded-3xl shadow-xl">
          <Receipt className="absolute -right-2 -top-2 h-20 w-20 text-white/10" />
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Estancia</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-black">${store.totalEstadia.toLocaleString()}</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
            <Info size={12} /> {store.precioVendido.toLocaleString()} x noche
          </p>
        </div>

        {/* Tarjeta: Lo que ya entró al hotel (Cobrado) */}
        <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-3xl">
          <div className="flex justify-between items-start">
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Total Cobrado</p>
            <div className="bg-emerald-500 p-1.5 rounded-full text-white">
              <ArrowUpRight size={14} />
            </div>
          </div>
          <p className="text-3xl font-black text-emerald-800 mt-2">${totalCobrado.toLocaleString()}</p>
          <div className="w-full bg-emerald-200 h-1.5 rounded-full mt-4 overflow-hidden">
            <div 
              className="bg-emerald-500 h-full transition-all duration-700" 
              style={{ width: `${Math.min(100, (totalCobrado / store.totalEstadia) * 100)}%` }} 
            />
          </div>
        </div>

        {/* Tarjeta: Saldo Pendiente */}
        <div className={cn(
          "p-6 rounded-3xl border transition-colors",
          saldoPendiente > 0 ? "bg-amber-50 border-amber-100" : "bg-blue-50 border-blue-100"
        )}>
          <p className={cn(
            "text-[11px] font-bold uppercase tracking-wider",
            saldoPendiente > 0 ? "text-amber-600" : "text-blue-600"
          )}>
            {saldoPendiente > 0 ? "Saldo Pendiente" : "Reserva Cubierta"}
          </p>
          <p className={cn(
            "text-3xl font-black mt-2",
            saldoPendiente > 0 ? "text-amber-800" : "text-blue-800"
          )}>
            ${Math.max(0, saldoPendiente).toLocaleString()}
          </p>
          <p className="text-[10px] text-slate-400 mt-4 italic">
            * Se cobrará al Check-in
          </p>
        </div>
      </div>

      {/* 2. FORMULARIO DE COBRO MODULAR */}
      <div className="bg-white rounded-3xl border border-slate-200 p-2 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
          <Banknote size={20} className="text-slate-400" />
          <h3 className="font-black text-slate-700 uppercase text-xs tracking-tighter">Registrar nuevo ingreso</h3>
        </div>
        <div className="p-4">
          <CobroForm 
            onAdd={(cobro) => store.addPago({ ...cobro, esAdelanto: true })} 
            labelBoton="Confirmar Cobro" 
          />
        </div>
      </div>

      {/* 3. LISTADO DE INGRESOS REGISTRADOS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-tighter">Historial de Cobros</h3>
          <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full font-bold text-slate-500">
            {store.pagos.length} TRANSACCIONES
          </span>
        </div>

        {store.pagos.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <Wallet className="mx-auto text-slate-300 mb-3" size={40} />
            <p className="text-sm text-slate-500 font-medium">No se han registrado señas ni pagos aún.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {store.pagos.map((p, idx) => (
              <div 
                key={idx} 
                className="group flex justify-between items-center p-4 bg-white border border-slate-100 rounded-2xl hover:shadow-md hover:border-blue-100 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    {p.metodo.includes("TARJETA") ? <CreditCard size={20} /> : <Banknote size={20} />}
                  </div>
                  <div>
                    <p className="font-black text-slate-800 text-lg">${p.monto.toLocaleString()}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{p.metodo}</span>
                      {p.referencia && (
                        <span className="text-[10px] text-slate-400 font-medium">Ref: {p.referencia}</span>
                      )}
                    </div>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => store.removePago(idx)}
                  className="rounded-full hover:bg-red-50 hover:text-red-500 text-slate-300 transition-colors"
                >
                  <Trash2 size={18} />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. BOTONES DE NAVEGACIÓN */}
      <div className="flex justify-between items-center pt-10 border-t border-slate-100">
        <Button 
          variant="ghost" 
          onClick={() => store.setStep(2)}
          className="text-slate-500 font-bold hover:bg-slate-100 rounded-2xl px-6"
        >
          <ArrowLeft className="mr-2" size={18} /> Volver al Titular
        </Button>
        
        <Button 
          onClick={() => store.setStep(4)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-black px-10 rounded-2xl h-12 shadow-lg shadow-blue-200 transition-all active:scale-95"
        >
          Siguiente: Resumen <ArrowRight className="ml-2" size={18} />
        </Button>
      </div>
    </div>
  );
}