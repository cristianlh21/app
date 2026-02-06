// dashboard/reservas/useReservaStore.ts
import { create } from 'zustand';
import { ReservaStoreState, ReservaStoreActions } from './typesReserva';
import { differenceInDays } from 'date-fns'; // Necesitarás esta librería

export const useReservaStore = create<ReservaStoreState & ReservaStoreActions>((set, get) => ({
  currentStep: 1,
  fechaCheckIn: undefined,
  fechaCheckOut: undefined,
  habitacionId: null,
  habitacionNumero: undefined,
  tipoVendidoId: null,
  tipoVendidoNombre: undefined,
  precioVendido: 0,
  totalEstadia: 0,
  cliente: null,
  pagos: [],

  setStep: (step) => set({ currentStep: step }),

  // Al cambiar fechas, recalculamos el total si ya hay una habitación elegida
  setFechas: (inicio, fin) => {
    set({ fechaCheckIn: inicio, fechaCheckOut: fin });
    
    const state = get();
    if (state.precioVendido > 0 && inicio && fin) {
      const noches = Math.max(1, differenceInDays(fin, inicio));
      set({ totalEstadia: state.precioVendido * noches });
    }
  },

  setHabitacion: (id, numero, tipoId, tipoNombre, precio) => {
    const state = get();
    const noches = (state.fechaCheckIn && state.fechaCheckOut) 
      ? Math.max(1, differenceInDays(state.fechaCheckOut, state.fechaCheckIn))
      : 0;

    set({ 
      habitacionId: id, 
      habitacionNumero: numero,
      tipoVendidoId: tipoId,
      tipoVendidoNombre: tipoNombre,
      precioVendido: precio,
      totalEstadia: precio * noches
    });
  },

  setTipoVendido: (id, nombre, precio) => {
    const state = get();
    const noches = (state.fechaCheckIn && state.fechaCheckOut) 
      ? Math.max(1, differenceInDays(state.fechaCheckOut, state.fechaCheckIn))
      : 0;

    set({ 
      tipoVendidoId: id, 
      tipoVendidoNombre: nombre,
      precioVendido: precio,
      totalEstadia: precio * noches 
    });
  },

  setCliente: (cliente) => set({ cliente }),

  addPago: (pago) => set((state) => ({ 
    pagos: [...state.pagos, pago] 
  })),

  removePago: (index) => set((state) => ({
    pagos: state.pagos.filter((_, i) => i !== index)
  })),

  resetReserva: () => set({
    currentStep: 1,
    fechaCheckIn: undefined,
    fechaCheckOut: undefined,
    habitacionId: null,
    tipoVendidoId: null,
    precioVendido: 0,
    totalEstadia: 0,
    cliente: null,
    pagos: [],
  }),
}));