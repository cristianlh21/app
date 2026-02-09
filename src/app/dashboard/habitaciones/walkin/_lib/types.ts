import { MetodoPago } from "@/generated/client/client";

// 1. Datos del Huésped (El primero será el Cliente/Pagador)
export interface HuespedWalkIn {
  nombre: string;
  apellido: string;
  documento: string;
  nacionalidad: string;
}

// 2. Servicios Extras cargados en el momento
export interface ServicioExtraWalkIn {
  descripcion: string;
  monto: number;
  cantidad: number;
}

// 3. Información del Pago Inicial
export interface PagoInicialWalkIn {
  monto: number;
  metodo: MetodoPago;
  referencia?: string;
}

// 4. El "Contrato Maestro": Todo lo que el formulario debe recolectar
export interface WalkInData {
  // Información de la Unidad
  habitacionId: number;
  tipoVendidoId: number;
  numeroHabitacion: string; // <--- AGREGAR ESTO
  tipoNombre: string;
  precioPactado: number; // Por si se cambia el precio base en el mostrador

  // Paso 1: Fechas
  fechaCheckIn: Date;    // Siempre será "hoy" para un Walk-In
  fechaCheckOut: Date;

  // Paso 2: Huéspedes
  huespedes: HuespedWalkIn[];

  // Paso 3: Extras
  servicios: ServicioExtraWalkIn[];

  // Paso 4: Cierre
  pago?: PagoInicialWalkIn;
  empleadoId: number;    // El recepcionista que opera
  totalEstadia: number;
  totalExtras: number;
  totalGeneral: number;
  observaciones?: string;
}

// 5. Tipo para la respuesta de la Acción de Servidor
export type WalkInResponse = 
  | { success: true; reservaId: number }
  | { success: false; error: string };