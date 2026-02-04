"use client";

import { useState } from "react";
import { Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EmpleadoForm } from "./empleado-form";
import { Empleado } from "../typesEmpleado";

export function EditEmpleadoButton({ empleado }: { empleado: Empleado }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Edit3 size={16} /> Editar Perfil
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-150 max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-700">
            Editar información
          </DialogTitle>
          <DialogDescription>
            Modifica los datos de <strong>{empleado.nombre} {empleado.apellido}</strong>. 
            Los cambios se reflejarán en todo el sistema.
          </DialogDescription>
        </DialogHeader>

        {/* Pasamos el empleado al form y la función para cerrar el modal al terminar */}
        <EmpleadoForm 
          initialData={empleado} 
          onSuccess={() => setOpen(false)} 
        />
      </DialogContent>
    </Dialog>
  );
}