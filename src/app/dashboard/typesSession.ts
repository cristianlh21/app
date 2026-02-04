import { Rol } from "@/generated/client/enums";
import type { JWTPayload } from "jose";


export interface SessionPayload extends JWTPayload {
  id: string;
  nombre: string;
  rol: Rol;
}