// dashboard/reservas/_components/Step1Fechas.tsx
"use client";

import { useState, useEffect, useTransition } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, Search, Loader2, Check } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useReservaStore } from "../../useReservaStore";
import { getDisponibilidadAction, getTiposHabitacionAction } from "../../_actions";
import { HabitacionExtended } from "../../../habitaciones/typesHabitaciones";
import { TipoHabitacionClean } from "../../typesReserva";

export function Step1Fechas() {
  const store = useReservaStore();
  const [date, setDate] = useState<DateRange | undefined>({
    from: store.fechaCheckIn,
    to: store.fechaCheckOut,
  });
  const [habitaciones, setHabitaciones] = useState<HabitacionExtended[]>([]);
  const [tipos, setTipos] = useState<TipoHabitacionClean[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    getTiposHabitacionAction().then(setTipos);
  }, []);

  const handleBuscar = () => {
    if (!date?.from || !date?.to) return;
    startTransition(async () => {
      // El truco es: "as unknown as HabitacionExtended[]"
      // Le decimos: "Olvida lo que creas saber (unknown) y acéptalo como HabitacionExtended[]"
      const results = (await getDisponibilidadAction(
        date.from!,
        date.to!,
      )) as unknown as HabitacionExtended[];

      setHabitaciones(results);
      store.setFechas(date.from, date.to);
    });
  };

  return (
    <div className="space-y-6">
      {/* BUSCADOR DE FECHAS */}
      <div className="flex flex-wrap gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 items-end">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-500 uppercase ml-1">
            Rango de Estancia
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-70 justify-start bg-white",
                  !date && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "dd LLL")} -{" "}
                      {format(date.to, "dd LLL")}
                    </>
                  ) : (
                    format(date.from, "dd LLL")
                  )
                ) : (
                  <span>Seleccionar fechas</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
                locale={es}
              />
            </PopoverContent>
          </Popover>
        </div>
        <Button
          onClick={handleBuscar}
          disabled={isPending || !date?.to}
          className="bg-slate-800 h-10 px-6"
        >
          {isPending ? (
            <Loader2 className="animate-spin mr-2" />
          ) : (
            <Search className="mr-2" size={18} />
          )}
          Consultar
        </Button>
      </div>

      {/* RESULTADOS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {habitaciones.map((hab) => (
          <Card
            key={hab.id}
            className={cn(
              "p-4 cursor-pointer transition-all border-2 flex flex-col gap-3",
              store.habitacionId === hab.id
                ? "border-blue-500 bg-blue-50/50 shadow-md"
                : "hover:border-slate-300",
            )}
            onClick={() => {
              // IMPORTANTE: Ahora pasamos 5 datos, incluyendo el precioBase
              store.setHabitacion(
                hab.id,
                hab.numero,
                hab.tipoActual.id,
                hab.tipoActual.nombre,
                Number(hab.tipoActual.precioBase), // <--- Faltaba este campo
              );
            }}
          >
            <div className="flex justify-between items-center">
              <span className="text-2xl font-black text-slate-800">
                #{hab.numero}
              </span>
              {store.habitacionId === hab.id && (
                <div className="bg-blue-500 text-white rounded-full p-1">
                  <Check size={12} />
                </div>
              )}
            </div>

            {store.habitacionId === hab.id ? (
              <div
                className="space-y-2 bg-white p-2 rounded-lg border border-blue-100 shadow-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <label className="text-[10px] font-bold text-blue-600 uppercase">
                  Vender como
                </label>
                <Select
                  value={store.tipoVendidoId?.toString()}
                  onValueChange={(val) => {
                    const t = tipos.find((x) => x.id.toString() === val);
                    if (t) {
                      // Ahora pasamos los 3 argumentos: ID, Nombre y Precio
                      store.setTipoVendido(
                        t.id,
                        t.nombre,
                        Number(t.precioBase), // <--- El tercer argumento que faltaba
                      );
                    }
                  }}
                >
                  <SelectTrigger className="h-8 text-xs font-bold bg-slate-50 border-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tipos.map((t) => (
                      <SelectItem
                        key={t.id}
                        value={t.id.toString()}
                        className="text-xs"
                      >
                        {t.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {hab.tipoActual.nombre}
              </div>
            )}
          </Card>
        ))}
      </div>

      <div className="flex justify-end pt-6 border-t">
        <Button
          size="lg"
          disabled={!store.habitacionId}
          onClick={() => store.setStep(2)}
          className="bg-blue-600 px-10 font-bold"
        >
          Siguiente: Cliente
        </Button>
      </div>
    </div>
  );
}
