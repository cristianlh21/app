// src/app/dashboard/reservas/[id]/checkin/_components/Step1Habitacion.tsx
"use client";

import { useState } from "react"; 
import { useCheckInStore } from "../_lib/useCheckInStore";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Sparkles, 
  Edit3, 
  Check, 
  X, 
  Info,
  Calendar
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { ReasignarHabitacionSheet } from "./ReasignarHabitacionSheet";

export function Step1Habitacion() {
  const store = useCheckInStore();
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  
  // Estado local para el input, pero empieza vacío o con el valor del store
  const [tempPrice, setTempPrice] = useState("");

  const noches = (store.fechaCheckIn && store.fechaCheckOut) 
    ? Math.max(1, differenceInDays(new Date(store.fechaCheckOut), new Date(store.fechaCheckIn))) 
    : 0;

  // Función para activar la edición
  const handleStartEditing = () => {
    setTempPrice((store.totalEstadia ?? 0).toString()); // Sincronizamos AQUÍ, en el evento
    setIsEditingPrice(true);
  };

  const handleSavePrice = () => {
    const valor = parseFloat(tempPrice);
    if (!isNaN(valor)) {
      store.setTotalManual(valor);
      setIsEditingPrice(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-2xl text-blue-800">
        <Info className="shrink-0 mt-0.5" size={18} />
        <div className="text-xs font-medium uppercase tracking-tight">
          <p className="font-black mb-1">Confirmación de Unidad Asignada</p>
          Verifique que la habitación {store.numeroHabitacion || "..."} esté lista para el ingreso.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* UNIDAD FÍSICA */}
        <div className="flex flex-col items-center justify-center p-10 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Unidad Física</p>
          <h2 className="text-8xl font-black text-slate-900 tracking-tighter mb-4">{store.numeroHabitacion || "--"}</h2>
          <div className="flex gap-2">
             <span className="px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase flex items-center gap-1">
                <Sparkles size={12} /> Estado: Lista
             </span>
             <ReasignarHabitacionSheet/>
          </div>
        </div>

        {/* DETALLES Y PRECIO */}
        <div className="space-y-6 flex flex-col justify-center">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Categoría Vendida</p>
            <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">
                {store.tipoVendidoNombre || "Cargando..."}
            </h3>
          </div>

          <div className="p-6 bg-slate-900 rounded-[2rem] text-white space-y-2 relative overflow-hidden shadow-xl">
             <div className="flex justify-between items-center relative z-10">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Importe Total Estancia</p>
                {!isEditingPrice ? (
                   <button 
                     onClick={handleStartEditing} // Llamamos a la función que sincroniza
                     className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 transition-colors"
                   >
                     <Edit3 size={14}/>
                   </button>
                ) : (
                   <div className="flex gap-1">
                      <button onClick={handleSavePrice} className="p-1 bg-emerald-500 rounded-md"><Check size={12}/></button>
                      <button onClick={() => setIsEditingPrice(false)} className="p-1 bg-rose-500 rounded-md"><X size={12}/></button>
                   </div>
                )}
             </div>
             <div className="flex items-baseline gap-1 relative z-10">
                <span className="text-xl font-bold text-slate-500">$</span>
                {isEditingPrice ? (
                   <input 
                      autoFocus 
                      type="number" 
                      value={tempPrice} 
                      onChange={(e) => setTempPrice(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSavePrice()}
                      className="bg-transparent border-b-2 border-white/30 text-4xl font-black outline-none w-full"
                   />
                ) : (
                   <h4 className="text-4xl font-black tracking-tighter">
                      {(store.totalEstadia ?? 0).toLocaleString()}
                   </h4>
                )}
             </div>
             {store.isPrecioManual && <p className="text-[9px] font-bold text-amber-400 uppercase animate-pulse italic">⚠️ Tarifa con ajuste manual</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="p-4 bg-white border border-slate-100 rounded-2xl">
                <p className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-1 mb-1"><Calendar size={10}/> Entrada</p>
                <p className="font-bold text-slate-700">{store.fechaCheckIn ? format(new Date(store.fechaCheckIn), "dd MMM yyyy") : "-"}</p>
             </div>
             <div className="p-4 bg-white border border-slate-100 rounded-2xl">
                <p className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-1 mb-1"><Calendar size={10}/> Salida</p>
                <p className="font-bold text-slate-700">{store.fechaCheckOut ? format(new Date(store.fechaCheckOut), "dd MMM yyyy") : "-"} ({noches} N.)</p>
             </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-8 border-t border-slate-50">
        <Button 
          onClick={() => store.setStep(2)}
          className="h-16 px-12 rounded-3xl bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest shadow-xl shadow-emerald-100"
        >
          Confirmar y Seguir <ArrowRight className="ml-2" size={20} />
        </Button>
      </div>
    </div>
  );
}