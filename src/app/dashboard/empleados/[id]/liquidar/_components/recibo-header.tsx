"use client";

import { Card } from "@/components/ui/card";
import { Empleado } from "@/generated/client/client"; // Usamos tu cliente generado

interface ReciboHeaderProps {
  empleado: Empleado;
  mes: string;
  anio: string;
}

export function ReciboHeader({ empleado, mes, anio }: ReciboHeaderProps) {
  // Formateamos la fecha de liquidación (generalmente es el último día del mes o el actual)
  const fechaHoy = new Date().toLocaleDateString('es-AR');

  return (
    <Card className="p-4 bg-white border-b-0 rounded-b-none shadow-none border-slate-300">
      <div className="grid grid-cols-2 gap-8">
        
        {/* LADO IZQUIERDO: Datos del Empleador (Hotel) */}
        <div className="space-y-1">
          <h2 className="text-xl font-black text-slate-900 tracking-tighter">HOTEL SHAUARD</h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase">Empresa: Shauard S.R.L.</p>
          <p className="text-[10px] text-slate-500">CUIT: 30-XXXXXXXX-X</p>
          <p className="text-[10px] text-slate-500">Domicilio: Salta, Argentina</p>
        </div>

        {/* LADO DERECHO: Periodo y Fecha */}
        <div className="text-right space-y-1">
          <div className="inline-block bg-slate-100 p-2 rounded-md border border-slate-200">
            <p className="text-[10px] font-bold text-slate-500 uppercase leading-none">Periodo de Pago</p>
            <p className="text-sm font-black text-blue-700 uppercase">
              {mes} - {anio}
            </p>
          </div>
          <p className="text-[10px] text-slate-500 mt-2">Fecha de Liquidación: <span className="font-bold">{fechaHoy}</span></p>
        </div>

        {/* SECCIÓN INFERIOR: Datos del Empleado */}
        <div className="col-span-2 mt-4 pt-4 border-t border-slate-200 grid grid-cols-3 gap-4">
          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase">Apellido y Nombre</p>
            <p className="text-xs font-bold text-slate-800">{empleado.apellido}, {empleado.nombre}</p>
          </div>
          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase">Legajo</p>
            <p className="text-xs font-bold text-slate-800">{empleado.id || 'N/A'}</p>
          </div>
          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase">CUIL</p>
            <p className="text-xs font-bold text-slate-800">{empleado.cuil}</p>
          </div>
          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase">Categoría / Rol</p>
            <p className="text-xs font-bold text-slate-800 uppercase">{empleado.rol}</p>
          </div>
          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase">D.N.I.</p>
            <p className="text-xs font-bold text-slate-800">{empleado.documento}</p>
          </div>
          <div className="text-right">
             <span className="text-[9px] font-bold bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100">
               RECIBO DE LEY 20.744
             </span>
          </div>
        </div>
      </div>
    </Card>
  );
}