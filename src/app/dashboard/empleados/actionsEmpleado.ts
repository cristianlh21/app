/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { EmpleadoFormValues } from "./typesEmpleado"



export async function getEmpleados() {
  try {
    // Buscamos todos los empleados en la DB
    // Los ordenamos por apellido para que la recepción sea organizada
    const empleados = await prisma.empleado.findMany({
      orderBy: {
        apellido: "asc",
      },
    });

    return {
      success: true,
      data: empleados,
    };
  } catch (error) {
    console.error("Error al obtener empleados:", error);
    return {
      success: false,
      error: "No se pudo conectar con la base de datos de empleados.",
      data: [],
    };
  }
}


export async function createEmpleado(data: EmpleadoFormValues) {
  try {
    const nuevoEmpleado = await prisma.empleado.create({
      data: {
        nombre: data.nombre,
        apellido: data.apellido,
        documento: data.documento,
        cuil: data.cuil,
        direccion: data.direccion,
        telefono: data.telefono,
        pin: data.pin,
        rol: data.rol,
        fotoUrl: data.fotoUrl ?? null,
        // Estos campos los inicializamos nosotros aquí, no vienen del formulario
        activo: true, 
        isOnline: false,
      }
    })

    revalidatePath("/dashboard/empleados")
    return { success: true, data: nuevoEmpleado }
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, error: "El PIN, DNI o CUIL ya están registrados" }
    }
    return { success: false, error: "Error al crear el empleado" }
  }
}

export async function updateEmpleado(id: number, data: EmpleadoFormValues) {
  try {
    const empleadoActualizado = await prisma.empleado.update({
      where: { id },
      data: {
        ...data,
        // No actualizamos createdAt ni ID por seguridad
      },
    });

    // Forzamos a Next.js a refrescar las páginas donde se muestran estos datos
    revalidatePath("/dashboard/empleados");
    revalidatePath(`/dashboard/empleados/${id}`);

    return { success: true, data: empleadoActualizado };
  } catch (error) {
    console.error("Error al actualizar:", error);
    return { success: false, error: "No se pudieron guardar los cambios." };
  }
}

// app/dashboard/empleados/actionsEmpleado.ts

export async function deactivateEmpleado(id: number) {
  try {
    await prisma.empleado.update({
      where: { id },
      data: { activo: false }, // Cambiamos el estado a false
    });

    revalidatePath("/dashboard/empleados");
    return { success: true };
  } catch (error) {
    return { success: false, error: "No se pudo desactivar al empleado." };
  }
}