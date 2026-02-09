// src/app/dashboard/habitaciones/walkin/_components/Step2Huespedes.tsx
"use client";

import { useState } from "react";
import { useWalkInStore } from "../_lib/useWalkInStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { 
  UserPlus, Trash2, ArrowRight, ArrowLeft, 
  UserCheck, Users, Fingerprint, Globe, 
  Star, Loader2, SearchCheck 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { buscarPersonaGlobalAction } from "@/app/dashboard/clientes/_actions";

export function Step2Huespedes() {
  const store = useWalkInStore();
  const [isSearching, setIsSearching] = useState(false);
  
  const [nuevo, setNuevo] = useState({
    nombre: "",
    apellido: "",
    documento: "",
    nacionalidad: "Argentina"
  });

  // Lógica de auto-completado (basada en tu cliente-form.tsx)
  const handleBlurDocumento = async () => {
    if (nuevo.documento.length < 6) return;

    setIsSearching(true);
    const res = await buscarPersonaGlobalAction(nuevo.documento);
    setIsSearching(false);

    if (res.success && res.data) {
      setNuevo({
        ...nuevo,
        nombre: res.data.nombre,
        apellido: res.data.apellido,
        nacionalidad: res.data.nacionalidad
      });
      toast.success("Persona encontrada en la base de datos");
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevo.nombre || !nuevo.apellido || !nuevo.documento) return;
    
    store.addHuesped(nuevo);
    setNuevo({ nombre: "", apellido: "", documento: "", nacionalidad: "Argentina" });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* FORMULARIO DE CARGA */}
        <Card className="lg:col-span-5 p-8 rounded-[2.5rem] border-slate-100 shadow-xl bg-white space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
              <UserPlus size={20} />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tighter">Pasajeros</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase italic">
                {store.huespedes.length === 0 ? "Carga al Titular de la cuenta" : "Carga a los acompañantes"}
              </p>
            </div>
          </div>

          <form onSubmit={handleAdd} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Documento</label>
              <div className="relative">
                <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <Input 
                  value={nuevo.documento} 
                  onChange={e => setNuevo({...nuevo, documento: e.target.value})}
                  onBlur={handleBlurDocumento}
                  placeholder="DNI o Pasaporte" 
                  className="pl-10 rounded-xl bg-slate-50 border-none h-11 font-bold focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                   {isSearching ? <Loader2 size={14} className="animate-spin text-blue-500" /> : 
                    nuevo.nombre !== "" && <SearchCheck size={14} className="text-emerald-500" />}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Nombre</label>
                <Input 
                  value={nuevo.nombre} 
                  onChange={e => setNuevo({...nuevo, nombre: e.target.value})}
                  placeholder="Ej: Juan" 
                  className="rounded-xl bg-slate-50 border-none h-11 font-bold"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Apellido</label>
                <Input 
                  value={nuevo.apellido} 
                  onChange={e => setNuevo({...nuevo, apellido: e.target.value})}
                  placeholder="Ej: Pérez" 
                  className="rounded-xl bg-slate-50 border-none h-11 font-bold"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Nacionalidad</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <Input 
                  value={nuevo.nacionalidad} 
                  onChange={e => setNuevo({...nuevo, nacionalidad: e.target.value})}
                  className="pl-10 rounded-xl bg-slate-50 border-none h-11 font-bold"
                />
              </div>
            </div>

            <Button 
              type="submit"
              className="w-full h-12 bg-slate-900 hover:bg-black text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg transition-all active:scale-95"
            >
              {store.huespedes.length === 0 ? "Fijar como Titular" : "Agregar Pasajero"}
            </Button>
          </form>
        </Card>

        {/* LISTADO DE HUÉSPEDES */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center gap-2 px-4">
              <Users className="text-slate-400" size={18} />
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Ocupantes de la {store.numeroHabitacion} ({store.huespedes.length})</h4>
          </div>

          <div className="space-y-3">
            {store.huespedes.map((h, idx) => (
              <div 
                key={h.documento} 
                className={cn(
                  "p-5 rounded-[2rem] border flex items-center justify-between transition-all animate-in slide-in-from-right-4",
                  idx === 0 ? "bg-blue-50/50 border-blue-100 shadow-inner" : "bg-white border-slate-100"
                )}
              >
                <div className="flex items-center gap-4">
                   <div className={cn(
                     "h-12 w-12 rounded-2xl flex items-center justify-center shadow-sm",
                     idx === 0 ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"
                   )}>
                      {idx === 0 ? <Star size={20} /> : <UserCheck size={20} />}
                   </div>
                   <div>
                      <div className="flex items-center gap-2">
                        <p className="font-black text-slate-900 uppercase tracking-tighter">{h.nombre} {h.apellido}</p>
                        {idx === 0 && (
                          <span className="text-[8px] font-black bg-blue-600 text-white px-2 py-0.5 rounded-full uppercase">TITULAR</span>
                        )}
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">{h.documento} • {h.nacionalidad}</p>
                   </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => store.removeHuesped(h.documento)}
                  className="rounded-xl hover:bg-rose-50 hover:text-rose-600 text-slate-300"
                >
                  <Trash2 size={18} />
                </Button>
              </div>
            ))}
          </div>

          {/* NAVEGACIÓN */}
          <div className="flex justify-between items-center pt-8">
             <Button variant="ghost" onClick={() => store.setStep(1)} className="rounded-2xl font-black uppercase text-[10px] tracking-widest text-slate-400">
               <ArrowLeft className="mr-2" size={16} /> Volver
             </Button>

             <Button 
                onClick={() => store.setStep(3)}
                disabled={store.huespedes.length === 0}
                className="h-14 px-10 rounded-[1.5rem] bg-slate-900 hover:bg-black text-white font-black uppercase tracking-widest shadow-xl disabled:opacity-20"
             >
                Continuar a Servicios <ArrowRight className="ml-2" size={16} />
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
}