/* eslint-disable @typescript-eslint/no-explicit-any */
// dashboard/habitaciones/page.tsx
import { Accordion } from "@/components/ui/accordion";
import { SeccionPiso } from "./_components/seccion-piso";
import { prisma } from "@/lib/prisma";
import { Piso } from "@/generated/client/enums";

export default async function HabitacionesPage() {
  /// 1. Buscamos las habitaciones incluyendo AMBOS tipos
  const habitacionesRaw = await prisma.habitacion.findMany({
    include: {
      tipoBase: true,
      tipoActual: true, // <--- ¡Esto es lo que faltaba!
    },
    orderBy: {
      numero: 'asc'
    }
  });

  // 2. Convertimos los objetos Decimal a números para que sean compatibles con el Cliente
  const habitaciones = habitacionesRaw.map(h => ({
    ...h,
    tipoBase: {
      ...h.tipoBase,
      precioBase: h.tipoBase.precioBase.toNumber()
    },
    tipoActual: {
      ...h.tipoActual,
      precioBase: h.tipoActual.precioBase.toNumber()
    }
  }));
  // 2. Definimos el orden manual de los pisos para que no se ordenen alfabéticamente
  const ordenPisos: Piso[] = [
    "PLANTA_BAJA",
    "PRIMER_PISO",
    "SEGUNDO_PISO",
    "TERCER_PISO",
    "CUARTO_PISO"
  ];

  return (
    <div className="p-8 max-w-400 mx-auto space-y-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-800">
          Mapa de Habitaciones
        </h1>
        <p className="text-slate-500">
          Visualiza y gestiona el estado actual de las unidades.
        </p>
      </header>

      {/* Contenedor principal de los pisos */}
      <Accordion 
        type="multiple" 
        defaultValue={["PLANTA_BAJA", "PRIMER_PISO"]} 
        className="w-full"
      >
        {ordenPisos.map((piso) => {
          const habsDelPiso = habitaciones.filter(h => h.piso === piso);
          
          // Si el piso no tiene habitaciones (ej. un piso nuevo vacío), no lo mostramos
          if (habsDelPiso.length === 0) return null;

          return (
            <SeccionPiso 
              key={piso} 
              nombrePiso={piso} 
              habitaciones={habsDelPiso as any} 
            />
          );
        })}
      </Accordion>
    </div>
  );
}