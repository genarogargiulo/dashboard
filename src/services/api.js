import { API_URL, CONFIG } from '../config/config';

// Configuración de la API
const API_BASE_URL = API_URL;

/**
 * Obtiene datos de picking filtrados por rango de fechas
 * @param {Date} startDate - Fecha de inicio
 * @param {Date} endDate - Fecha de fin
 * @returns {Promise<Array>} - Array de datos de picking
 */
export const fetchPickingData = async (startDate, endDate) => {
  try {
    const response = await fetch(`${API_BASE_URL}/picking`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fecha_inicio: startDate.toISOString(),
        fecha_fin: endDate.toISOString()
      })
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener datos de picking:', error);
    throw error;
  }
};

/**
 * Exporta datos a CSV
 * @param {Array} data - Datos a exportar
 * @param {string} filename - Nombre del archivo
 */
export const exportToCSV = (data, filename = 'picking_data.csv') => {
  if (!data || data.length === 0) {
    console.warn('No hay datos para exportar');
    return;
  }

  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(row => 
    Object.values(row).map(value => {
      // Manejar valores null o undefined
      if (value === null || value === undefined) return '';
      
      // Escapar comillas y valores con comas
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    }).join(',')
  );

  const csv = [headers, ...rows].join('\n');
  
  // Agregar BOM para que Excel reconozca UTF-8
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Configuración de la API para diferentes entornos
 */
export const config = {
  apiUrl: API_BASE_URL,
  timeout: 30000, // 30 segundos
  headers: {
    'Content-Type': 'application/json',
  }
};

export default {
  fetchPickingData,
  exportToCSV,
  config
};