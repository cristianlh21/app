"use client";

import { useState } from "react";
import { useWalkInStore } from "../_lib/useWalkInStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { 
  Plus, 
  Trash2, 
  ArrowRight, 
  ArrowLeft,
  ConciergeBell,
  DollarSign,
  Layers,
  ReceiptText
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Step3Servicios() {
  const store = useWalkInStore();

  // Estado local para el formulario de carga manual
  const [nuevo, setNuevo] = useState({
    descripcion: "",
    monto: "",
    cantidad: "1"
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const montoNum = parseFloat(nuevo.monto);
    const cantidadNum = parseInt(nuevo.cantidad);

    if (!nuevo.descripcion || isNaN(montoNum) || montoNum <= 0) return;

    store.addServicio({
      descripcion: nuevo.descripcion,
      monto: montoNum,
      cantidad: cantidadNum || 1
    });

    // Reset formulario
    setNuevo({ descripcion: "", monto: "", cantidad: "1" });
  };

  const totalServicios = store.calcTotalExtras();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* FORMULARIO DE CARGA MANUAL (Lado Izquierdo) */}
        <Card className="lg:col-span-5 p-8 rounded-[2.5rem] border-slate-100 shadow-xl bg-white space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
              <Plus size={20} />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tighter">Nuevo Cargo Extra</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase italic">Ingresá los detalles del consumo</p>
            </div>
          </div>

          <form onSubmit={handleAdd} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Concepto / Descripción</label>
              <div className="relative">
                <ConciergeBell className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <Input 
                  value={nuevo.descripcion} 
                  onChange={e => setNuevo({...nuevo, descripcion: e.target.value})}
                  placeholder="Ej: Cochera, Desayuno, Frigobar..." 
                  className="pl-10 rounded-xl bg-slate-50 border-none h-11 font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Monto Unid.</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                  <Input 
                    type="number"
                    value={nuevo.monto} 
                    onChange={e => setNuevo({...nuevo, monto: e.target.value})}
                    placeholder="0.00" 
                    className="pl-8 rounded-xl bg-slate-50 border-none h-11 font-bold"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Cantidad</label>
                <div className="relative">
                  <Layers className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                  <Input 
                    type="number"
                    value={nuevo.cantidad} 
                    onChange={e => setNuevo({...nuevo, cantidad: e.target.value})}
                    placeholder="1" 
                    className="pl-8 rounded-xl bg-slate-50 border-none h-11 font-bold"
                  />
                </div>
              </div>
            </div>

            <Button 
              type="submit"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg transition-all active:scale-95"
            >
              Agregar a la cuenta
            </Button>
          </form>
        </Card>

        {/* LISTADO DE CARGOS ACUMULADOS (Lado Derecho) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <ReceiptText className="text-slate-400" size={18} />
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Resumen de Adicionales</h4>
              </div>
          </div>

          <div className="space-y-3 min-h-[300px]">
            {store.servicios.map((s, idx) => (
              <div 
                key={idx} 
                className="p-5 rounded-[2rem] border border-slate-100 bg-white flex items-center justify-between transition-all animate-in zoom-in-95"
              >
                <div className="flex items-center gap-4">
                   <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                      <span className="text-xs font-black">{s.cantidad}x</span>
                   </div>
                   <div>
                      <p className="font-black text-slate-900 uppercase tracking-tighter">{s.descripcion}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Precio Unitario: ${s.monto.toLocaleString()}</p>
                   </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-sm font-black text-slate-900 italic">
                    ${(s.monto * s.cantidad).toLocaleString()}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => store.removeServicio(idx)}
                    className="rounded-xl hover:bg-rose-50 hover:text-rose-600 text-slate-300"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </div>
            ))}

            {store.servicios.length === 0 && (
              <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[3rem] space-y-2 bg-slate-50/30">
                 <p className="text-xs font-bold text-slate-300 uppercase italic">Sin servicios adicionales cargados</p>
                 <p className="text-[10px] text-slate-400 font-medium">Usá el formulario de la izquierda para sumar extras.</p>
              </div>
            )}
          </div>

          {/* TOTALIZADOR Y NAVEGACIÓN */}
          <div className="pt-6 border-t border-slate-100 space-y-6">
             <div className="flex justify-between items-center bg-slate-900 text-white p-6 rounded-[2rem] shadow-xl">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Subtotal Adicionales</p>
                  <p className="text-xs text-slate-500 italic">No incluye el costo de habitación</p>
                </div>
                <span className="text-3xl font-black tracking-tighter">${totalServicios.toLocaleString()}</span>
             </div>

             <div className="flex justify-between items-center">
                <Button 
                  variant="ghost" 
                  onClick={() => store.setStep(2)}
                  className="h-12 px-6 rounded-2xl font-black text-slate-400 uppercase text-[10px] tracking-widest"
                >
                  <ArrowLeft className="mr-2" size={16} /> Volver a Huéspedes
                </Button>

                <Button 
                    onClick={() => store.setStep(4)}
                    className="h-14 px-10 rounded-[1.5rem] bg-slate-900 hover:bg-black text-white font-black uppercase tracking-widest shadow-xl"
                >
                    Ticket de Confirmación <ArrowRight className="ml-2" size={16} />
                </Button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}