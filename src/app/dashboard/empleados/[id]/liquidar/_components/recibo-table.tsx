"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface ConceptoFila {
  id: string;
  nombre: string;
  cantidad: string;
  haber: number;
  descuento: number;
  esEstatico: boolean;
}

export function ReciboTable({ horasTrabajadas, valorHora }: { horasTrabajadas: number, valorHora: number }) {
  
  // ✅ Estado que maneja la lista de filas del recibo
  const [filas, setFilas] = useState<ConceptoFila[]>([
    {
      id: "base-1",
      nombre: "Sueldo Básico (Horas Trabajadas)",
      cantidad: `${horasTrabajadas} hs`,
      haber: horasTrabajadas * valorHora,
      descuento: 0,
      esEstatico: true
    }
  ]);

  // ✅ Función para añadir una fila nueva
  const agregarFila = () => {
    const nueva: ConceptoFila = {
      id: crypto.randomUUID(),
      nombre: "",
      cantidad: "",
      haber: 0,
      descuento: 0,
      esEstatico: false
    };
    setFilas([...filas, nueva]);
  };

  // ✅ Función para borrar una fila
  const eliminarFila = (id: string) => {
    setFilas(filas.filter(f => f.id !== id));
  };

  // ✅ Función para actualizar los datos cuando escribes
  const actualizarFila = (id: string, campo: keyof ConceptoFila, valor: any) => {
    setFilas(filas.map(f => f.id === id ? { ...f, [campo]: valor } : f));
  };

  // Cálculos totales
  const totalHaberes = filas.reduce((acc, f) => acc + f.haber, 0);
  const totalDescuentos = filas.reduce((acc, f) => acc + f.descuento, 0);
  const neto = totalHaberes - totalDescuentos;

  return (
    <div className="border-y border-slate-300 bg-white">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="text-[10px] font-bold uppercase w-[400px]">Concepto</TableHead>
            <TableHead className="text-center text-[10px] font-bold uppercase w-[100px]">Cant.</TableHead>
            <TableHead className="text-right text-[10px] font-bold uppercase">Haberes</TableHead>
            <TableHead className="text-right text-[10px] font-bold uppercase">Desc.</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filas.map((fila) => (
            <TableRow key={fila.id} className={fila.esEstatico ? "bg-blue-50/50" : "hover:bg-slate-50"}>
              <TableCell>
                <input
                  className="w-full bg-transparent border-none focus:ring-0 text-xs font-bold disabled:text-slate-500"
                  value={fila.nombre}
                  disabled={fila.esEstatico}
                  placeholder="Nombre del concepto..."
                  onChange={(e) => actualizarFila(fila.id, "nombre", e.target.value)}
                />
              </TableCell>
              <TableCell>
                <input
                  className="w-full bg-transparent border-none text-center focus:ring-0 text-xs font-mono disabled:text-slate-500"
                  value={fila.cantidad}
                  disabled={fila.esEstatico}
                  placeholder="0"
                  onChange={(e) => actualizarFila(fila.id, "cantidad", e.target.value)}
                />
              </TableCell>
              <TableCell>
                <input
                  type="number"
                  className="w-full bg-transparent border-none text-right focus:ring-0 text-xs font-bold text-green-700 disabled:opacity-100"
                  value={fila.haber === 0 ? "" : fila.haber}
                  disabled={fila.esEstatico}
                  placeholder="0.00"
                  onChange={(e) => actualizarFila(fila.id, "haber", parseFloat(e.target.value) || 0)}
                />
              </TableCell>
              <TableCell>
                <input
                  type="number"
                  className="w-full bg-transparent border-none text-right focus:ring-0 text-xs font-bold text-red-600"
                  value={fila.descuento === 0 ? "" : fila.descuento}
                  placeholder="0.00"
                  onChange={(e) => actualizarFila(fila.id, "descuento", parseFloat(e.target.value) || 0)}
                />
              </TableCell>
              <TableCell>
                {!fila.esEstatico && (
                  <Button variant="ghost" size="icon" onClick={() => eliminarFila(fila.id)} className="h-6 w-6 text-slate-300 hover:text-red-500">
                    <Trash2 size={14} />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-slate-50/30">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={agregarFila}
          className="text-[10px] font-black uppercase border-dashed border-2 hover:bg-white"
        >
          <Plus size={14} className="mr-1" /> Añadir Item al Recibo
        </Button>

        {/* ✅ Mini resumen interno para verificar cuentas */}
        <div className="flex gap-4 text-[10px] font-bold text-slate-500 uppercase">
            <span>Subtotal Haberes: <span className="text-green-700">${totalHaberes.toLocaleString('es-AR')}</span></span>
            <span>Subtotal Descuentos: <span className="text-red-600">${totalDescuentos.toLocaleString('es-AR')}</span></span>
        </div>
      </div>
    </div>
  );
}