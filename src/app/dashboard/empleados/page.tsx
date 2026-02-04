import { getEmpleados } from "./actionsEmpleado";
import { EmpleadoCard } from "./_components/empleado-card";
import { ButtonFormEmpleado } from "./_components/button-form-empleado"; // Importamos el nuevo componente
import { Users } from "lucide-react";

export default async function EmpleadosPage() {
  const result = await getEmpleados();

  return (
    <div className="space-y-6">
      {/* Encabezado con el nuevo botón */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Users className="text-blue-600" size={24} /> 
            Lista de Empleados
          </h1>
          <p className="text-muted-foreground text-sm">
            Visualización del personal registrado en el sistema del Hotel Shauard.
          </p>
        </div>

        {/* Lógica del Dialog encapsulada en el botón */}
        <ButtonFormEmpleado />
      </div>

      <div className="flex flex-col gap-3">
        {!result.success && (
          <div className="p-4 border border-red-200 bg-red-50 text-red-700 rounded-lg">
            Hubo un problema: {result.error}
          </div>
        )}

        {result.success && result.data?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-xl bg-slate-50/50">
            <Users className="h-10 w-10 text-slate-300 mb-2" />
            <p className="text-slate-500 font-medium">No hay empleados registrados.</p>
            <p className="text-slate-400 text-xs">Usa el botón de arriba para registrar al primero.</p>
          </div>
        )}

        {result.success && result.data && result.data.length > 0 && (
          result.data.map((empleado) => (
            <EmpleadoCard key={empleado.id} empleado={empleado} />
          ))
        )}
      </div>
    </div>
  );
}