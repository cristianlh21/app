"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogIn, LogOut, Loader2, History } from "lucide-react";
import { registrarAsistencia } from "../actionsAsistencia"; 
import { toast } from "sonner";
import { AsistenciaCardProps } from "../typesAsistencia";
import Link from "next/link";

export function AsistenciaCard({ empleado, registros }: AsistenciaCardProps) {
  const [loading, setLoading] = useState<string | null>(null);
  type Turno = "MAÑANA" | "TARDE" | "NOCHE";
  const TURNOS: Turno[] = ["MAÑANA", "TARDE", "NOCHE"];

  const handleMarcar = async (
    tipo: "ENTRADA" | "SALIDA",
    turno: "MAÑANA" | "TARDE" | "NOCHE",
  ) => {
    const idCarga = `${tipo}-${turno}`;
    setLoading(idCarga);

    const result = await registrarAsistencia(empleado.id, tipo, turno);

    if (result.success) {
      toast.success(`${tipo} registrada: ${empleado.apellido}`);
    } else {
      toast.error("Error al registrar");
    }
    setLoading(null);
  };

  const getRegistro = (
    turno: "MAÑANA" | "TARDE" | "NOCHE",
    tipo: "ENTRADA" | "SALIDA",
  ) => {
    return registros.find((r) => r.turno === turno && r.tipo === tipo);
  };

  // ✅ HELPER: Esta función extrae la hora exacta "HH:mm" del string ISO
  // Esto evita que el navegador le reste 3 horas por estar en Argentina.
  const formatHoraFija = (fecha: Date | string) => {
    if (!fecha) return "--:--";
    // Tomamos los caracteres de la hora directamente del string (ej: "2026-02-03T14:30:00.000Z")
    return new Date(fecha).toISOString().substring(11, 16);
  };

  return (
    <Card className="overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-shadow relative">
      <CardHeader className="p-4 bg-slate-50 border-b flex flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
            <AvatarFallback className="bg-blue-600 text-white font-bold text-xs">
              {empleado.nombre[0]}{empleado.apellido[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-bold text-sm leading-none text-slate-800">{empleado.apellido}, {empleado.nombre}</p>
            <p className="text-[10px] text-blue-600 uppercase font-bold mt-1 tracking-wider">{empleado.rol}</p>
          </div>
        </div>

        {/* BOTÓN AL HISTORIAL */}
        <Button variant="ghost" size="icon" asChild title="Ver historial de horarios" className="text-slate-400 hover:text-blue-600">
          <Link href={`/dashboard/horarios/${empleado.id}`}>
            <History size={18} />
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="p-0 divide-y divide-slate-100">
        {TURNOS.map((turno) => {
          const regEntrada = getRegistro(turno, "ENTRADA");
          const regSalida = getRegistro(turno, "SALIDA");

          return (
            <div
              key={turno}
              className="grid grid-cols-3 items-center p-3 gap-2 hover:bg-slate-50/50 transition-colors"
            >
              <span className="text-[10px] font-black text-slate-400 tracking-tighter">
                {turno}
              </span>

              {/* ENTRADA */}
              <div className="flex justify-center">
                {regEntrada ? (
                  <Badge
                    variant="outline"
                    className="text-green-700 border-green-200 bg-green-50 font-mono py-1"
                  >
                    <LogIn size={10} className="mr-1" />
                    {/* ✅ USAMOS EL HELPER AQUÍ */}
                    {formatHoraFija(regEntrada.hora)}
                  </Badge>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 text-[10px] font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    disabled={loading === `ENTRADA-${turno}`}
                    onClick={() => handleMarcar("ENTRADA", turno)}
                  >
                    {loading === `ENTRADA-${turno}` ? (
                      <Loader2 className="animate-spin h-3 w-3" />
                    ) : (
                      "ENTRADA"
                    )}
                  </Button>
                )}
              </div>

              {/* SALIDA */}
              <div className="flex justify-center">
                {regSalida ? (
                  <Badge
                    variant="outline"
                    className="text-red-700 border-red-200 bg-red-50 font-mono py-1"
                  >
                    <LogOut size={10} className="mr-1" />
                    {/* ✅ Y AQUÍ TAMBIÉN */}
                    {formatHoraFija(regSalida.hora)}
                  </Badge>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 text-[10px] font-bold text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                    disabled={!regEntrada || loading === `SALIDA-${turno}`}
                    onClick={() => handleMarcar("SALIDA", turno)}
                  >
                    {loading === `SALIDA-${turno}` ? (
                      <Loader2 className="animate-spin h-3 w-3" />
                    ) : (
                      "SALIDA"
                    )}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}