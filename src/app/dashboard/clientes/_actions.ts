'use server'
import { prisma } from "@/lib/prisma";

export async function buscarClienteAction(documento: string) {
  return await prisma.cliente.findUnique({ where: { documento } });
}

export async function buscarPersonaGlobalAction(documento: string) {
  try {
    // 1. Buscamos primero en Huéspedes
    const huesped = await prisma.huesped.findUnique({
      where: { documento }
    });

    if (huesped) {
      return {
        success: true,
        data: {
          nombre: huesped.nombre,
          apellido: huesped.apellido,
          nacionalidad: huesped.nacionalidad || "Argentina",
          tipo: "HUESPED"
        }
      };
    }

    // 2. Si no es huésped, buscamos en Clientes (tu lógica actual)
    const cliente = await prisma.cliente.findUnique({
      where: { documento }
    });

    if (cliente) {
      // Intentamos separar el nombre completo si es persona física
      const partes = cliente.nombre.split(" ");
      return {
        success: true,
        data: {
          nombre: partes[0] || "",
          apellido: partes.slice(1).join(" ") || "",
          nacionalidad: "Argentina",
          tipo: "CLIENTE"
        }
      };
    }

    return { success: false };
  } catch (error) {
    return { success: false, error: "Error de conexión" };
  }
}