// dashboard/clientes/_lib/schemas.ts
import * as z from "zod";

export const clienteSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  documento: z.string().min(5, "Documento demasiado corto"),
  // Quitamos .optional() y usamos strings simples. 
  // Un campo vacío en el formulario será ""
  telefono: z.string(), 
  // El email es especial: o es un email válido o es un string vacío ""
  email: z.string().email("Email inválido").or(z.literal("")),
  direccion: z.string(),
  esEmpresa: z.boolean(),
});

export type ClienteFormValues = z.infer<typeof clienteSchema>;