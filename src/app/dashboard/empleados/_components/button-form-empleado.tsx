"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
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

export function ButtonFormEmpleado() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 shadow-md">
          <Plus className="mr-2 h-4 w-4" /> Registrar Empleado
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-150 max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-700">
            Nuevo Miembro del Staff
          </DialogTitle>
          <DialogDescription>
            Ingresa los datos personales y de acceso para el nuevo empleado. 
            El PIN debe ser único.
          </DialogDescription>
        </DialogHeader>

        {/* Pasamos setOpen para que el formulario pueda cerrar el modal */}
        <EmpleadoForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}