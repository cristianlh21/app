// app/dashboard/empleados/[id]/page.tsx

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  Mail,
  Briefcase,
  DollarSign,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Imports faltantes
import { User, Hash } from "lucide-react";
import { EditEmpleadoButton } from "../_components/edit-empleado-button";
import { DeleteEmpleadoDialog } from "../_components/delete-empleado-dialog";

export default async function PerfilEmpleadoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const idEmpleado = parseInt(id);

  if (isNaN(idEmpleado)) notFound();

  const empleado = await prisma.empleado.findUnique({
    where: { id: idEmpleado },
  });

  if (!empleado) notFound();

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4 md:p-8 animate-in fade-in duration-500">
      {/* BOTÓN VOLVER */}
      <Button variant="ghost" size="sm" asChild className="mb-2">
        <Link href="/dashboard/empleados">
          <ChevronLeft className="h-4 w-4 mr-1" /> Volver al listado
        </Link>
      </Button>

      {/* 1. CARD SUPERIOR (HEADER DEL PERFIL) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Avatar Grande con indicador online */}
          <div className="relative">
            <div className="w-32 h-32 rounded-2xl bg-blue-600 flex items-center justify-center text-4xl font-bold text-white shadow-lg">
              {empleado.nombre[0]}
              {empleado.apellido[0]}
            </div>
            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 border-4 border-white dark:border-slate-900 rounded-full"></div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <h1 className="text-3xl font-bold">
                {empleado.nombre} {empleado.apellido}
              </h1>
              <Badge className="w-fit mx-auto md:mx-0 bg-blue-100 text-blue-700 hover:bg-blue-100 border-none px-3 py-1 uppercase text-xs">
                {empleado.rol}
              </Badge>
            </div>
            <p className="text-slate-500 flex items-center justify-center md:justify-start gap-2">
              <Briefcase size={16} /> Recepción • Salta, Argentina
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border">
                <Calendar size={14} className="text-blue-500" />
                <span>Ingreso: Feb 2026</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border">
                <Hash size={14} className="text-blue-500" />
                <span>ID: EMP-{empleado.id}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <EditEmpleadoButton empleado={empleado} />
            <Button className="bg-blue-600 hover:bg-blue-700 gap-2 text-white">
              <Mail size={16} /> Contactar
            </Button>
          </div>
        </div>
      </div>

      {/* 2. GRILLA DE CARDS DE DETALLES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CARD: INFORMACIÓN PERSONAL */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border p-6 shadow-sm">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-6 border-b pb-4">
            <User size={18} className="text-blue-600" /> Información Personal
          </h3>
          <div className="space-y-4">
            <DetailRow label="DNI" value={empleado.documento} />
            <DetailRow label="CUIL" value={empleado.cuil} />
            <DetailRow
              label="Teléfono"
              value={empleado.telefono || "No asignado"}
            />
            <DetailRow
              label="Dirección"
              value={empleado.direccion || "No asignada"}
            />
          </div>
        </div>

        {/* CARD: DETALLES LABORALES */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border p-6 shadow-sm">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-6 border-b pb-4">
            <Briefcase size={18} className="text-blue-600" /> Detalles de
            Trabajo
          </h3>
          <div className="space-y-4">
            <DetailRow label="Puesto" value={empleado.rol} />
            <DetailRow label="Estado" value="Activo" status="success" />
            <DetailRow label="Turno" value="Mañana (06:00 - 14:00)" />
            <DetailRow label="Antigüedad" value="Reciente" />
          </div>
        </div>
      </div>

      {/* 3. CARD INFERIOR: SUELDOS Y HORARIOS */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border p-6 shadow-sm">
        <h3 className="text-lg font-bold flex items-center gap-2 mb-6 border-b pb-4">
          <DollarSign size={18} className="text-blue-600" /> Sueldos y Horarios
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">
              Salario Base
            </p>
            <p className="text-2xl font-bold text-slate-900">$ 450.000,00</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">
              Horas Semanales
            </p>
            <p className="text-2xl font-bold text-slate-900">44 Horas</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">
              Última Liquidación
            </p>
            <p className="text-2xl font-bold text-blue-600 underline cursor-pointer">
              Ver Recibo
            </p>
            <Button
              asChild
              variant="outline"
              className="w-full mt-4 border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              <Link href={`/dashboard/empleados/${empleado.id}/liquidar`}>
                <DollarSign size={16} className="mr-2" />
                Calcular Liquidación de Sueldo
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-red-50 dark:bg-red-950/20 rounded-2xl border border-red-200 dark:border-red-900/50 p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center md:text-left">
          <h3 className="text-red-800 dark:text-red-400 font-bold flex items-center justify-center md:justify-start gap-2">
            <AlertTriangle size={18} /> Zona de Peligro
          </h3>
          <p className="text-red-600/80 text-sm">
            Al dar de baja al empleado, este perderá acceso inmediato al sistema
            del hotel.
          </p>
        </div>

        <DeleteEmpleadoDialog
          id={empleado.id}
          nombre={`${empleado.nombre} ${empleado.apellido}`}
        />
      </div>
    </div>
  );
}

// Componente pequeño para las filas de detalles para no repetir código
function DetailRow({
  label,
  value,
  status,
}: {
  label: string;
  value: string;
  status?: string;
}) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
      <span className="text-slate-500 text-sm font-medium">{label}</span>
      <span
        className={`text-sm font-semibold ${status === "success" ? "text-green-600 bg-green-50 px-2 py-0.5 rounded" : "text-slate-800"}`}
      >
        {value}
      </span>
    </div>
  );
}
