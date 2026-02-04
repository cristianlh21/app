// app/dashboard/empleados/types.ts

import { Rol } from "@/generated/client/enums";
import * as z from "zod";

export const empleadoSchema = z.object({
  nombre: z.string().min(2, "El nombre es muy corto"),
  apellido: z.string().min(2, "El apellido es muy corto"),
  documento: z.string().min(7, "DNI inválido").max(8, "DNI inválido"),
  cuil: z.string().min(10, "CUIL inválido"),
  direccion: z.string().min(5, "Dirección incompleta"),
  telefono: z.string().min(8, "Teléfono incompleto"),
  pin: z.string().length(4, "El PIN debe ser de 4 dígitos"),
  rol: z.enum(Rol),
  fotoUrl: z.string().optional().nullable(),
});

export type EmpleadoFormValues = z.infer<typeof empleadoSchema>;

export interface Empleado {
  id: number;          // Cambiado de string a number
  nombre: string;
  apellido: string;
  documento: string;
  cuil: string;
  rol: Rol;
  pin: string;
  telefono: string | null;
  direccion: string | null;
  fotoUrl: string | null;
  isOnline: boolean;   // Agregado
  activo: boolean;     // Agregado
  createdAt: Date;
}