// dashboard/reservas/_components/cobro-form.tsx
"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

// 1. Definimos una INTERFAZ manual. Esto es lo más seguro para novatos.
// Así le decimos a TypeScript: "No adivines, estas son las reglas".
export interface CobroFormValues {
  monto: number;
  metodo: string;
  referencia: string;
}

// 2. El esquema ahora usa z.number() directamente. 
const cobroSchema = z.object({
  monto: z.number().min(1, "El monto debe ser mayor a 0"),
  metodo: z.string().min(1, "Seleccione un método"),
  referencia: z.string(),
});

interface CobroFormProps {
  onAdd: (cobro: CobroFormValues) => void;
  labelBoton?: string;
}

export function CobroForm({ onAdd, labelBoton = "Registrar Cobro" }: CobroFormProps) {
  
  // 3. Forzamos al resolver a aceptar nuestra interfaz manual
  const form = useForm<CobroFormValues>({
    resolver: zodResolver(cobroSchema),
    defaultValues: {
      monto: 0,
      metodo: "EFECTIVO",
      referencia: "",
    },
  });

  const onSubmit = (values: CobroFormValues) => {
    onAdd(values);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        
        {/* MONTO */}
        <FormField
          control={form.control}
          name="monto"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold uppercase text-slate-500">Monto</FormLabel>
              <FormControl>
                {/* TRUCO: onChange={(e) => field.onChange(Number(e.target.value))} 
                    Esto convierte el texto del input en número ANTES de enviarlo a Zod */}
                <Input 
                  type="number" 
                  placeholder="0.00" 
                  {...field} 
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  className="font-bold" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* MÉTODO */}
        <FormField
          control={form.control}
          name="metodo"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold uppercase text-slate-500">Forma de Cobro</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger><SelectValue placeholder="Elegir..." /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="EFECTIVO">Efectivo</SelectItem>
                  <SelectItem value="TRANSFERENCIA">Transferencia</SelectItem>
                  <SelectItem value="TARJETA_DEBITO">Débito</SelectItem>
                  <SelectItem value="TARJETA_CREDITO">Crédito</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* REFERENCIA */}
        <FormField
          control={form.control}
          name="referencia"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold uppercase text-slate-500">Referencia</FormLabel>
              <FormControl>
                <Input placeholder="Opcional..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="bg-blue-800 hover:bg-blue-900 font-bold h-10">
          <Plus className="mr-2 h-4 w-4" /> {labelBoton}
        </Button>
      </form>
    </Form>
  );
}