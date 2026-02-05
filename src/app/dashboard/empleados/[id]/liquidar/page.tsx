import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer, Save } from "lucide-react";
import Link from "next/link";
import { ReciboHeader } from "./_components/recibo-header";
import { ReciboTable } from "./_components/recibo-table"; // Traemos la tabla
import { differenceInMinutes, addDays } from "date-fns";

export default async function LiquidarEmpleadoPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const empleadoId = parseInt(id);

  // 1. Buscamos al empleado trayendo TAMBIÉN sus asistencias
  const empleado = await prisma.empleado.findUnique({
    where: { id: empleadoId },
    include: {
      valores: { include: { concepto: true } },
      asistencias: true // <--- ESTO faltaba para que no de error
    }
  });

  if (!empleado) notFound();

  // 2. Lógica para contar las horas reales
  let minutosTotales = 0;
  const registros = empleado.asistencias;

  registros.forEach(reg => {
    if (reg.tipo === "ENTRADA") {
      const salida = registros.find(s => 
        s.tipo === "SALIDA" && 
        s.fecha.toDateString() === reg.fecha.toDateString() &&
        s.turno === reg.turno
      );

      if (salida) {
        let hEntrada = new Date(reg.hora);
        let hSalida = new Date(salida.hora);
        if (reg.turno === "NOCHE" && hSalida < hEntrada) hSalida = addDays(hSalida, 1);
        minutosTotales += differenceInMinutes(hSalida, hEntrada);
      }
    }
  });

  const horasFinales = Math.floor(minutosTotales / 60);
  const valorHoraBase = Number(empleado.valores.find(v => v.concepto.codigo === "HORA_BASE")?.monto || 0);

  return (
    <div className="p-6 bg-slate-100 min-h-screen space-y-6">
      <div className="max-w-5xl mx-auto flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild><Link href={`/dashboard/empleados/${empleadoId}`}><ArrowLeft size={20} /></Link></Button>
          <h1 className="text-xl font-bold">Editor de Recibo</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Printer size={16} className="mr-2" /> Imprimir</Button>
          <Button className="bg-green-600 hover:bg-green-700"><Save size={16} className="mr-2" /> Guardar</Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto shadow-2xl bg-white rounded-lg overflow-hidden border border-slate-300">
        <ReciboHeader empleado={empleado as any} mes="FEBRERO" anio="2026" />
        
        {/* AQUÍ LLAMAMOS A LA TABLA pasándole las horas que calculamos arriba */}
        <ReciboTable horasTrabajadas={horasFinales} valorHora={valorHoraBase} />

        <div className="p-6 bg-slate-50 border-t border-slate-300 grid grid-cols-2 gap-8 font-bold">
            <div className="border-t border-slate-400 mt-10 text-center pt-2 text-[10px] uppercase">Firma del Empleado</div>
            <div className="text-right text-lg bg-blue-600 text-white p-4 rounded shadow-inner">
                NETO A COBRAR: $ {(horasFinales * valorHoraBase).toLocaleString('es-AR')}
            </div>
        </div>
      </div>
    </div>
  );
}