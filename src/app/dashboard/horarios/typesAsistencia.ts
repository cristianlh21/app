import { Empleado } from "../empleados/typesEmpleado";

export interface Asistencia {
  id: number;
  empleadoId: number;
  fecha: Date;
  tipo: "ENTRADA" | "SALIDA";
  hora: Date;
  turno: "MAÑANA" | "TARDE" | "NOCHE";
  registradoPor: number;
}

// Definimos la estructura de las props para el componente
export interface AsistenciaCardProps {
  empleado: Empleado;
  registros: Asistencia[];
}