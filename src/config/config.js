/**
 * Configuración general de la aplicación
 * 
 * Para diferentes entornos:
 * - Desarrollo: Modifica directamente API_URL aquí
 * - Producción: Crea archivo .env con REACT_APP_API_URL
 */

// URL de tu API - Cambia esto por la URL real de tu backend
export const API_URL = window.REACT_APP_API_URL || 'http://localhost:3001/api';
//export const API_URL = 'http://localhost:3001/api';

// Otras configuraciones
export const CONFIG = {
  // Timeout para peticiones HTTP (en milisegundos)
  REQUEST_TIMEOUT: 30000,
  
  // Número de registros por página en tablas
  ITEMS_PER_PAGE: 10,
  
  // Rangos de fecha predefinidos (en días)
  DATE_RANGES: {
    TODAY: 0,
    LAST_7_DAYS: 7,
    LAST_30_DAYS: 30,
  },
  
  // Configuración de gráficos
  CHART_COLORS: {
    PRIMARY: '#3b82f6',
    SECONDARY: '#22c55e',
    WARNING: '#f59e0b',
    DANGER: '#ef4444',
    INFO: '#8b5cf6',
  },
  
  // Formato de fecha
  DATE_FORMAT: 'DD/MM/YYYY',
  DATETIME_FORMAT: 'DD/MM/YYYY HH:mm',
};

export default CONFIG;