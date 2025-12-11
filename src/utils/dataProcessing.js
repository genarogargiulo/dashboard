/**
 * Calcula KPIs principales del dashboard
 * @param {Array} data - Datos de picking
 * @returns {Object} - KPIs calculados
 */
export const calculateKPIs = (data) => {
  const operaciones = [...new Set(data.map(d => d.ID_OPERACION))];
  const totalTraspasos = data.length;
  const operacionesCompletadas = data.filter(d => d.FECHA_FIN_OPERACION).length;
  
  const tiemposOp = data
    .filter(d => d.DURACION_OPERACION_MINUTOS)
    .map(d => d.DURACION_OPERACION_MINUTOS);
  
  const tiempoPromedio = tiemposOp.length > 0 
    ? tiemposOp.reduce((a, b) => a + b, 0) / tiemposOp.length 
    : 0;
  
  const eficiencia = operaciones.length > 0
    ? (operacionesCompletadas / data.length) * 100
    : 0;
  
  const repescas = data.filter(d => d.ES_REPESCA === 1).length;
  const tasaRepescas = totalTraspasos > 0 ? (repescas / totalTraspasos * 100) : 0;
  
  return {
    totalOperaciones: operaciones.length,
    totalTraspasos,
    tiempoPromedio: parseFloat(tiempoPromedio.toFixed(1)),
    eficiencia: parseFloat(eficiencia.toFixed(1)),
    repescas,
    tasaRepescas: parseFloat(tasaRepescas.toFixed(1))
  };
};

/**
 * Agrupa operaciones por día de la semana
 * @param {Array} data - Datos de picking
 * @returns {Array} - Datos agrupados por día
 */
export const groupByWeekday = (data) => {
  const grouped = data.reduce((acc, item) => {
    const dia = item.DIA_SEMANA;
    if (!acc[dia]) {
      acc[dia] = { dia, operaciones: new Set(), traspasos: 0 };
    }
    acc[dia].operaciones.add(item.ID_OPERACION);
    acc[dia].traspasos++;
    return acc;
  }, {});
  
  const ordenDias = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
  
  return ordenDias
    .map(dia => grouped[dia])
    .filter(Boolean)
    .map(g => ({
      dia: g.dia.substring(0, 3).toUpperCase(),
      operaciones: g.operaciones.size,
      traspasos: g.traspasos
    }));
};

/**
 * Calcula distribución de tiempos entre traspasos
 * @param {Array} data - Datos de picking
 * @returns {Array} - Distribución por rangos
 */
export const calculateTimeDistribution = (data) => {
  const rangos = [
    { intervalo: '0-30s', min: 0, max: 30, cantidad: 0 },
    { intervalo: '30-60s', min: 30, max: 60, cantidad: 0 },
    { intervalo: '1-2min', min: 60, max: 120, cantidad: 0 },
    { intervalo: '2-5min', min: 120, max: 300, cantidad: 0 },
    { intervalo: '5+min', min: 300, max: Infinity, cantidad: 0 }
  ];
  
  data.forEach(item => {
    const seg = item.SEGUNDOS_DESDE_TRASPASO_ANTERIOR;
    if (seg) {
      rangos.forEach(rango => {
        if (seg >= rango.min && seg < rango.max) {
          rango.cantidad++;
        }
      });
    }
  });
  
  return rangos;
};

/**
 * Obtiene top operarios por rendimiento
 * @param {Array} data - Datos de picking
 * @param {number} limit - Número de operarios a retornar
 * @returns {Array} - Top operarios
 */
export const getTopOperarios = (data, limit = 5) => {
  const grouped = data.reduce((acc, item) => {
    const operario = item.USUARIO_OPERACION;
    if (!acc[operario]) {
      acc[operario] = {
        nombre: operario,
        operaciones: new Set(),
        traspasos: 0,
        tiempos: [],
        repescas: 0
      };
    }
    acc[operario].operaciones.add(item.ID_OPERACION);
    acc[operario].traspasos++;
    if (item.DURACION_OPERACION_MINUTOS) {
      acc[operario].tiempos.push(item.DURACION_OPERACION_MINUTOS);
    }
    if (item.ES_REPESCA === 1) {
      acc[operario].repescas++;
    }
    return acc;
  }, {});
  
  return Object.values(grouped)
    .map(op => ({
      nombre: op.nombre,
      operaciones: op.operaciones.size,
      traspasos: op.traspasos,
      avgTiempo: op.tiempos.length > 0 
        ? parseFloat((op.tiempos.reduce((a, b) => a + b, 0) / op.tiempos.length).toFixed(1))
        : 0,
      eficiencia: parseFloat((100 - (op.repescas / op.traspasos * 100)).toFixed(1)),
      repescas: op.repescas
    }))
    .sort((a, b) => b.operaciones - a.operaciones)
    .slice(0, limit);
};

/**
 * Calcula tiempo promedio por rango de secuencia
 * @param {Array} data - Datos de picking
 * @returns {Array} - Tiempos por secuencia
 */
export const calculateTimeBySequence = (data) => {
  const grouped = data.reduce((acc, item) => {
    const secuencia = item.NUM_SECUENCIA;
    const rango = secuencia <= 5 ? '1-5' :
                  secuencia <= 10 ? '6-10' :
                  secuencia <= 15 ? '11-15' :
                  secuencia <= 20 ? '16-20' :
                  secuencia <= 25 ? '21-25' : '26+';
    
    if (!acc[rango]) {
      acc[rango] = { tiempos: [] };
    }
    if (item.SEGUNDOS_DESDE_TRASPASO_ANTERIOR) {
      acc[rango].tiempos.push(item.SEGUNDOS_DESDE_TRASPASO_ANTERIOR / 60);
    }
    return acc;
  }, {});
  
  const orden = ['1-5', '6-10', '11-15', '16-20', '21-25', '26+'];
  return orden.map(rango => ({
    secuencia: rango,
    tiempo: grouped[rango] && grouped[rango].tiempos.length > 0
      ? parseFloat((grouped[rango].tiempos.reduce((a, b) => a + b, 0) / grouped[rango].tiempos.length).toFixed(2))
      : 0
  })).filter(item => item.tiempo > 0);
};

/**
 * Obtiene últimas operaciones realizadas
 * @param {Array} data - Datos de picking
 * @param {number} limit - Número de operaciones
 * @returns {Array} - Últimas operaciones
 */
export const getLastOperations = (data, limit = 10) => {
  const ops = [...new Set(data.map(d => d.ID_OPERACION))]
    .map(opId => {
      const traspasos = data.filter(d => d.ID_OPERACION === opId);
      const primerTraspaso = traspasos[0];
      const ultimoTraspaso = traspasos[traspasos.length - 1];
      
      return {
        id: opId,
        operario: primerTraspaso.USUARIO_OPERACION,
        terminal: primerTraspaso.TERMINAL,
        traspasos: traspasos.length,
        duracion: ultimoTraspaso.DURACION_OPERACION_MINUTOS || 0,
        avgTras: ultimoTraspaso.DURACION_OPERACION_MINUTOS 
          ? parseFloat((ultimoTraspaso.DURACION_OPERACION_MINUTOS / traspasos.length).toFixed(1))
          : 0,
        estado: ultimoTraspaso.FECHA_FIN_OPERACION ? 'Completado' : 'En proceso',
        fecha: new Date(primerTraspaso.FECHA_INICIO_OPERACION),
        repescas: traspasos.filter(t => t.ES_REPESCA === 1).length
      };
    })
    .sort((a, b) => b.fecha - a.fecha)
    .slice(0, limit);
  
  return ops;
};