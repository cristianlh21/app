// dashboard/reservas/_components/Step4Resumen.tsx
"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useReservaStore } from "../../useReservaStore";
import { crearReservaCompletaAction } from "../../_actions";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { 
  CheckCircle2, 
  ArrowLeft, 
  Loader2, 
  Printer, 
  User, 
  CalendarDays, 
  Hotel,
  CreditCard
} from "lucide-react";
import { toast } from "sonner"; // Asegúrate de tener sonner o cambia por alert

export function Step4Resumen() {
  const store = useReservaStore();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Cálculos rápidos para el ticket
  const noches = store.fechaCheckIn && store.fechaCheckOut 
    ? Math.max(1, Math.ceil((store.fechaCheckOut.getTime() - store.fechaCheckIn.getTime()) / (1000 * 60 * 60 * 24)))
    : 0;
  const totalCobrado = store.pagos.reduce((acc, p) => acc + p.monto, 0);
  const saldoAlCheckIn = store.totalEstadia - totalCobrado;

  const handleFinalizar = () => {
    startTransition(async () => {
 

      // 2. Verificación de seguridad de datos
      if (!store.cliente || !store.habitacionId || !store.fechaCheckIn || !store.fechaCheckOut) {
        toast.error("Faltan datos para completar la reserva.");
        return;
      }

      // 3. Ejecutamos la acción de guardado
      const result = await crearReservaCompletaAction({
        cliente: store.cliente,
        habitacionId: store.habitacionId,
        tipoVendidoId: store.tipoVendidoId!,
        precioVendido: store.precioVendido,
        fechaCheckIn: store.fechaCheckIn,
        fechaCheckOut: store.fechaCheckOut,
        pagos: store.pagos,
        totalEstadia: store.totalEstadia,
      });

      if (result.success) {
        toast.success("¡Reserva creada con éxito!");
        store.resetReserva(); // Limpiamos el store
        router.push("/dashboard"); // Redirigimos al panel
        router.refresh();
      } else {
        toast.error(result.error || "Ocurrió un error al guardar");
      }
    });
  };

  return (
    <div className="max-w-md mx-auto animate-in fade-in zoom-in duration-500 pb-20">
      
      {/* EL TICKET ESTILO TÉRMICO */}
      <div className="relative bg-white shadow-2xl overflow-hidden">
        
        {/* Zig-Zag Superior */}
        <div className="h-3 w-full bg-slate-100" style={{ clipPath: "polygon(0 100%, 5% 0, 10% 100%, 15% 0, 20% 100%, 25% 0, 30% 100%, 35% 0, 40% 100%, 45% 0, 50% 100%, 55% 0, 60% 100%, 65% 0, 70% 100%, 75% 0, 80% 100%, 85% 0, 90% 100%, 95% 0, 100% 100%)" }}></div>

        <div className="p-8 space-y-6 font-mono text-[13px] text-slate-600">
          
          <div className="text-center border-b border-dashed pb-4">
            <h2 className="text-lg font-black text-slate-900 tracking-tighter uppercase">Comprobante de Reserva</h2>
            <p className="text-[10px] text-slate-400 mt-1">{new Date().toLocaleString()}</p>
          </div>

          {/* TITULAR */}
          <section className="space-y-1">
            <div className="flex items-center gap-2 font-black text-slate-900 mb-2 uppercase text-[11px]">
              <User size={14} className="text-blue-500" /> Titular de Reserva
            </div>
            <div className="flex justify-between uppercase"><span>Nombre:</span> <span className="font-bold text-right">{store.cliente?.nombre}</span></div>
            <div className="flex justify-between"><span>DNI/CUIT:</span> <span>{store.cliente?.documento}</span></div>
            <div className="flex justify-between"><span>Teléfono:</span> <span>{store.cliente?.telefono}</span></div>
            <div className="flex justify-between italic"><span>Dirección:</span> <span className="text-right text-[11px] max-w-35 truncate">{store.cliente?.direccion}</span></div>
          </section>

          {/* ESTANCIA */}
          <section className="pt-4 border-t border-dashed">
            <div className="flex items-center gap-2 font-black text-slate-900 mb-2 uppercase text-[11px]">
              <CalendarDays size={14} className="text-blue-500" /> Detalles Estancia
            </div>
            <div className="flex justify-between"><span>Check-In:</span> <span>{store.fechaCheckIn ? format(store.fechaCheckIn, "dd/MM/yyyy") : "-"}</span></div>
            <div className="flex justify-between"><span>Check-Out:</span> <span>{store.fechaCheckOut ? format(store.fechaCheckOut, "dd/MM/yyyy") : "-"}</span></div>
            <div className="flex justify-between font-bold text-slate-900 bg-slate-50 px-1"><span>Noches:</span> <span>{noches}</span></div>
          </section>

          {/* HABITACIÓN */}
          <section className="pt-4 border-t border-dashed">
             <div className="flex items-center gap-2 font-black text-slate-900 mb-2 uppercase text-[11px]">
              <Hotel size={14} className="text-blue-500" /> Habitación
            </div>
            <div className="flex justify-between font-bold uppercase">
                <span>{store.tipoVendidoNombre} #{store.habitacionNumero}</span>
                <span>${store.totalEstadia.toLocaleString()}</span>
            </div>
            <p className="text-[10px] text-slate-400">Precio pactado: ${store.precioVendido.toLocaleString()} / noche</p>
          </section>

          {/* COBROS */}
          <section className="pt-4 border-t border-dashed">
            <div className="flex items-center gap-2 font-black text-slate-900 mb-2 uppercase text-[11px]">
              <CreditCard size={14} className="text-emerald-600" /> Cobros realizados
            </div>
            {store.pagos.map((p, idx) => (
              <div key={idx} className="flex justify-between italic text-slate-500">
                <span>{p.metodo} {p.referencia && `(${p.referencia})`}</span>
                <span>${p.monto.toLocaleString()}</span>
              </div>
            ))}
            {store.pagos.length === 0 && <p className="text-[11px] italic text-slate-400">No se registraron cobros.</p>}
          </section>

          {/* TOTAL FINAL */}
          <section className="pt-4 border-t-2 border-slate-900 space-y-1">
             <div className="flex justify-between text-slate-500">
              <span>Subtotal Reserva:</span>
              <span>${store.totalEstadia.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-emerald-600 font-bold">
              <span>Total Entregado:</span>
              <span>- ${totalCobrado.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t mt-2">
              <span>SALDO PENDIENTE:</span>
              <span>${saldoAlCheckIn.toLocaleString()}</span>
            </div>
          </section>

          <div className="text-[9px] text-center text-slate-400 pt-6 uppercase tracking-widest font-sans">
            *** Reservas Hotel v1.0 ***
          </div>
        </div>

        {/* Zig-Zag Inferior */}
        <div className="h-3 w-full bg-white" style={{ clipPath: "polygon(0 0, 5% 100%, 10% 0, 15% 100%, 20% 0, 25% 100%, 30% 0, 35% 100%, 40% 0, 45% 100%, 50% 0, 55% 100%, 60% 0, 65% 100%, 70% 0, 75% 100%, 80% 0, 85% 100%, 90% 0, 95% 100%, 100% 0)" }}></div>
      </div>

      {/* ACCIONES */}
      <div className="mt-8 flex flex-col gap-3">
        <Button 
          onClick={handleFinalizar}
          disabled={isPending}
          className="h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg rounded-2xl shadow-xl transition-all active:scale-95"
        >
          {isPending ? (
            <> <Loader2 className="mr-2 animate-spin" /> GUARDANDO... </>
          ) : (
            <> <CheckCircle2 className="mr-2" /> CONFIRMAR Y GUARDAR </>
          )}
        </Button>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1 rounded-xl h-12 font-bold text-slate-500"
            onClick={() => store.setStep(3)}
            disabled={isPending}
          >
            <ArrowLeft className="mr-2" size={16} /> VOLVER
          </Button>
          <Button variant="outline" className="rounded-xl h-12 font-bold text-slate-500">
            <Printer size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}