// src/app/dashboard/reservas/[id]/checkin/_components/Step2Huespedes.tsx
"use client";

import { useState } from "react";
import { useCheckInStore } from "../_lib/useCheckInStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  UserPlus, 
  Trash2, 
  ArrowLeft, 
  ArrowRight, 
  UserCheck,
  Globe,
  IdCard
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Step2Huespedes() {
  const store = useCheckInStore();
  
  // Estado local para el formulario de acompañantes
  const [nuevo, setNuevo] = useState({
    nombre: "",
    apellido: "",
    documento: "",
    nacionalidad: "ARGENTINA"
  });

  const ocupantesActuales = (store.titularSeHospeda ? 1 : 0) + store.huespedesAdicionales.length;
  const quedaEspacio = ocupantesActuales < store.capacidadMaxima;

  const handleAgregar = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!nuevo.nombre || !nuevo.documento || !quedaEspacio) return;
    
    store.agregarHuesped({
      ...nuevo,
      nombre: nuevo.nombre.toUpperCase(),
      apellido: nuevo.apellido.toUpperCase(),
      documento: nuevo.documento.toUpperCase()
    });
    
    // Reset form y foco en el primer campo
    setNuevo({ nombre: "", apellido: "", documento: "", nacionalidad: "ARGENTINA" });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="space-y-1">
        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Pasajeros de la Habitación</h3>
        <p className="text-xs text-slate-500 font-medium">
          Capacidad Máxima: <span className="font-bold text-slate-900">{store.capacidadMaxima} Personas</span>
        </p>
      </div>

      {/* 1. SECCIÓN DEL TITULAR */}
      <div className={cn(
        "p-6 rounded-[2.5rem] border-2 transition-all flex items-center justify-between",
        store.titularSeHospeda ? "bg-blue-50 border-blue-200" : "bg-white border-slate-100"
      )}>
        <div className="flex items-center gap-4">
           <div className={cn(
             "h-12 w-12 rounded-2xl flex items-center justify-center transition-colors",
             store.titularSeHospeda ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"
           )}>
              <UserCheck size={24} />
           </div>
           <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Titular de Reserva</p>
              <h4 className="text-sm font-black text-slate-800 uppercase">{store.titularNombre}</h4>
           </div>
        </div>
        
        <div className="flex items-center gap-3">
           <span className="text-[10px] font-bold text-slate-500 uppercase">¿Se hospeda?</span>
           <button 
             onClick={store.toggleTitularSeHospeda}
             className={cn(
               "w-14 h-8 rounded-full transition-all relative",
               store.titularSeHospeda ? "bg-blue-600" : "bg-slate-200"
             )}
           >
              <div className={cn(
                "absolute top-1 h-6 w-6 rounded-full bg-white transition-all shadow-sm",
                store.titularSeHospeda ? "left-7" : "left-1"
              )} />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* 2. FORMULARIO DE CARGA RÁPIDA (Solo si queda espacio) */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 px-2">
            <UserPlus size={18} className="text-blue-500" />
            <h4 className="text-xs font-black text-slate-700 uppercase tracking-tighter">Registrar Acompañante</h4>
          </div>

          <form onSubmit={handleAgregar} className={cn("space-y-4", !quedaEspacio && "opacity-30 pointer-events-none")}>
            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Nombre</label>
                    <Input 
                      placeholder="Ej: MARÍA" 
                      value={nuevo.nombre}
                      onChange={(e) => setNuevo({...nuevo, nombre: e.target.value})}
                      className="rounded-xl border-slate-100 bg-slate-50 font-bold uppercase h-11"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Apellido</label>
                    <Input 
                      placeholder="Ej: LÓPEZ" 
                      value={nuevo.apellido}
                      onChange={(e) => setNuevo({...nuevo, apellido: e.target.value})}
                      className="rounded-xl border-slate-100 bg-slate-50 font-bold uppercase h-11"
                    />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Documento / Pasaporte</label>
                <div className="relative">
                    <IdCard size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input 
                      placeholder="DNI O PASAPORTE" 
                      value={nuevo.documento}
                      onChange={(e) => setNuevo({...nuevo, documento: e.target.value})}
                      className="rounded-xl border-slate-100 bg-slate-50 font-bold pl-10 uppercase h-11"
                    />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Nacionalidad</label>
                <div className="relative">
                    <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input 
                      value={nuevo.nacionalidad}
                      onChange={(e) => setNuevo({...nuevo, nacionalidad: e.target.value.toUpperCase()})}
                      className="rounded-xl border-slate-100 bg-slate-50 font-bold pl-10 uppercase h-11"
                    />
                </div>
            </div>

            <Button 
                type="submit"
                disabled={!quedaEspacio}
                className="w-full h-12 bg-slate-900 hover:bg-slate-800 rounded-xl font-black uppercase text-xs tracking-widest shadow-xl"
            >
                Agregar a la lista
            </Button>
          </form>

          {!quedaEspacio && (
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-center gap-3 text-amber-700">
               <Info size={16} />
               <p className="text-[10px] font-bold uppercase">Capacidad máxima alcanzada para esta unidad.</p>
            </div>
          )}
        </div>

        {/* 3. LISTADO DE PASAJEROS REGISTRADOS */}
        <div className="space-y-4">
            <div className="flex items-center gap-2 px-2">
                <Users size={18} className="text-blue-500" />
                <h4 className="text-xs font-black text-slate-700 uppercase tracking-tighter">Lista de Ingreso ({ocupantesActuales})</h4>
            </div>

            <div className="space-y-3 max-h-100 overflow-y-auto pr-2">
                {/* FILA DEL TITULAR (Si se hospeda) */}
                {store.titularSeHospeda && (
                   <div className="flex items-center justify-between p-4 bg-blue-50/50 border border-blue-100 rounded-2xl animate-in slide-in-from-left-2">
                      <div className="flex items-center gap-3">
                         <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">T</div>
                         <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{store.titularNombre}</p>
                      </div>
                      <span className="text-[9px] font-black text-blue-500 bg-blue-100 px-2 py-0.5 rounded-full uppercase">Titular</span>
                   </div>
                )}

                {/* FILAS DE ACOMPAÑANTES */}
                {store.huespedesAdicionales.map((h, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl group transition-all hover:border-blue-100 animate-in slide-in-from-left-2">
                    <div className="flex items-center gap-3">
                       <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-bold group-hover:bg-blue-50 group-hover:text-blue-500">
                          {idx + 1}
                       </div>
                       <div>
                          <p className="text-xs font-black text-slate-800 uppercase leading-none">{h.nombre} {h.apellido}</p>
                          <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase">DNI: {h.documento}</p>
                       </div>
                    </div>
                    <button 
                      onClick={() => store.removerHuesped(idx)}
                      className="p-2 text-slate-200 hover:text-rose-500 transition-colors"
                    >
                       <Trash2 size={16} />
                    </button>
                  </div>
                ))}

                {(ocupantesActuales === 0) && (
                  <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[3rem]">
                     <p className="text-slate-300 text-[10px] font-black uppercase tracking-widest italic">No hay pasajeros registrados</p>
                  </div>
                )}
            </div>
        </div>
      </div>

      {/* NAVEGACIÓN */}
      <div className="flex justify-between items-center pt-8 border-t border-slate-50">
        <Button variant="ghost" onClick={() => store.setStep(1)} className="h-14 px-8 rounded-2xl font-black text-slate-400 uppercase text-[10px]">
          <ArrowLeft className="mr-2" size={18} /> Volver
        </Button>
        <Button 
          onClick={() => store.setStep(3)}
          disabled={ocupantesActuales === 0}
          className="h-16 px-12 rounded-3xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest shadow-xl shadow-blue-100"
        >
          Siguiente: Servicios <ArrowRight className="ml-2" size={20} />
        </Button>
      </div>
    </div>
  );
}

// Función simple de ayuda para la visualización
function Info({ size }: { size: number }) {
  return <IdCard size={size} />;
}