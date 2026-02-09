"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Banknote, 
  CreditCard, 
  Send, 
  Plus, 
  Hash,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Definimos los métodos basados EXACTAMENTE en tu Enum de Prisma
const METODOS = [
  { id: "EFECTIVO", label: "Efectivo", icon: <Banknote size={16} /> },
  { id: "TRANSFERENCIA", label: "Transferencia", icon: <Send size={16} /> },
  { id: "TARJETA_DEBITO", label: "T. Débito", icon: <CreditCard size={16} /> },
  { id: "TARJETA_CREDITO", label: "T. Crédito", icon: <CreditCard size={16} /> },
] as const;

interface CobroFormProps {
  onAdd: (pago: { monto: number; metodo: string; referencia: string }) => void;
  labelBoton?: string;
}

export function CobroForm({ onAdd, labelBoton = "Registrar Pago" }: CobroFormProps) {
  const [monto, setMonto] = useState("");
  const [metodo, setMetodo] = useState<string>("EFECTIVO");
  const [referencia, setReferencia] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numMonto = parseFloat(monto);
    
    if (isNaN(numMonto) || numMonto <= 0) return;

    onAdd({
      monto: numMonto,
      metodo, // Aquí enviamos el valor del Enum (ej: "TRANSFERENCIA")
      referencia,
    });

    setMonto("");
    setReferencia("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* MONTO */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
            Monto
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              className="pl-8 h-12 rounded-2xl border-slate-100 bg-slate-50 font-black text-lg focus:bg-white transition-all shadow-inner"
              required
            />
          </div>
        </div>

        {/* REFERENCIA */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
            Referencia / Nº Operación
          </label>
          <div className="relative">
            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input
              placeholder="Opcional"
              value={referencia}
              onChange={(e) => setReferencia(e.target.value)}
              className="pl-10 h-12 rounded-2xl border-slate-100 bg-slate-50 font-bold focus:bg-white transition-all shadow-inner"
            />
          </div>
        </div>
      </div>

      {/* SELECCIÓN DE MÉTODO */}
      <div className="space-y-3">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
          Método de Pago
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {METODOS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setMetodo(item.id)}
              className={cn(
                "flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all gap-2 h-20",
                metodo === item.id
                  ? "border-blue-600 bg-blue-50 text-blue-700 shadow-md scale-[1.02]"
                  : "border-slate-50 bg-white text-slate-400 hover:border-slate-200"
              )}
            >
              {item.icon}
              <span className="text-[9px] font-black uppercase tracking-tighter">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full h-14 bg-slate-900 hover:bg-black text-white rounded-[1.5rem] font-black uppercase text-xs tracking-[0.2em] shadow-xl active:scale-[0.97] transition-all"
      >
        <Plus className="mr-2" size={18} /> {labelBoton}
      </Button>
    </form>
  );
}