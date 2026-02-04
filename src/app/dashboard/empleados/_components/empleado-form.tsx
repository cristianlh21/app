/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Empleado, empleadoSchema, EmpleadoFormValues } from "../typesEmpleado";
import { createEmpleado, updateEmpleado } from "../actionsEmpleado";

interface EmpleadoFormProps {
  initialData?: Empleado | null;
  onSuccess?: () => void;
}

export function EmpleadoForm({ initialData, onSuccess }: EmpleadoFormProps) {
  const [isPending, setIsPending] = useState(false);

  // 1. Definir el formulario con valores iniciales dinámicos
  const form = useForm<EmpleadoFormValues>({
    resolver: zodResolver(empleadoSchema),
    defaultValues: initialData
      ? {
          nombre: initialData.nombre,
          apellido: initialData.apellido,
          documento: initialData.documento,
          cuil: initialData.cuil,
          direccion: initialData.direccion ?? "",
          telefono: initialData.telefono ?? "",
          pin: initialData.pin,
          rol: initialData.rol,
          fotoUrl: initialData.fotoUrl ?? "",
        }
      : {
          nombre: "",
          apellido: "",
          documento: "",
          cuil: "",
          direccion: "",
          telefono: "",
          pin: "",
          rol: "RECEPCIONISTA",
          fotoUrl: "",
        },
  });

  // 2. Manejador de envío (Submit)
  async function onSubmit(values: EmpleadoFormValues) {
    setIsPending(true);
    try {
      let result;

      if (initialData) {
        // Modo Edición
        result = await updateEmpleado(initialData.id, values);
      } else {
        // Modo Creación
        result = await createEmpleado(values);
      }

      if (result.success) {
        toast.success(initialData ? "Empleado actualizado" : "Empleado registrado correctamente");
        if (onSuccess) onSuccess();
      } else {
        toast.error(result.error || "Ocurrió un error inesperado");
      }
    } catch (error) {
      toast.error("Error de conexión con el servidor");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nombre */}
          <FormField
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Juan" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Apellido */}
          <FormField
            control={form.control}
            name="apellido"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellido</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Pérez" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* DNI */}
          <FormField
            control={form.control}
            name="documento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>DNI</FormLabel>
                <FormControl>
                  <Input placeholder="Solo números" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* CUIL */}
          <FormField
            control={form.control}
            name="cuil"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CUIL</FormLabel>
                <FormControl>
                  <Input placeholder="20-XXXXXXXX-9" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Teléfono */}
          <FormField
            control={form.control}
            name="telefono"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <Input placeholder="387XXXXXXX" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* PIN */}
          <FormField
            control={form.control}
            name="pin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PIN de Acceso (4 dígitos)</FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    maxLength={4} 
                    placeholder="****" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Dirección */}
        <FormField
          control={form.control}
          name="direccion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dirección Residencial</FormLabel>
              <FormControl>
                <Input placeholder="Calle, Número, Barrio..." {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Rol */}
        <FormField
          control={form.control}
          name="rol"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rol en el Hotel</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar cargo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ADMIN">Administrador</SelectItem>
                  <SelectItem value="RECEPCIONISTA">Recepcionista</SelectItem>
                  <SelectItem value="MUCAMA">Personal de Limpieza</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 h-11" 
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {initialData ? "Guardar Cambios" : "Registrar Empleado"}
        </Button>
      </form>
    </Form>
  );
}