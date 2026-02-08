// dashboard/reservas/useReservaStore.ts
import { create } from 'zustand';
import { ReservaStoreState, ReservaStoreActions } from './typesReserva';
import { differenceInDays } from 'date-fns';

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
  isPrecioManual: false,
  cliente: null,
  pagos: [],

  setStep: (step) => set({ currentStep: step }),

  setFechas: (inicio, fin) => {
    set({ fechaCheckIn: inicio, fechaCheckOut: fin });
    
    const state = get();
    // Solo recalculamos automáticamente si NO hemos puesto un precio a mano
    if (state.precioVendido > 0 && inicio && fin && !state.isPrecioManual) {
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
      isPrecioManual: false, // Al cambiar de habitación, volvemos al modo automático
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
      isPrecioManual: false, // Al cambiar de tipo, volvemos al modo automático
      totalEstadia: precio * noches 
    });
  },

  setTotalManual: (nuevoTotal) => {
    set({ 
      totalEstadia: nuevoTotal,
      isPrecioManual: true // "Traba" para que no se cambie solo al tocar las fechas
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
    isPrecioManual: false,
    cliente: null,
    pagos: [],
  }),
}));