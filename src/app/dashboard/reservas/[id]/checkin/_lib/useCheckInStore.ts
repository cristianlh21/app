/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/dashboard/reservas/[id]/checkin/_lib/useCheckInStore.ts
import { create } from 'zustand';
import { differenceInDays } from 'date-fns';

interface Huesped { nombre: string; apellido: string; documento: string; nacionalidad: string; }
interface CargoExtra { descripcion: string; monto: number; cantidad: number; }

interface CheckInState {
  currentStep: number;
  // IDs para Prisma
  reservaId: number;
  reservaHabitacionId: number; 
  habitacionId: number;
  
  // Datos de la Reserva
  capacidadMaxima: number;
  tipoVendidoId: number;
  titularNombre: string;
  numeroHabitacion: string;
  tipoVendidoNombre: string;
  fechaCheckIn: Date | null;
  fechaCheckOut: Date | null;
  
  // Lógica de Precios (NUEVO)
  precioPorNoche: number;
  totalEstadia: number;
  isPrecioManual: boolean;

  // Ocupantes y Cargos
  titularSeHospeda: boolean;
  huespedesAdicionales: Huesped[];
  cargosExtras: CargoExtra[];

  // ACCIONES
  setInitialData: (data: any) => void;
  setStep: (step: number) => void;
  
  // Gestión de Habitación y Precio (NUEVO)
  cambiarHabitacion: (hab: { id: number, numero: string, tipoId: number, tipoNombre: string, precio: number }) => void;
  setTotalManual: (nuevoTotal: number) => void;

  // Gestión de Huéspedes
  toggleTitularSeHospeda: () => void;
  agregarHuesped: (h: Huesped) => void;
  updateHuespedAdicional: (index: number, data: Partial<Huesped>) => void;
  removerHuesped: (index: number) => void;
  
  // Gestión de Cargos
  agregarCargo: (c: CargoExtra) => void;
  removerCargo: (index: number) => void;
  
  reset: () => void;
}

export const useCheckInStore = create<CheckInState>((set, get) => ({
  currentStep: 1,
  reservaId: 0,
  reservaHabitacionId: 0,
  habitacionId: 0,
  capacidadMaxima: 1,
  tipoVendidoId: 0,
  titularNombre: "",
  numeroHabitacion: "",
  tipoVendidoNombre: "",
  fechaCheckIn: null,
  fechaCheckOut: null,
  
  precioPorNoche: 0,
  totalEstadia: 0,
  isPrecioManual: false,

  titularSeHospeda: false,
  huespedesAdicionales: [],
  cargosExtras: [],

  setInitialData: (data) => set({ 
    reservaId: data.reservaId,
    reservaHabitacionId: data.reservaHabitacionId,
    habitacionId: data.habitacionId,
    capacidadMaxima: data.capacidadMaxima,
    tipoVendidoId: data.tipoVendidoId,
    titularNombre: data.titularNombre,
    numeroHabitacion: data.numeroHabitacion,
    tipoVendidoNombre: data.tipoVendidoNombre,
    fechaCheckIn: data.fechaCheckIn,
    fechaCheckOut: data.fechaCheckOut,
    precioPorNoche: data.precioPorNoche,
    totalEstadia: data.totalEstadia,
    isPrecioManual: data.isPrecioManual || false
  }),

  setStep: (step) => set({ currentStep: step }),

  // NUEVA ACCIÓN: Para cuando el recepcionista elige otra habitación en el Paso 1
  cambiarHabitacion: (hab) => {
    const state = get();
    const noches = (state.fechaCheckIn && state.fechaCheckOut) 
      ? Math.max(1, differenceInDays(state.fechaCheckOut, state.fechaCheckIn)) 
      : 1;

    set({
      habitacionId: hab.id,
      numeroHabitacion: hab.numero,
      tipoVendidoId: hab.tipoId,
      tipoVendidoNombre: hab.tipoNombre,
      precioPorNoche: hab.precio,
      // Si cambia de habitación, recalculamos el total automáticamente
      totalEstadia: hab.precio * noches,
      isPrecioManual: false
    });
  },

  // NUEVA ACCIÓN: Para aplicar descuentos manuales en el Check-In
  setTotalManual: (nuevoTotal) => set({ 
    totalEstadia: nuevoTotal, 
    isPrecioManual: true 
  }),

  toggleTitularSeHospeda: () => {
    const { titularSeHospeda, huespedesAdicionales, capacidadMaxima } = get();
    const ocupantesActuales = (titularSeHospeda ? 1 : 0) + huespedesAdicionales.length;
    if (!titularSeHospeda && ocupantesActuales >= capacidadMaxima) return; 
    set({ titularSeHospeda: !titularSeHospeda });
  },

  agregarHuesped: (h) => {
    const { titularSeHospeda, huespedesAdicionales, capacidadMaxima } = get();
    const ocupantesActuales = (titularSeHospeda ? 1 : 0) + huespedesAdicionales.length;
    if (ocupantesActuales < capacidadMaxima) {
      set({ huespedesAdicionales: [...huespedesAdicionales, h] });
    }
  },

  updateHuespedAdicional: (index, data) => {
    const { huespedesAdicionales } = get();
    const nuevos = huespedesAdicionales.map((h, i) => i === index ? { ...h, ...data } : h);
    set({ huespedesAdicionales: nuevos });
  },

  removerHuesped: (index) => set((state) => ({
    huespedesAdicionales: state.huespedesAdicionales.filter((_, i) => i !== index)
  })),

  agregarCargo: (c) => set((state) => ({ cargosExtras: [...state.cargosExtras, c] })),
  removerCargo: (index) => set((state) => ({
    cargosExtras: state.cargosExtras.filter((_, i) => i !== index)
  })),

  reset: () => set({ 
    currentStep: 1, 
    titularSeHospeda: false, 
    huespedesAdicionales: [], 
    cargosExtras: [],
    isPrecioManual: false 
  })
}));