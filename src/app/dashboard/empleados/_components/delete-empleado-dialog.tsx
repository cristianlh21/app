"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { deactivateEmpleado } from "../actionsEmpleado";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export function DeleteEmpleadoDialog({ id, nombre }: { id: number; nombre: string }) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setIsPending(true);
    const result = await deactivateEmpleado(id);
    setIsPending(false);

    if (result.success) {
      toast.success("Empleado dado de baja correctamente");
      router.push("/dashboard/empleados"); // Volvemos a la lista
    } else {
      toast.error(result.error);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="gap-2 shadow-sm">
          <Trash2 size={16} /> Dar de Baja
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2 text-amber-600 mb-2">
            <AlertTriangle size={20} />
            <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            Estás por dar de baja a <strong>{nombre}</strong>. El empleado ya no podrá acceder al sistema y no aparecerá en las listas activas de recepción, pero sus datos legales se mantendrán archivados.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white"
            disabled={isPending}
          >
            {isPending ? <Loader2 className="animate-spin h-4 w-4" /> : "Confirmar Baja"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}