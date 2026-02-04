"use server"

import { cookies } from "next/headers"
import { SignJWT } from "jose"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma" // Asegúrate de tener prisma exportado en lib

const SECRET_KEY = new TextEncoder().encode("clave-secreta-del-hotel-123")

export async function loginAction(pin: string) {
  // 1. Buscamos al empleado en la base de datos
  const empleado = await prisma.empleado.findUnique({
    where: { pin }
  })

  if (!empleado) {
    return { error: "PIN incorrecto" }
  }

  // 2. Creamos el sello (JWT) con los datos del empleado
  const token = await new SignJWT({ 
      id: empleado.id, 
      nombre: empleado.nombre, 
      rol: empleado.rol 
    })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h") // La sesión dura 8 horas (un turno)
    .sign(SECRET_KEY)

  // 3. Guardamos el sello en una Cookie segura
  const cookieStore = await cookies()
  cookieStore.set("session_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  })

  // 4. Mandamos al empleado al panel principal
  redirect("/dashboard")
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete("session_token")
  redirect("/")
}