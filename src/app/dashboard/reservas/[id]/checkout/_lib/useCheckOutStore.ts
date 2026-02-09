/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/dashboard/reservas/[id]/checkout/_lib/useCheckOutStore.ts
import { create } from 'zustand';

interface CheckOutState {
  currentStep: number;
  reservaId: number;
  totalEstadia: number;
  pagosPrevios: any[];
  cargosExtras: any[];
  nuevosPagos: any[];

  // ACCIONES
  setInitialData: (data: any) => void;
  setStep: (step: number) => void;
  agregarPagoFinal: (pago: any) => void;
  
  // CALCULOS (Usamos Number() para asegurar compatibilidad con Prisma Decimal)
  getTotalConsumos: () => number;
  getTotalPagado: () => number;
  getSaldoPendiente: () => number;
  
  reset: () => void;
}

export const useCheckOutStore = create<CheckOutState>((set, get) => ({
  currentStep: 1,
  reservaId: 0,
  totalEstadia: 0,
  pagosPrevios: [],
  cargosExtras: [],
  nuevosPagos: [],

  // Sincronización limpia: resetea y carga en un solo render
  setInitialData: (data) => set({
    reservaId: data.reservaId,
    totalEstadia: data.totalEstadia,
    pagosPrevios: data.pagosRealizados,
    cargosExtras: data.consumosExtras,
    currentStep: 1, // Siempre volvemos al paso 1 al cargar
    nuevosPagos: [] // Limpiamos pagos de sesiones anteriores
  }),

  setStep: (step) => set({ currentStep: step }),

  agregarPagoFinal: (pago) => set((state) => ({ 
    nuevosPagos: [...state.nuevosPagos, pago] 
  })),

  getTotalConsumos: () => {
    const { totalEstadia, cargosExtras } = get();
    const totalExtras = cargosExtras.reduce((acc, c) => acc + (Number(c.monto) * c.cantidad), 0);
    return Number(totalEstadia) + totalExtras;
  },

  getTotalPagado: () => {
    const { pagosPrevios, nuevosPagos } = get();
    const prev = pagosPrevios.reduce((acc, p) => acc + Number(p.monto), 0);
    const nuevos = nuevosPagos.reduce((acc, p) => acc + Number(p.monto), 0);
    return prev + nuevos;
  },

  getSaldoPendiente: () => {
    const saldo = get().getTotalConsumos() - get().getTotalPagado();
    // Retornamos 0 si el saldo es negativo (pago de más) para evitar confusión visual
    return saldo > 0 ? saldo : 0;
  },

  reset: () => set({ 
    currentStep: 1, 
    nuevosPagos: [], 
    reservaId: 0, 
    pagosPrevios: [], 
    cargosExtras: [] 
  })
}));