/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/dashboard/reservas/[id]/checkin/_lib/typesCheckIn.ts

export interface HuespedCheckIn {
  nombre: string;
  apellido: string;
  documento: string;
  nacionalidad: string;
}

export interface CargoExtra {
  descripcion: string;
  monto: number;
  cantidad: number;
}

export interface CheckInStoreState {
  currentStep: number;
  // Datos de la Reserva
  reservaId: number;
  reservaHabitacionId: number;
  titularNombre: string;
  fechaCheckIn: Date | undefined;
  fechaCheckOut: Date | undefined;
  
  // Datos de la Habitación y Categoría
  habitacionId: number;
  numeroHabitacion: string;
  tipoVendidoId: number;
  tipoVendidoNombre: string;
  precioPorNoche: number;
  totalEstadia: number;
  isPrecioManual: boolean;

  // Ocupantes y Cargos
  titularSeHospeda: boolean;
  huespedesAdicionales: HuespedCheckIn[];
  cargosExtras: CargoExtra[];
}

export interface CheckInStoreActions {
  setInitialData: (data: any) => void;
  setStep: (step: number) => void;
  // Gestión de Habitación y Precio
  cambiarHabitacion: (habId: number, numero: string, tipoId: number, tipoNombre: string, precio: number) => void;
  setTotalManual: (nuevoTotal: number) => void;
  // Otros
  setTitularSeHospeda: (val: boolean) => void;
  agregarHuesped: (h: HuespedCheckIn) => void;
  updateHuesped: (index: number, data: Partial<HuespedCheckIn>) => void;
  removerHuesped: (index: number) => void;
  agregarCargo: (c: CargoExtra) => void;
  removerCargo: (index: number) => void;
  reset: () => void;
}