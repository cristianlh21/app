/* eslint-disable @typescript-eslint/no-explicit-any */
export function procesarAsistencias(asistencias: any[]) {
  const grupos: Record<string, any> = {};

  asistencias.forEach((reg) => {
    // Agrupamos usando la fecha UTC pura
    const d = new Date(reg.fecha);
    const fechaKey = `${d.getUTCFullYear()}-${(d.getUTCMonth()+1).toString().padStart(2,'0')}-${d.getUTCDate().toString().padStart(2,'0')}`;
    const key = `${fechaKey}-${reg.turno}`;

    if (!grupos[key]) {
      grupos[key] = { fecha: reg.fecha, turno: reg.turno, entradaReg: null, salidaReg: null };
    }

    if (reg.tipo === "ENTRADA") grupos[key].entradaReg = reg;
    if (reg.tipo === "SALIDA") grupos[key].salidaReg = reg;
  });

  return Object.values(grupos).map((grupo) => {
    let duracion = "---";
    let minutosTotales = 0;
    
    if (grupo.entradaReg && grupo.salidaReg) {
      const entrada = new Date(grupo.entradaReg.hora);
      const salida = new Date(grupo.salidaReg.hora);

      // Calculamos la diferencia en milisegundos usando los valores UTC
      const diffMs = salida.getTime() - entrada.getTime();
      minutosTotales = Math.floor(diffMs / 1000 / 60);

      const horas = Math.floor(minutosTotales / 60);
      const minsRestantes = minutosTotales % 60;
      duracion = `${horas}h ${minsRestantes}m`;
    } else if (grupo.entradaReg && !grupo.salidaReg) {
      duracion = "En curso...";
    }

    return { ...grupo, duracion, minutosTotales };
  });
}