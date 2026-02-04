import { getEmpleados } from "../empleados/actionsEmpleado";
import { prisma } from "@/lib/prisma";
import { AsistenciaCard } from "./_components/asistencia-card";
import { Clock } from "lucide-react";
// ⚠️ IMPORTANTE: Importamos la interfaz TÚYA, no la de Prisma
import { Asistencia } from "./typesAsistencia"; 

export default async function HorariosPage() {
  const { data: empleados } = await getEmpleados();
  
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const asistenciasHoy = await prisma.asistencia.findMany({
    where: {
      fecha: hoy
    }
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Clock className="text-blue-600" size={24} /> 
          Control de Asistencia
        </h1>
        <p className="text-muted-foreground text-sm">
          Registro de entrada y salida del personal para el día: {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {empleados?.map((emp) => (
          <AsistenciaCard 
            key={emp.id} 
            empleado={emp} 
            // ✅ SOLUCIÓN DEFINITIVA: "as unknown as Asistencia[]"
            // 1. "as unknown": Borra el tipo original (string)
            // 2. "as Asistencia[]": Le impone tu tipo estricto ("ENTRADA" | "SALIDA")
            registros={asistenciasHoy.filter(a => a.empleadoId === emp.id) as unknown as Asistencia[]}
          />
        ))}
      </div>
    </div>
  );
}