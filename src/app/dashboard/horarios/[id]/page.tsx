/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { procesarAsistencias } from "../lib/utils-horarios"; // 👈 Importamos la lógica
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { EditableTimeCell } from "../_components/editable-time-cell";
import { getSession } from "@/lib/auth";
import { AddAsistenciaManual } from "../_components/add-asistencia-manual";

export default async function HistorialEmpleadoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // 1. Obtenemos la sesión real
  const session = await getSession();

  // 2. Seguridad: Si no hay sesión, al login. 
  if (!session) redirect("/");

  const empleado = await prisma.empleado.findUnique({
    where: { id: parseInt(id) },
    include: { asistencias: { orderBy: { hora: "desc" } } },
  });


  if (!empleado) notFound();

  // 1. Usamos la función para calcular las horas
  const asistenciasProcesadas = procesarAsistencias(empleado.asistencias);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <Button variant="ghost" asChild>
        <Link href="/dashboard/horarios">
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver
        </Link>
      </Button>

      <h1 className="text-2xl font-bold">
        Historial: {empleado.apellido}, {empleado.nombre}
      </h1>

      {session.rol === "ADMIN" && <AddAsistenciaManual empleadoId={empleado.id} />}

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Turno</TableHead>
              <TableHead>Entrada</TableHead>
              <TableHead>Salida</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {asistenciasProcesadas.map((row: any, i) => (
              <TableRow key={i}>
                <TableCell>
                  {format(new Date(row.fecha), "dd/MM/yyyy")}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{row.turno}</Badge>
                </TableCell>

                {/* Celda de Entrada Editable */}
                <TableCell>
                  {row.entradaReg ? (
                    <EditableTimeCell
                      id={row.entradaReg.id}
                      horaActual={row.entradaReg.hora}
                      userRole={session.rol}
                    />
                  ) : (
                    "--:--"
                  )}
                </TableCell>

                {/* Celda de Salida Editable */}
                <TableCell>
                  {row.salidaReg ? (
                    <EditableTimeCell
                      id={row.salidaReg.id}
                      horaActual={row.salidaReg.hora}
                      userRole={session.rol}
                    />
                  ) : (
                    "--:--"
                  )}
                </TableCell>

                <TableCell className="text-right font-bold text-blue-600">
                  {row.duracion}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
