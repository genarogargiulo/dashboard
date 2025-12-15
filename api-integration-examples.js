// ============================================
// ARCHIVO: src/services/api.js
// ============================================

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.tudominio.com';

// Función helper para headers
const getAuthHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json',
  'Accept': 'application/json'
});

// Función helper para manejar errores
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error en la petición');
  }
  return response.json();
};

// ============================================
// AUTENTICACIÓN
// ============================================

export const authAPI = {
  login: async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
    return handleResponse(response);
  },

  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// ============================================
// PICKING API
// ============================================

export const pickingAPI = {
  // Obtener todos los traspasos
  getTraspasos: async (startDate, endDate, filters = {}) => {
    const params = new URLSearchParams({
      start_date: startDate,
      end_date: endDate,
      ...filters
    });
    
    const response = await fetch(
      `${API_BASE_URL}/api/picking/traspasos?${params}`,
      { headers: getAuthHeaders() }
    );
    return handleResponse(response);
  },

  // Obtener KPIs calculados
  getKPIs: async (startDate, endDate) => {
    const response = await fetch(
      `${API_BASE_URL}/api/picking/kpis?start_date=${startDate}&end_date=${endDate}`,
      { headers: getAuthHeaders() }
    );
    return handleResponse(response);
  },

  // Obtener performance de operarios
  getOperarios: async (startDate, endDate) => {
    const response = await fetch(
      `${API_BASE_URL}/api/picking/operarios?start_date=${startDate}&end_date=${endDate}`,
      { headers: getAuthHeaders() }
    );
    return handleResponse(response);
  },

  // Distribución de tiempos
  getDistribucionTiempos: async (startDate, endDate) => {
    const response = await fetch(
      `${API_BASE_URL}/api/picking/distribucion-tiempos?start_date=${startDate}&end_date=${endDate}`,
      { headers: getAuthHeaders() }
    );
    return handleResponse(response);
  },

  // Por día de la semana
  getPorDiaSemana: async (startDate, endDate) => {
    const response = await fetch(
      `${API_BASE_URL}/api/picking/por-dia-semana?start_date=${startDate}&end_date=${endDate}`,
      { headers: getAuthHeaders() }
    );
    return handleResponse(response);
  },

  // Por hora del día
  getPorHora: async (startDate, endDate) => {
    const response = await fetch(
      `${API_BASE_URL}/api/picking/por-hora?start_date=${startDate}&end_date=${endDate}`,
      { headers: getAuthHeaders() }
    );
    return handleResponse(response);
  },

  // Por turno
  getPorTurno: async (startDate, endDate) => {
    const response = await fetch(
      `${API_BASE_URL}/api/picking/por-turno?start_date=${startDate}&end_date=${endDate}`,
      { headers: getAuthHeaders() }
    );
    return handleResponse(response);
  },

  // Por sección
  getPorSeccion: async (startDate, endDate) => {
    const response = await fetch(
      `${API_BASE_URL}/api/picking/por-seccion?start_date=${startDate}&end_date=${endDate}`,
      { headers: getAuthHeaders() }
    );
    return handleResponse(response);
  }
};

// ============================================
// FILL RATE API
// ============================================

export const fillRateAPI = {
  getMetricas: async (startDate, endDate, tienda = null) => {
    const params = new URLSearchParams({ start_date: startDate, end_date: endDate });
    if (tienda) params.append('tienda', tienda);
    
    const response = await fetch(
      `${API_BASE_URL}/api/fillrate/metricas?${params}`,
      { headers: getAuthHeaders() }
    );
    return handleResponse(response);
  },

  getPorTienda: async (startDate, endDate) => {
    const response = await fetch(
      `${API_BASE_URL}/api/fillrate/por-tienda?start_date=${startDate}&end_date=${endDate}`,
      { headers: getAuthHeaders() }
    );
    return handleResponse(response);
  },

  getProductosFaltantes: async (startDate, endDate) => {
    const response = await fetch(
      `${API_BASE_URL}/api/fillrate/productos-faltantes?start_date=${startDate}&end_date=${endDate}`,
      { headers: getAuthHeaders() }
    );
    return handleResponse(response);
  }
};

// ============================================
// RECEPCIONES API
// ============================================

export const recepcionesAPI = {
  getMetricas: async (startDate, endDate) => {
    const response = await fetch(
      `${API_BASE_URL}/api/recepciones/metricas?start_date=${startDate}&end_date=${endDate}`,
      { headers: getAuthHeaders() }
    );
    return handleResponse(response);
  },

  getCamiones: async (startDate, endDate) => {
    const response = await fetch(
      `${API_BASE_URL}/api/recepciones/camiones?start_date=${startDate}&end_date=${endDate}`,
      { headers: getAuthHeaders() }
    );
    return handleResponse(response);
  },

  getPorProveedor: async (startDate, endDate) => {
    const response = await fetch(
      `${API_BASE_URL}/api/recepciones/por-proveedor?start_date=${startDate}&end_date=${endDate}`,
      { headers: getAuthHeaders() }
    );
    return handleResponse(response);
  },

  getPorHora: async (startDate, endDate) => {
    const response = await fetch(
      `${API_BASE_URL}/api/recepciones/por-hora?start_date=${startDate}&end_date=${endDate}`,
      { headers: getAuthHeaders() }
    );
    return handleResponse(response);
  }
};

// ============================================
// INVENTARIOS API
// ============================================

export const inventariosAPI = {
  getMetricas: async (startDate, endDate) => {
    const response = await fetch(
      `${API_BASE_URL}/api/inventarios/metricas?start_date=${startDate}&end_date=${endDate}`,
      { headers: getAuthHeaders() }
    );
    return handleResponse(response);
  },

  getOperaciones: async (startDate, endDate) => {
    const response = await fetch(
      `${API_BASE_URL}/api/inventarios/operaciones?start_date=${startDate}&end_date=${endDate}`,
      { headers: getAuthHeaders() }
    );
    return handleResponse(response);
  },

  getDiscrepancias: async (startDate, endDate) => {
    const response = await fetch(
      `${API_BASE_URL}/api/inventarios/discrepancias?start_date=${startDate}&end_date=${endDate}`,
      { headers: getAuthHeaders() }
    );
    return handleResponse(response);
  },

  getPorOperario: async (startDate, endDate) => {
    const response = await fetch(
      `${API_BASE_URL}/api/inventarios/por-operario?start_date=${startDate}&end_date=${endDate}`,
      { headers: getAuthHeaders() }
    );
    return handleResponse(response);
  }
};


// ============================================
// EJEMPLO DE USO EN COMPONENTE REACT
// ============================================

/*
// PickingDashboard.jsx

import React, { useState, useEffect } from 'react';
import { pickingAPI } from '../../services/api';
import LoadingSpinner from '../shared/LoadingSpinner';

const PickingDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [kpis, setKpis] = useState(null);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('2025-10-08');
  const [endDate, setEndDate] = useState('2025-10-10');

  // Cargar datos al montar el componente
  useEffect(() => {
    loadData();
  }, [startDate, endDate]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Opción 1: Cargar traspasos y calcular en frontend
      const traspasosResponse = await pickingAPI.getTraspasos(startDate, endDate);
      setData(traspasosResponse.data);
      
      // Opción 2: O cargar KPIs pre-calculados del backend (más eficiente)
      const kpisResponse = await pickingAPI.getKPIs(startDate, endDate);
      setKpis(kpisResponse.data);
      
    } catch (err) {
      console.error('Error cargando datos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Cargando datos de picking..." />;
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800">Error: {error}</p>
        <button 
          onClick={loadData}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      {// Renderizar KPIs y gráficos}
      <KPICard value={kpis?.total_operaciones} title="Total Operaciones" />
      {// ... resto del dashboard}
    </div>
  );
};

export default PickingDashboard;
*/


// ============================================
// EJEMPLO CON MÚLTIPLES LLAMADAS PARALELAS
// ============================================

/*
const loadAllData = async () => {
  setLoading(true);
  
  try {
    // Hacer todas las llamadas en paralelo para mejor performance
    const [
      kpisData,
      operariosData,
      distribucionData,
      porDiaData,
      porHoraData,
      porTurnoData,
      porSeccionData
    ] = await Promise.all([
      pickingAPI.getKPIs(startDate, endDate),
      pickingAPI.getOperarios(startDate, endDate),
      pickingAPI.getDistribucionTiempos(startDate, endDate),
      pickingAPI.getPorDiaSemana(startDate, endDate),
      pickingAPI.getPorHora(startDate, endDate),
      pickingAPI.getPorTurno(startDate, endDate),
      pickingAPI.getPorSeccion(startDate, endDate)
    ]);
    
    // Actualizar estados
    setKpis(kpisData.data);
    setOperarios(operariosData.data);
    setDistribucionTiempos(distribucionData.data);
    setPorDia(porDiaData.data);
    setPorHora(porHoraData.data);
    setPorTurno(porTurnoData.data);
    setPorSeccion(porSeccionData.data);
    
  } catch (error) {
    console.error('Error:', error);
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
*/


// ============================================
// EJEMPLO CON CUSTOM HOOK
// ============================================

/*
// hooks/usePickingData.js

import { useState, useEffect } from 'react';
import { pickingAPI } from '../services/api';

export const usePickingData = (startDate, endDate) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await pickingAPI.getKPIs(startDate, endDate);
        setData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  return { data, loading, error };
};

// Uso en componente:
// const { data: kpis, loading, error } = usePickingData(startDate, endDate);
*/


// ============================================
// EJEMPLO CON MANEJO DE TOKEN EXPIRADO
// ============================================

/*
const handleResponse = async (response) => {
  if (response.status === 401) {
    // Token expirado, redirigir a login
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw new Error('Sesión expirada');
  }
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error en la petición');
  }
  
  return response.json();
};
*/


// ============================================
// EJEMPLO CON RETRY EN CASO DE ERROR
// ============================================

/*
const fetchWithRetry = async (fetchFn, maxRetries = 3) => {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fetchFn();
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        // Esperar antes de reintentar (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
      }
    }
  }
  
  throw lastError;
};

// Uso:
const data = await fetchWithRetry(() => pickingAPI.getKPIs(startDate, endDate));
*/
