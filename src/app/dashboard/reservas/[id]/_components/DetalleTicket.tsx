/* eslint-disable @typescript-eslint/no-explicit-any */
// app/dashboard/reservas/[id]/_components/DetalleTicket.tsx
"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { 
  User, 
  Hotel, 
  CreditCard, 
  MapPin, 
  Phone, 
  PencilLine
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  reserva: any; // El objeto reserva serializado desde el servidor
}

export function DetalleTicket({ reserva }: Props) {
  const detalleHab = reserva.habitaciones[0];
  const noches = Math.max(1, Math.ceil((new Date(reserva.fechaCheckOut).getTime() - new Date(reserva.fechaCheckIn).getTime()) / (1000 * 60 * 60 * 24)));
  const totalPagado = reserva.pagos.reduce((acc: number, p: any) => acc + p.monto, 0);
  const saldoPendiente = reserva.totalReserva - totalPagado;

  return (
    <div className="relative bg-white shadow-2xl overflow-hidden max-w-2xl mx-auto border-x border-slate-100">
      
      {/* EFECTO ZIG-ZAG SUPERIOR */}
      <div className="h-4 w-full bg-slate-100" 
           style={{ clipPath: "polygon(0 100%, 5% 0, 10% 100%, 15% 0, 20% 100%, 25% 0, 30% 100%, 35% 0, 40% 100%, 45% 0, 50% 100%, 55% 0, 60% 100%, 65% 0, 70% 100%, 75% 0, 80% 100%, 85% 0, 90% 100%, 95% 0, 100% 100%)" }}>
      </div>

      <div className="p-10 space-y-8 font-mono text-sm text-slate-600">
        
        {/* CABECERA HOTEL */}
        <div className="text-center border-b border-dashed border-slate-300 pb-8 space-y-1">
          <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Shauard Hotel</h2>
          <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Resumen de Cuenta de Huésped</p>
          <div className="pt-2 text-[10px] text-slate-400">ID Reserva: #{reserva.id}</div>
        </div>

        {/* 1. DATOS DEL CLIENTE TITULAR */}
        <section className="group relative space-y-3">
          <div className="flex justify-between items-center">
             <div className="flex items-center gap-2 font-black text-slate-900 text-xs uppercase">
                <User size={14} className="text-blue-600" /> Titular de la Reserva
             </div>
             <button className="opacity-0 group-hover:opacity-100 text-blue-500 transition-opacity">
                <PencilLine size={14} />
             </button>
          </div>
          
          <div className="grid grid-cols-2 gap-y-2 text-xs">
            <div className="font-bold uppercase text-slate-800 col-span-2 text-base mb-1">
               {reserva.cliente.nombre}
            </div>
            <div className="flex items-center gap-2">
               <span className="font-bold text-slate-400 w-20 uppercase">Documento:</span>
               <span className="text-slate-700">{reserva.cliente.documento}</span>
            </div>
            <div className="flex items-center gap-2">
               <Phone size={12} className="text-slate-300" />
               <span className="text-slate-700">{reserva.cliente.telefono || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2 col-span-2">
               <MapPin size={12} className="text-slate-300" />
               <span className="text-slate-700">{reserva.cliente.direccion || "Dirección no registrada"}</span>
            </div>
          </div>
        </section>

        {/* 2. FECHAS DE ESTANCIA */}
        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex justify-around text-center relative group">
          <button className="absolute top-2 right-4 opacity-0 group-hover:opacity-100 text-blue-500 transition-opacity">
             <PencilLine size={12} />
          </button>
          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Fecha Check-In</p>
            <p className="font-black text-slate-900 text-base">
               {format(new Date(reserva.fechaCheckIn), "dd MMM yyyy", { locale: es })}
            </p>
          </div>
          <div className="w-px bg-slate-200" />
          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Fecha Check-Out</p>
            <p className="font-black text-slate-900 text-base">
               {format(new Date(reserva.fechaCheckOut), "dd MMM yyyy", { locale: es })}
            </p>
          </div>
        </div>

        {/* 3. CUERPO: DETALLE DE HABITACIÓN */}
        <section className="space-y-4 pt-4 border-t border-dashed border-slate-300">
           <div className="flex items-center gap-2 font-black text-slate-900 text-xs uppercase mb-2">
              <Hotel size={14} className="text-blue-600" /> Detalle de Habitación
           </div>
           
           <div className="w-full space-y-2">
              <div className="grid grid-cols-5 font-black text-[10px] text-slate-400 uppercase border-b border-slate-100 pb-2">
                <span className="col-span-2">Descripción (Vendido como)</span>
                <span className="text-center">Días</span>
                <span className="text-center">Precio/N</span>
                <span className="text-right">Total</span>
              </div>
              
              <div className="grid grid-cols-5 text-xs py-2 items-center">
                <div className="col-span-2 space-y-1">
                   <div className="font-bold text-slate-800 uppercase">Hab #{detalleHab?.habitacion.numero} - {detalleHab?.tipoVendido.nombre}</div>
                   <div className="text-[9px] text-slate-400 italic font-bold uppercase">Física: {reserva.tipoActualNombre}</div>
                </div>
                <span className="text-center font-bold">{noches}</span>
                <span className="text-center">${detalleHab?.precioAplicado.toLocaleString()}</span>
                <span className="text-right font-black text-slate-900">${reserva.totalReserva.toLocaleString()}</span>
              </div>
           </div>
        </section>

        {/* 4. PAGOS REALIZADOS */}
        <section className="space-y-4 pt-4 border-t border-dashed border-slate-300">
           <div className="flex items-center gap-2 font-black text-slate-900 text-xs uppercase mb-2">
              <CreditCard size={14} className="text-emerald-600" /> Historial de Pagos
           </div>

           <div className="space-y-2">
             <div className="grid grid-cols-3 font-black text-[10px] text-slate-400 uppercase border-b border-slate-100 pb-2">
                <span>Fecha / Método</span>
                <span>Referencia</span>
                <span className="text-right">Monto</span>
             </div>

             {reserva.pagos.length > 0 ? reserva.pagos.map((p: any, i: number) => (
                <div key={i} className="grid grid-cols-3 text-[11px] py-1 border-b border-slate-50 last:border-0 italic">
                   <div className="flex flex-col">
                      <span className="text-slate-700 font-bold uppercase">{p.metodo}</span>
                      <span className="text-[9px] text-slate-400">{format(new Date(p.fecha), "dd/MM/yy HH:mm")}</span>
                   </div>
                   <span className="text-slate-400">{p.referencia || "---"}</span>
                   <span className="text-right font-bold text-emerald-600">${p.monto.toLocaleString()}</span>
                </div>
             )) : (
               <div className="text-center py-2 text-[10px] text-slate-400 italic">No se registran pagos aún.</div>
             )}
           </div>
        </section>

        {/* 5. TOTALES FINALES */}
        <section className="pt-6 border-t-2 border-slate-900 space-y-2">
           <div className="flex justify-between items-center text-slate-500 font-bold uppercase text-[11px]">
              <span>Total Estancia ({noches} noches):</span>
              <span>${reserva.totalReserva.toLocaleString()}</span>
           </div>
           <div className="flex justify-between items-center text-emerald-600 font-bold uppercase text-[11px]">
              <span>Pagos a Cuenta / Señas:</span>
              <span className="text-emerald-700">- ${totalPagado.toLocaleString()}</span>
           </div>
           <div className="flex justify-between items-center pt-4 border-t border-slate-200">
              <span className="text-base font-black text-slate-900 uppercase">Saldo a Pagar:</span>
              <span className={cn(
                "text-2xl font-black px-3 py-1 rounded-xl",
                saldoPendiente > 0 ? "text-rose-600 bg-rose-50" : "text-emerald-600 bg-emerald-50"
              )}>
                ${saldoPendiente.toLocaleString()}
              </span>
           </div>
        </section>

        {/* PIE DE TICKET */}
        <div className="text-center pt-8 space-y-2">
           <div className="text-[9px] text-slate-400 uppercase tracking-widest font-sans">
              *** No válido como factura fiscal ***
           </div>
           <div className="flex justify-center gap-1">
              <div className="h-4 w-4 bg-slate-200 rounded-sm" />
              <div className="h-4 w-4 bg-slate-300 rounded-sm" />
              <div className="h-4 w-4 bg-slate-100 rounded-sm" />
           </div>
        </div>

      </div>

      {/* EFECTO ZIG-ZAG INFERIOR */}
      <div className="h-4 w-full bg-white" 
           style={{ clipPath: "polygon(0 0, 5% 100%, 10% 0, 15% 100%, 20% 0, 25% 100%, 30% 0, 35% 100%, 40% 0, 45% 100%, 50% 0, 55% 100%, 60% 0, 65% 100%, 70% 0, 75% 100%, 80% 0, 85% 100%, 90% 0, 95% 100%, 100% 0)" }}>
      </div>
    </div>
  );
}