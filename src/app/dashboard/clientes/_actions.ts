'use server'
import { prisma } from "@/lib/prisma";

export async function buscarClienteAction(documento: string) {
  return await prisma.cliente.findUnique({ where: { documento } });
}
