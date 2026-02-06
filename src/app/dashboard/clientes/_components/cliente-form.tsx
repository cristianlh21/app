/* eslint-disable @typescript-eslint/no-unused-vars */
// dashboard/reservas/_components/cliente-form.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clienteSchema, ClienteFormValues } from "../_lib/schemas";
import { buscarClienteAction } from "../_actions"; // <--- Importamos la acción

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Loader2, SearchCheck } from "lucide-react";
import { toast } from "sonner";

interface ClienteFormProps {
  defaultValues?: Partial<ClienteFormValues>;
  onSubmit: (values: ClienteFormValues) => void;
  className?: string;
  children?: React.ReactNode;
}

export function ClienteForm({ defaultValues, onSubmit, className, children }: ClienteFormProps) {
  const [isSearching, setIsSearching] = useState(false);
  const [found, setFound] = useState(false);

  const form = useForm<ClienteFormValues>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      nombre: defaultValues?.nombre || "",
      documento: defaultValues?.documento || "",
      telefono: defaultValues?.telefono || "",
      email: defaultValues?.email || "",
      direccion: defaultValues?.direccion || "",
      esEmpresa: defaultValues?.esEmpresa ?? false,
    },
  });

  // FUNCIÓN DE BÚSQUEDA AUTOMÁTICA
  const handleBuscarCliente = async (documento: string) => {
    if (documento.length < 5) return; // No buscamos si el documento es muy corto

    setIsSearching(true);
    setFound(false);

    try {
      const cliente = await buscarClienteAction(documento);

      if (cliente) {
        // Llenamos el formulario con los datos encontrados
        form.setValue("nombre", cliente.nombre);
        form.setValue("telefono", cliente.telefono || "");
        form.setValue("email", cliente.email || "");
        form.setValue("direccion", cliente.direccion || "");
        form.setValue("esEmpresa", cliente.esEmpresa);
        
        setFound(true);
        toast.success("Cliente encontrado en la base de datos");
      }
    } catch (error) {
      console.error("Error al buscar cliente");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-6", className)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* DOCUMENTO - El disparador de la búsqueda */}
          <FormField
            control={form.control}
            name="documento"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel className="font-bold text-slate-700 flex items-center gap-2">
                  Documento / CUIT
                  {isSearching && <Loader2 className="h-3 w-3 animate-spin text-blue-500" />}
                  {found && <SearchCheck className="h-4 w-4 text-emerald-500" />}
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Ej: 20123456789" 
                    {...field} 
                    className={cn(
                        "bg-white transition-all",
                        found && "border-emerald-500 bg-emerald-50/30"
                    )}
                    // Cuando el usuario sale del input (onBlur), buscamos
                    onBlur={(e) => {
                        field.onBlur(); // Mantenemos la lógica de React Hook Form
                        handleBuscarCliente(e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* NOMBRE */}
          <FormField
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-slate-700">Nombre o Razón Social</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre completo" {...field} className="bg-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* EMAIL */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-slate-700">Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="correo@ejemplo.com" {...field} className="bg-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* TELÉFONO */}
          <FormField
            control={form.control}
            name="telefono"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-slate-700">Teléfono</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: +54 9..." {...field} className="bg-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* DIRECCIÓN */}
          <FormField
            control={form.control}
            name="direccion"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel className="font-bold text-slate-700">Dirección</FormLabel>
                <FormControl>
                  <Input placeholder="Calle, Nro, Localidad..." {...field} className="bg-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* ES EMPRESA */}
          <FormField
            control={form.control}
            name="esEmpresa"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border p-4 bg-slate-50 md:col-span-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-bold">¿Es una empresa / entidad?</FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>

        <div className="pt-4">
          {children}
        </div>
      </form>
    </Form>
  );
}