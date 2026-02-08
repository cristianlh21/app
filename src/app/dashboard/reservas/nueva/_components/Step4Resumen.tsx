// dashboard/reservas/_components/Step4Resumen.tsx
"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useReservaStore } from "../../useReservaStore";
import { crearReservaCompletaAction } from "../../_actions";
import { Button } from "@/components/ui/button";
import { format, differenceInDays } from "date-fns"; // Usamos la misma lógica que el store
import { 
  CheckCircle2, 
  ArrowLeft, 
  Loader2, 
  User, 
  CalendarDays, 
  Hotel,
  CreditCard,
  Tag
} from "lucide-react";
import { toast } from "sonner";

export function Step4Resumen() {
  const store = useReservaStore();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Cálculos precisos para el ticket
  const noches = (store.fechaCheckIn && store.fechaCheckOut) 
    ? Math.max(1, differenceInDays(store.fechaCheckOut, store.fechaCheckIn))
    : 0;
    
  const totalCobrado = store.pagos.reduce((acc, p) => acc + p.monto, 0);
  const saldoAlCheckIn = store.totalEstadia - totalCobrado;

  // Calculamos si hubo descuento (Diferencia entre precio base x noches vs total final)
  const precioSugeridoTotal = store.precioVendido * noches;
  const diferenciaAjuste = precioSugeridoTotal - store.totalEstadia;

  const handleFinalizar = () => {
    startTransition(async () => {
      if (!store.cliente || !store.habitacionId || !store.fechaCheckIn || !store.fechaCheckOut) {
        toast.error("Faltan datos para completar la reserva.");
        return;
      }

      const result = await crearReservaCompletaAction({
        cliente: store.cliente,
        habitacionId: store.habitacionId,
        tipoVendidoId: store.tipoVendidoId!,
        precioVendido: store.precioVendido, // Precio por noche
        fechaCheckIn: store.fechaCheckIn,
        fechaCheckOut: store.fechaCheckOut,
        pagos: store.pagos,
        totalEstadia: store.totalEstadia, // Este es el total que pudo ser editado
      });

      if (result.success) {
        toast.success("¡Reserva creada con éxito!");
        store.resetReserva();
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error(result.error || "Ocurrió un error al guardar");
      }
    });
  };

  return (
    <div className="max-w-md mx-auto animate-in fade-in zoom-in duration-500 pb-20">
      <div className="relative bg-white shadow-2xl overflow-hidden border border-slate-100">
        
        {/* Zig-Zag Superior */}
        <div className="h-3 w-full bg-slate-100" style={{ clipPath: "polygon(0 100%, 5% 0, 10% 100%, 15% 0, 20% 100%, 25% 0, 30% 100%, 35% 0, 40% 100%, 45% 0, 50% 100%, 55% 0, 60% 100%, 65% 0, 70% 100%, 75% 0, 80% 100%, 85% 0, 90% 100%, 95% 0, 100% 100%)" }}></div>

        <div className="p-8 space-y-6 font-mono text-[13px] text-slate-600">
          
          <div className="text-center border-b border-dashed pb-4">
            <h2 className="text-lg font-black text-slate-900 tracking-tighter uppercase leading-none">Voucher de Reserva</h2>
            <p className="text-[9px] text-slate-400 mt-2">Shauard Hotel Salta</p>
          </div>

          {/* TITULAR */}
          <section className="space-y-1">
            <div className="flex items-center gap-2 font-black text-slate-900 mb-2 uppercase text-[10px]">
              <User size={12} className="text-blue-500" /> Datos del Cliente
            </div>
            <div className="flex justify-between uppercase"><span>Nombre:</span> <span className="font-bold text-slate-900">{store.cliente?.nombre}</span></div>
            <div className="flex justify-between"><span>DNI/CUIT:</span> <span>{store.cliente?.documento}</span></div>
          </section>

          {/* ESTANCIA */}
          <section className="pt-4 border-t border-dashed">
            <div className="flex items-center gap-2 font-black text-slate-900 mb-2 uppercase text-[10px]">
              <CalendarDays size={12} className="text-blue-500" /> Estancia
            </div>
            <div className="flex justify-between"><span>Check-In:</span> <span>{store.fechaCheckIn ? format(store.fechaCheckIn, "dd/MM/yyyy") : "-"}</span></div>
            <div className="flex justify-between"><span>Check-Out:</span> <span>{store.fechaCheckOut ? format(store.fechaCheckOut, "dd/MM/yyyy") : "-"}</span></div>
            <div className="flex justify-between font-bold text-slate-900"><span>Noches:</span> <span>{noches}</span></div>
          </section>

          {/* DETALLE ECONÓMICO */}
          <section className="pt-4 border-t border-dashed space-y-2">
             <div className="flex items-center gap-2 font-black text-slate-900 mb-2 uppercase text-[10px]">
              <Hotel size={12} className="text-blue-500" /> Habitación #{store.habitacionNumero}
            </div>
            <div className="flex justify-between">
                <span className="uppercase">{store.tipoVendidoNombre}</span>
                <span className="font-bold text-slate-900">${precioSugeridoTotal.toLocaleString()}</span>
            </div>
            
            {/* MOSTRAR DESCUENTO SOLO SI EXISTE */}
            {diferenciaAjuste !== 0 && (
                <div className="flex justify-between text-rose-500 italic bg-rose-50 px-2 py-1 rounded">
                    <span className="flex items-center gap-1"><Tag size={10}/> Ajuste de tarifa:</span>
                    <span>- ${diferenciaAjuste.toLocaleString()}</span>
                </div>
            )}
          </section>

          {/* COBROS */}
          <section className="pt-4 border-t border-dashed">
            <div className="flex items-center gap-2 font-black text-slate-900 mb-2 uppercase text-[10px]">
              <CreditCard size={12} className="text-emerald-600" /> Pagos/Señas
            </div>
            {store.pagos.map((p, idx) => (
              <div key={idx} className="flex justify-between italic text-slate-500">
                <span>{p.metodo}</span>
                <span>${p.monto.toLocaleString()}</span>
              </div>
            ))}
            {store.pagos.length === 0 && <p className="text-[11px] italic text-slate-400">Sin pagos previos.</p>}
          </section>

          {/* BALANCE FINAL */}
          <section className="pt-4 border-t-2 border-slate-900">
            <div className="flex justify-between text-slate-900 font-black text-sm pt-2">
              <span>TOTAL ESTANCIA:</span>
              <span>${store.totalEstadia.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-emerald-600 font-bold mt-1">
              <span>TOTAL PAGADO:</span>
              <span>- ${totalCobrado.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-base font-black text-white bg-slate-900 p-2 mt-4 rounded-lg">
              <span>SALDO A PAGAR:</span>
              <span>${saldoAlCheckIn.toLocaleString()}</span>
            </div>
          </section>

        </div>

        {/* Zig-Zag Inferior */}
        <div className="h-3 w-full bg-white" style={{ clipPath: "polygon(0 0, 5% 100%, 10% 0, 15% 100%, 20% 0, 25% 100%, 30% 0, 35% 100%, 40% 0, 45% 100%, 50% 0, 55% 100%, 60% 0, 65% 100%, 70% 0, 75% 100%, 80% 0, 85% 100%, 90% 0, 95% 100%, 100% 0)" }}></div>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <Button onClick={handleFinalizar} disabled={isPending} className="h-16 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg rounded-2xl shadow-xl">
          {isPending ? <><Loader2 className="mr-2 animate-spin" /> PROCESANDO... </> : <><CheckCircle2 className="mr-2" /> CONFIRMAR RESERVA </>}
        </Button>
        <Button variant="ghost" className="h-12 font-bold text-slate-400 uppercase tracking-widest" onClick={() => store.setStep(3)} disabled={isPending}>
          <ArrowLeft className="mr-2" size={16} /> Corregir Pagos
        </Button>
      </div>
    </div>
  );
}