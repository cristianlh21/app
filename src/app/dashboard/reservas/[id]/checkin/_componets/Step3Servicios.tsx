// src/app/dashboard/reservas/[id]/checkin/_components/Step3Servicios.tsx
"use client";

import { useState } from "react";
import { useCheckInStore } from "../_lib/useCheckInStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  PlusCircle, 
  Trash2, 
  ArrowLeft, 
  ArrowRight, 
  ShoppingCart, 
  Tag, 
  DollarSign,
  Coffee,
  Car
} from "lucide-react";

export function Step3Servicios() {
  const store = useCheckInStore();
  
  // Estado local para el formulario de carga rápida
  const [nuevoCargo, setNuevoCargo] = useState({
    descripcion: "",
    monto: "",
    cantidad: "1"
  });

  const handleAgregar = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!nuevoCargo.descripcion || !nuevoCargo.monto) return;
    
    store.agregarCargo({
      descripcion: nuevoCargo.descripcion.toUpperCase(),
      monto: parseFloat(nuevoCargo.monto),
      cantidad: parseInt(nuevoCargo.cantidad)
    });
    
    // Limpiamos el formulario
    setNuevoCargo({ descripcion: "", monto: "", cantidad: "1" });
  };

  const totalCargos = store.cargosExtras.reduce((acc, c) => acc + (c.monto * c.cantidad), 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="space-y-1">
        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Cargos y Servicios Extras</h3>
        <p className="text-xs text-slate-500 font-medium italic">
          Registre aquí consumos iniciales o servicios adicionales solicitados al ingresar.
        </p>
      </div>

      {/* 1. FORMULARIO DE INGRESO RÁPIDO */}
      <form onSubmit={handleAgregar} className="p-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-6 space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Descripción del Servicio</label>
            <Input 
              placeholder="EJ: COCHERA - 2 NOCHES" 
              value={nuevoCargo.descripcion}
              onChange={(e) => setNuevoCargo({...nuevoCargo, descripcion: e.target.value})}
              className="h-12 rounded-2xl border-none bg-white font-bold uppercase text-xs shadow-sm"
            />
          </div>
          <div className="md:col-span-3 space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Monto Unit.</label>
            <div className="relative">
                <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input 
                  type="number"
                  placeholder="0.00" 
                  value={nuevoCargo.monto}
                  onChange={(e) => setNuevoCargo({...nuevoCargo, monto: e.target.value})}
                  className="h-12 rounded-2xl border-none bg-white font-bold pl-8 text-xs shadow-sm"
                />
            </div>
          </div>
          <div className="md:col-span-1 space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Cant.</label>
            <Input 
              type="number"
              value={nuevoCargo.cantidad}
              onChange={(e) => setNuevoCargo({...nuevoCargo, cantidad: e.target.value})}
              className="h-12 rounded-2xl border-none bg-white font-bold text-xs shadow-sm"
            />
          </div>
          <div className="md:col-span-2">
            <Button 
              type="submit"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 rounded-2xl shadow-lg shadow-blue-100 transition-all active:scale-95"
            >
              <PlusCircle size={24} />
            </Button>
          </div>
        </div>

        {/* Sugerencias rápidas (Opcional, para UX) */}
        <div className="flex gap-2 pt-2">
            <button 
                type="button"
                onClick={() => setNuevoCargo({descripcion: "COCHERA", monto: "5000", cantidad: "1"})}
                className="text-[9px] font-black bg-white border border-slate-200 px-3 py-1.5 rounded-full text-slate-500 hover:border-blue-300 hover:text-blue-600 flex items-center gap-1 transition-all"
            >
                <Car size={10} /> + COCHERA
            </button>
            <button 
                type="button"
                onClick={() => setNuevoCargo({descripcion: "DESAYUNO EXTRA", monto: "3500", cantidad: "1"})}
                className="text-[9px] font-black bg-white border border-slate-200 px-3 py-1.5 rounded-full text-slate-500 hover:border-blue-300 hover:text-blue-600 flex items-center gap-1 transition-all"
            >
                <Coffee size={10} /> + DESAYUNO
            </button>
        </div>
      </form>

      {/* 2. LISTA DE CARGOS ACTUALES */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-2">
            <ShoppingCart size={18} className="text-blue-500" />
            <h4 className="text-xs font-black text-slate-700 uppercase tracking-tighter">Resumen de Cargos</h4>
        </div>

        <div className="space-y-3">
          {store.cargosExtras.map((item, index) => (
            <div 
                key={index} 
                className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-[2rem] group hover:border-blue-100 transition-all animate-in slide-in-from-right-2"
            >
               <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500">
                     <Tag size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-800 uppercase tracking-tight leading-none">{item.descripcion}</p>
                    <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-widest">
                        {item.cantidad} UNIDADES X ${item.monto.toLocaleString()}
                    </p>
                  </div>
               </div>
               <div className="flex items-center gap-6">
                  <span className="font-black text-slate-900 text-lg">${(item.monto * item.cantidad).toLocaleString()}</span>
                  <button 
                    onClick={() => store.removerCargo(index)}
                    className="text-slate-200 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
               </div>
            </div>
          ))}

          {store.cargosExtras.length === 0 && (
            <div className="py-16 text-center border-2 border-dashed border-slate-100 rounded-[3rem]">
               <p className="text-slate-300 text-[10px] font-black uppercase tracking-[0.3em] italic">No se han registrado extras</p>
            </div>
          )}
        </div>
      </div>

      {/* 3. TOTAL Y NAVEGACIÓN */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between pt-10 border-t border-slate-50">
        
        <div className="flex items-center gap-6 bg-slate-900 text-white px-8 h-20 rounded-[2.5rem] shadow-2xl w-full md:w-auto">
           <div className="p-3 bg-emerald-500/20 rounded-2xl">
              <ShoppingCart className="text-emerald-400" size={24} />
           </div>
           <div>
              <p className="text-[10px] font-black text-slate-500 uppercase leading-none tracking-widest">Total a Adicionar</p>
              <p className="text-3xl font-black tracking-tighter text-emerald-400 leading-none mt-1">
                ${totalCargos.toLocaleString()}
              </p>
           </div>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="ghost" onClick={() => store.setStep(2)} className="h-20 px-8 rounded-[2rem] font-black text-slate-400 uppercase text-[10px]">
             <ArrowLeft className="mr-2" /> Atrás
          </Button>
          <Button 
            onClick={() => store.setStep(4)} 
            className="h-20 px-10 rounded-[2.5rem] bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest shadow-xl flex-1 md:flex-none"
          >
             Resumen Final <ArrowRight className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}