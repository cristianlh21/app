"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, MapPin, Hash, ShieldCheck, UserCog, ChevronRight } from "lucide-react";
import { Empleado } from "../typesEmpleado";
import Link from "next/link";

export function EmpleadoCard({ empleado }: { empleado: Empleado }) {
  const getInitials = () => {
    const a = empleado.apellido?.[0] || "";
    const n = empleado.nombre?.[0] || "";
    return (a + n).toUpperCase();
  };

  return (
    <Card className="group mb-3 overflow-hidden border-slate-200 dark:border-slate-800 hover:shadow-md hover:border-blue-300 transition-all">
      <CardContent className="p-0 flex flex-col md:flex-row items-stretch">
        
        {/* 1. SECCIÓN PRINCIPAL DE INFORMACIÓN */}
        <div className="flex-1 p-4 md:p-6 flex flex-col md:flex-row items-center gap-6">
          <Avatar className="h-16 w-16 border-2 border-primary/10 shadow-sm">
            <AvatarImage src={empleado.fotoUrl || ""} alt={empleado.nombre} />
            <AvatarFallback className="bg-primary/5 text-primary font-bold text-xl">
              {getInitials()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            {/* Nombre y Documentos */}
            <div className="flex flex-col text-center md:text-left">
              <h3 className="text-lg font-bold leading-tight group-hover:text-blue-600 transition-colors">
                {empleado.apellido}, {empleado.nombre}
              </h3>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-2 gap-y-1 text-[10px] font-mono text-muted-foreground uppercase mt-1">
                <span>DNI: {empleado.documento}</span>
                <span className="text-slate-300">•</span>
                <span>CUIL: {empleado.cuil}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-1 text-sm text-muted-foreground mt-1">
                <MapPin size={14} className="text-slate-400" />
                <span className="truncate max-w-37.5">{empleado.direccion}</span>
              </div>
            </div>

            {/* Teléfono */}
            <div className="flex items-center justify-center md:justify-start gap-2 text-sm font-medium">
              <div className="p-2 rounded-full bg-blue-50 dark:bg-slate-800 text-blue-600">
                <Phone size={16} />
              </div>
              <span>{empleado.telefono}</span>
            </div>

            {/* Cargo / Rol */}
            <div className="flex items-center justify-center">
              <Badge 
                variant={empleado.rol === "ADMIN" ? "default" : "secondary"}
                className="px-3 py-1 gap-1.5 font-semibold uppercase tracking-wider text-[10px]"
              >
                <ShieldCheck size={12} />
                {empleado.rol}
              </Badge>
            </div>

            {/* PIN */}
            <div className="flex items-center justify-center md:justify-end">
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-dashed border-slate-300 group-hover:border-blue-200 transition-colors">
                <Hash size={14} className="text-muted-foreground" />
                <span className="font-mono font-bold tracking-widest text-blue-600">
                  {empleado.pin}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. BARRA DE ACCIÓN LATERAL (Botón Gestionar Perfil) */}
        <Link 
          href={`/dashboard/empleados/${empleado.id}`}
          className="bg-slate-50 dark:bg-slate-900/50 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 flex items-center justify-center px-4 py-3 md:py-0 hover:bg-blue-600 group/btn transition-all cursor-pointer min-w-20"
        >
          <div className="flex items-center gap-2 md:flex-col md:gap-1 text-blue-600 group-hover/btn:text-white transition-colors font-medium">
            <UserCog size={20} />
            <span className="text-[10px] uppercase font-bold md:hidden lg:block">Perfil</span>
            <ChevronRight size={16} className="hidden md:block opacity-50 group-hover/btn:opacity-100" />
          </div>
        </Link>

      </CardContent>
    </Card>
  );
}