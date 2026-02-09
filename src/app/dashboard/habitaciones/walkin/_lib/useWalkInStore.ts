// src/app/dashboard/habitaciones/walkin/_lib/useWalkInStore.ts
import { create } from 'zustand';
import { WalkInData, HuespedWalkIn, ServicioExtraWalkIn, PagoInicialWalkIn } from './types';

// Función auxiliar para normalizar fechas a medianoche
const resetTime = (date: Date) => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

interface WalkInStore extends WalkInData {
  currentStep: number;
  setStep: (step: number) => void;
  setRoom: (id: number, numero: string, tipoId: number, tipoNombre: string, precio: number) => void;
  setFechaOut: (fecha: Date) => void;
  addHuesped: (huesped: HuespedWalkIn) => void;
  removeHuesped: (documento: string) => void;
  addServicio: (servicio: ServicioExtraWalkIn) => void;
  removeServicio: (index: number) => void;
  setPago: (pago: PagoInicialWalkIn | undefined) => void;
  getNoches: () => number;
  calcTotalEstadia: () => number;
  calcTotalExtras: () => number;
  calcTotalGeneral: () => number;
  reset: () => void;
}

export const useWalkInStore = create<WalkInStore>((set, get) => ({
  // ESTADO INICIAL (Normalizado)
  currentStep: 1,
  habitacionId: 0,
  numeroHabitacion: "",
  tipoNombre: "",
  tipoVendidoId: 0,
  precioPactado: 0,
  fechaCheckIn: resetTime(new Date()),
  fechaCheckOut: resetTime(new Date(new Date().setDate(new Date().getDate() + 1))), // Mañana
  huespedes: [],
  servicios: [],
  pago: undefined,
  empleadoId: 0,
  totalEstadia: 0,
  totalExtras: 0,
  totalGeneral: 0,

  setStep: (step) => set({ currentStep: step }),

  setRoom: (id, numero, tipoId, tipoNombre, precio) => set({
    habitacionId: id,
    numeroHabitacion: numero,
    tipoVendidoId: tipoId,
    tipoNombre: tipoNombre,
    precioPactado: precio
  }),

  // Normalizamos la fecha que viene del calendario
  setFechaOut: (fecha) => set({ fechaCheckOut: resetTime(fecha) }),

  addHuesped: (huesped) => set((state) => ({ huespedes: [...state.huespedes, huesped] })),
  removeHuesped: (doc) => set((state) => ({ huespedes: state.huespedes.filter(h => h.documento !== doc) })),
  addServicio: (servicio) => set((state) => ({ servicios: [...state.servicios, servicio] })),
  removeServicio: (index) => set((state) => ({ servicios: state.servicios.filter((_, i) => i !== index) })),
  setPago: (pago) => set({ pago }),

  getNoches: () => {
    const { fechaCheckIn, fechaCheckOut } = get();
    // Al estar normalizadas a 00:00:00, la diferencia es exacta
    const diffTime = fechaCheckOut.getTime() - fechaCheckIn.getTime();
    const noches = Math.round(diffTime / (1000 * 60 * 60 * 24));
    return noches > 0 ? noches : 1; 
  },

  calcTotalEstadia: () => get().getNoches() * get().precioPactado,
  calcTotalExtras: () => get().servicios.reduce((acc, s) => acc + (s.monto * s.cantidad), 0),
  calcTotalGeneral: () => get().calcTotalEstadia() + get().calcTotalExtras(),

  reset: () => set({ 
    currentStep: 1, 
    huespedes: [], 
    servicios: [], 
    pago: undefined,
    fechaCheckIn: resetTime(new Date()),
    fechaCheckOut: resetTime(new Date(new Date().setDate(new Date().getDate() + 1)))
  })
}));