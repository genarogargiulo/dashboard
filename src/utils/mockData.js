/**
 * Genera datos mock basados en la estructura SQL real
 * @param {number} numOperaciones - Número de operaciones a generar
 * @returns {Array} - Array de datos mock
 */
export const generateMockData = (numOperaciones = 50) => {
  const operations = [];
  const now = new Date();
  
  const operarios = [
    'Juan Pérez', 
    'María García', 
    'Carlos Ruiz', 
    'Ana López', 
    'Pedro Martínez', 
    'Laura Sánchez',
    'Roberto Díaz',
    'Carmen Fernández'
  ];
  
  const terminales = ['T-01', 'T-02', 'T-03', 'T-04', 'T-05', 'T-06', 'T-07', 'T-08'];
  
  const tiendas = [
    'Tienda Centro',
    'Tienda Norte', 
    'Tienda Sur', 
    'Tienda Este', 
    'Tienda Oeste',
    'Tienda Mall',
    'Tienda Outlet'
  ];
  
  const secciones = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2'];
  
  for (let i = 0; i < numOperaciones; i++) {
    // Fecha de operación en los últimos 7 días
    const opDate = new Date(now - Math.random() * 7 * 24 * 60 * 60 * 1000);
    const opStartDate = new Date(opDate.getTime() + Math.random() * 30 * 60 * 1000);
    const numTraspasos = Math.floor(Math.random() * 25) + 10;
    
    const operario = operarios[Math.floor(Math.random() * operarios.length)];
    const terminal = terminales[Math.floor(Math.random() * terminales.length)];
    
    let previousTraspasoDate = opStartDate;
    
    // Generar traspasos para esta operación
    for (let j = 0; j < numTraspasos; j++) {
      const segundosEntreTraspaso = Math.random() * 180 + 20; // 20-200 segundos
      const traspasoDate = new Date(previousTraspasoDate.getTime() + segundosEntreTraspaso * 1000);
      
      const cantATranspasar = Math.floor(Math.random() * 10) + 1;
      const cantTraspasada = Math.random() > 0.1 ? cantATranspasar : Math.floor(Math.random() * cantATranspasar);
      
      operations.push({
        ID_OPERACION: `OP-${1000 + i}`,
        FECHA_CREACION_OPERACION: opDate.toISOString(),
        FECHA_INICIO_OPERACION: opStartDate.toISOString(),
        FECHA_FIN_OPERACION: j === numTraspasos - 1 
          ? new Date(traspasoDate.getTime() + 60000).toISOString() 
          : null,
        USUARIO_OPERACION: operario,
        TERMINAL: terminal,
        FECHA_DESBLOQUEO: opDate.toISOString(),
        FECHA_PRIMERA_CARGA: new Date(opStartDate.getTime() - 120000).toISOString(),
        ID_PEDIDO: `PED-${2000 + i}`,
        ID_ARTICULO: `ART-${Math.floor(Math.random() * 1000)}`,
        CANT_A_TRASPASAR: cantATranspasar,
        CANT_TRASPASADA: cantTraspasada,
        ETIQUETA_BULTO: `BLT-${Math.floor(Math.random() * 10000)}`,
        UBICACION_ORIGEN: `${secciones[Math.floor(Math.random() * secciones.length)]}-${Math.floor(Math.random() * 20)}-${Math.floor(Math.random() * 10)}`,
        ID_TIENDA_DESTINO: Math.floor(Math.random() * 7) + 1,
        NOMBRE_TIENDA: tiendas[Math.floor(Math.random() * tiendas.length)],
        NUM_SECUENCIA: j + 1,
        FECHA_TRASPASO: traspasoDate.toISOString(),
        CLASE_STOCK: Math.random() > 0.5 ? 'DISPONIBLE' : 'RESERVADO',
        USUARIO_TRASPASO: operario,
        ID_SECCION: secciones[Math.floor(Math.random() * secciones.length)],
        ES_REPESCA: Math.random() > 0.9 ? 1 : 0,
        ES_REPESCA_TEXTO: Math.random() > 0.9 ? 'SI' : 'NO',
        ID_TIENDA_PEDIDO: Math.floor(Math.random() * 7) + 1,
        CODIGO_PEDIDO: `CP-${3000 + i}`,
        FECHA_GENERACION_PEDIDO: new Date(opDate.getTime() - 86400000).toISOString(),
        FECHA_FIN_PREPARACION: j === numTraspasos - 1 
          ? new Date(traspasoDate.getTime() + 300000).toISOString()
          : null,
        SKU: `SKU-${Math.floor(Math.random() * 10000).toString().padStart(8, '0')}`,
        DESCRIPCION_ARTICULO: `Artículo ${Math.floor(Math.random() * 100)}`,
        DURACION_OPERACION_MINUTOS: j === numTraspasos - 1 
          ? Math.floor((traspasoDate - opStartDate) / 60000) 
          : null,
        DURACION_OPERACION_SEGUNDOS: j === numTraspasos - 1 
          ? Math.floor((traspasoDate - opStartDate) / 1000)
          : null,
        TIEMPO_ESPERA_INICIO_MINUTOS: Math.floor((opStartDate - opDate) / 60000),
        MINUTOS_DESDE_INICIO_OP: Math.floor((traspasoDate - opStartDate) / 60000),
        SEGUNDOS_DESDE_INICIO_OP: Math.floor((traspasoDate - opStartDate) / 1000),
        MINUTOS_DESDE_TRASPASO_ANTERIOR: j > 0 ? Math.floor(segundosEntreTraspaso / 60) : null,
        SEGUNDOS_DESDE_TRASPASO_ANTERIOR: j > 0 ? Math.floor(segundosEntreTraspaso) : null,
        FECHA_TRASPASO_ANTERIOR: j > 0 ? previousTraspasoDate.toISOString() : null,
        NUM_SECUENCIA_ANTERIOR: j > 0 ? j : null,
        MINUTOS_HASTA_SIGUIENTE_TRASPASO: j < numTraspasos - 1 ? Math.floor(Math.random() * 5) + 1 : null,
        POSICION_TRASPASO: j + 1,
        TOTAL_TRASPASOS_OPERACION: numTraspasos,
        ES_PRIMER_TRASPASO: j === 0 ? 'SI' : 'NO',
        ES_ULTIMO_TRASPASO: j === numTraspasos - 1 ? 'SI' : 'NO',
        PORCENTAJE_COMPLETADO: cantATranspasar > 0 
          ? (cantTraspasada / cantATranspasar * 100).toFixed(2)
          : 0,
        FECHA_OPERACION: opDate.toISOString().split('T')[0],
        A?O: opDate.getFullYear(),
        MES: opDate.getMonth() + 1,
        SEMANA: Math.ceil((opDate.getDate() + new Date(opDate.getFullYear(), 0, 1).getDay()) / 7),
        HORA_TRASPASO: traspasoDate.getHours(),
        DIA_SEMANA: opDate.toLocaleDateString('es-ES', { weekday: 'long' })
      });
      
      previousTraspasoDate = traspasoDate;
    }
  }
  
  return operations;
};