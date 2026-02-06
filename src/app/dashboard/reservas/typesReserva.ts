// dashboard/reservas/typesReserva
export type Step = 1 | 2 | 3 | 4;

// 1. Definimos el tipo "Limpio" para el Tipo de Habitación
export interface TipoHabitacionClean {
  id: number;
  nombre: string;
  precioBase: number; // <--- Forzamos que sea number
  capacidadMaxima: number;
}

// 2. Definimos la Habitación tal cual la queremos en el Frontend
export interface HabitacionExtended {
  id: number;
  numero: string;
  piso: string;
  disponibilidad: string;
  estadoLimpieza: string;
  tipoBase: TipoHabitacionClean;   // <--- Usa nuestro tipo limpio
  tipoActual: TipoHabitacionClean; // <--- Usa nuestro tipo limpio
}

export interface ClienteReserva {
  id?: number;
  nombre: string;
  documento: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  esEmpresa: boolean;
}

export interface PagoReserva {
  monto: number;
  metodo: string;
  referencia?: string;
  esAdelanto: boolean;
}

// ESTADO DEL STORE (Lo que guardamos)
export interface ReservaStoreState {
  currentStep: Step;
  fechaCheckIn: Date | undefined;
  fechaCheckOut: Date | undefined;
  habitacionId: number | null;
  habitacionNumero: string | undefined;
  
  // --- NUEVOS CAMPOS DE PRECIO ---
  tipoVendidoId: number | null;
  tipoVendidoNombre: string | undefined;
  precioVendido: number; // Precio por noche acordado
  totalEstadia: number;  // Precio total (noches * precioVendido)
  
  cliente: ClienteReserva | null;
  pagos: PagoReserva[];
}

// ACCIONES DEL STORE (Lo que podemos hacer)
export interface ReservaStoreActions {
  setStep: (step: Step) => void;
  setFechas: (inicio: Date | undefined, fin: Date | undefined) => void;
  setHabitacion: (id: number, numero: string, tipoId: number, tipoNombre: string, precio: number) => void;
  setTipoVendido: (id: number, nombre: string, precio: number) => void;
  setCliente: (cliente: ClienteReserva) => void;
  addPago: (pago: PagoReserva) => void;
  removePago: (index: number) => void;
  resetReserva: () => void;
}