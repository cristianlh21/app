/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { crearAsistenciaManual } from "../actionsAsistencia";
import { toast } from "sonner";

export function AddAsistenciaManual({ empleadoId }: { empleadoId: number }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const res = await crearAsistenciaManual({
      empleadoId,
      fecha: formData.get("fecha") as string,
      turno: formData.get("turno") as any,
      entrada: formData.get("entrada") as string,
      salida: formData.get("salida") as string,
    });

    if (res.success) {
      toast.success("Registro creado");
      setOpen(false);
    } else {
      toast.error(res.error);
    }
    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 border-blue-200 text-blue-700 hover:bg-blue-50">
          <Plus size={16} /> Agregar Día Olvidado
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar Asistencia Manual</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha</label>
              <Input name="fecha" type="date" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Turno</label>
              <Select name="turno" required defaultValue="MAÑANA">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="MAÑANA">Mañana</SelectItem>
                  <SelectItem value="TARDE">Tarde</SelectItem>
                  <SelectItem value="NOCHE">Noche</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Hora Entrada</label>
              <Input name="entrada" type="time" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Hora Salida</label>
              <Input name="salida" type="time" required />
            </div>
          </div>
          <Button type="submit" className="w-full bg-blue-600" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : "Guardar Registro"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}