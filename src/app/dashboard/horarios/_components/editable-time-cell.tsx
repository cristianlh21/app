"use client";

import { useState } from "react";
import { Save, Loader2 } from "lucide-react";
import { updateAsistenciaHora } from "../actionsAsistencia";
import { toast } from "sonner";

export function EditableTimeCell({ id, horaActual, userRole }: { id: number, horaActual: Date | string, userRole: string }) {
  const isAdmin = userRole === "ADMIN";
  
  // ✅ FUNCIÓN CLAVE: Lee la hora UTC pura para ignorar el desfase local
  const leerHoraSinDesfase = (f: Date | string) => {
    if (!f) return "";
    const date = new Date(f);
    const h = date.getUTCHours().toString().padStart(2, '0');
    const m = date.getUTCMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
  };

  const [valor, setValor] = useState(() => leerHoraSinDesfase(horaActual));
  const [loading, setLoading] = useState(false);

  const horaOriginal = leerHoraSinDesfase(horaActual);
  const huboCambio = valor !== horaOriginal;

  const handleSave = async () => {
    setLoading(true);
    const res = await updateAsistenciaHora(id, valor, new Date(horaActual));
    if (res.success) {
      toast.success("Actualizado");
    } else {
      toast.error("Error");
      setValor(horaOriginal);
    }
    setLoading(false);
  };

  if (!isAdmin) return <span className="font-mono text-sm">{valor}</span>;

  return (
    <div className="flex items-center gap-2">
      <input
        type="time"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        className="bg-slate-50 border border-slate-200 rounded p-1 font-mono text-sm outline-none"
      />
      {huboCambio && (
        <button onClick={handleSave} disabled={loading} className="text-blue-600 hover:text-blue-800">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size={16} />}
        </button>
      )}
    </div>
  );
}