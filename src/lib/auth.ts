/* eslint-disable @typescript-eslint/no-unused-vars */
// lib/auth.ts
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || "clave-secreta-del-hotel-123");

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as { id: number; nombre: string; rol: string };
  } catch (error) {
    return null;
  }
}