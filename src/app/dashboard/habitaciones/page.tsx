/* eslint-disable @typescript-eslint/no-explicit-any */
import { Accordion } from "@/components/ui/accordion";
import { SeccionPiso } from "./_components/seccion-piso";
import { prisma } from "@/lib/prisma";
import { Piso } from "@/generated/client/enums";

export default async function HabitacionesPage() {
  const hoyInicio = new Date();
  hoyInicio.setHours(0, 0, 0, 0);
  const hoyFin = new Date();
  hoyFin.setHours(23, 59, 59, 999);

  const habitacionesRaw = await prisma.habitacion.findMany({
    include: {
      tipoBase: true,
      tipoActual: true,
      reservas: {
        where: {
          reserva: {
            estado: { in: ['CHECK_IN', 'CONFIRMADA', 'PENDIENTE'] },
            OR: [
              { fechaCheckIn: { lte: hoyFin }, fechaCheckOut: { gte: hoyInicio } }
            ]
          }
        },
        include: {
          reserva: { include: { cliente: true } },
          huespedes: { include: { huesped: true } }
        }
      }
    },
    orderBy: { numero: 'asc' }
  });

  // Limpieza profunda de Decimales para evitar errores de serialización
  const habitaciones = habitacionesRaw.map(h => ({
    ...h,
    tipoBase: { ...h.tipoBase, precioBase: h.tipoBase.precioBase.toNumber() },
    tipoActual: { ...h.tipoActual, precioBase: h.tipoActual.precioBase.toNumber() },
    reservas: h.reservas.map(rel => ({
      ...rel,
      precioAplicado: rel.precioAplicado.toNumber(),
      reserva: {
        ...rel.reserva,
        totalReserva: rel.reserva.totalReserva.toNumber()
      }
    }))
  }));

  const ordenPisos: Piso[] = ["PLANTA_BAJA", "PRIMER_PISO", "SEGUNDO_PISO", "TERCER_PISO", "CUARTO_PISO"];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tighter text-slate-900 italic uppercase">
          Mapa de Unidades
        </h1>
        <p className="text-slate-500 font-medium text-sm italic">Operaciones en tiempo real</p>
      </header>

      <Accordion type="multiple" defaultValue={["PLANTA_BAJA", "PRIMER_PISO"]} className="w-full">
        {ordenPisos.map((piso) => {
          const habsDelPiso = habitaciones.filter(h => h.piso === piso);
          if (habsDelPiso.length === 0) return null;
          return <SeccionPiso key={piso} nombrePiso={piso} habitaciones={habsDelPiso as any} />;
        })}
      </Accordion>
    </div>
  );
}