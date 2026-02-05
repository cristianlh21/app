// dashboard/habitaciones/typesHabitaciones.ts

import { Habitacion, TipoHabitacion } from "@/generated/client/client";

export interface HabitacionClient {
  id: number;
  numero: string;
  piso: string;
  disponibilidad: string;
  estadoLimpieza: string;
  tipoBase: {
    id: number;
    nombre: string;
    precioBase: number; // <--- Cambiamos Decimal por number
    capacidadMaxima: number;
  };
  // ... cualquier otro campo que necesites
}

export type HabitacionExtended = Habitacion & {
  tipoBase: TipoHabitacion;
  tipoActual: TipoHabitacion;
};

export interface ReservaHardcoded {
  titular: string;
  esCheckInHoy: boolean;
}

export interface HabitacionCardProps {
  habitacion: HabitacionExtended;
  reserva?: ReservaHardcoded; 
}