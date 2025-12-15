# Especificación API - Dashboard TECSIDEL

## 📋 Tabla de Contenidos

1. [Autenticación](#autenticación)
2. [Picking Dashboard](#picking-dashboard)
3. [Fill Rate Dashboard](#fill-rate-dashboard)
4. [Recepciones Dashboard](#recepciones-dashboard)
5. [Inventarios Dashboard](#inventarios-dashboard)
6. [Códigos de Error](#códigos-de-error)

---

## 🔐 Autenticación

### POST `/api/auth/login`

**Request:**
```json
{
  "username": "admin",
  "password": "demo2025"
}
```

**Response (Success):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "nombre_completo": "Administrador Sistema",
    "role": "admin",
    "permisos": ["picking", "fillrate", "recepciones", "inventarios"]
  },
  "expires_in": 3600
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Credenciales inválidas",
  "code": "AUTH_001"
}
```

### POST `/api/auth/logout`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "Sesión cerrada correctamente"
}
```

---

## 📦 PICKING DASHBOARD

### GET `/api/picking/traspasos`

Obtiene todos los traspasos para calcular métricas y gráficos.

**Query Parameters:**
- `start_date` (required): Fecha inicio (YYYY-MM-DD)
- `end_date` (required): Fecha fin (YYYY-MM-DD)
- `operario` (optional): Filtrar por operario
- `seccion` (optional): Filtrar por sección
- `terminal` (optional): Filtrar por terminal

**Request Example:**
```
GET /api/picking/traspasos?start_date=2025-10-08&end_date=2025-10-10
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "ID_OPERACION": 2692343,
      "FECHA_CREACION_OPERACION": "2025-10-10T06:31:42Z",
      "FECHA_INICIO_OPERACION": "2025-10-10T07:00:00Z",
      "FECHA_FIN_OPERACION": "2025-10-10T07:35:00Z",
      "USUARIO_OPERACION": "SQUIJANO",
      "TERMINAL": 7,
      "FECHA_DESBLOQUEO": "2025-10-10T06:45:00Z",
      "FECHA_PRIMERA_CARGA": "2025-10-10T07:02:00Z",
      
      "ID_PEDIDO": 123456,
      "ID_ARTICULO": 78901,
      "CANT_A_TRASPASAR": 5,
      "CANT_TRASPASADA": 5,
      "ETIQUETA_BULTO": "BULK-001",
      "UBICACION_ORIGEN": 1501,
      "ID_TIENDA_DESTINO": 45,
      "NUM_SECUENCIA": 1,
      "FECHA_TRASPASO": "2025-10-10T07:05:00Z",
      "CLASE_STOCK": 1,
      "USUARIO_TRASPASO": "SQUIJANO",
      "ID_SECCION": 3,
      "ES_REPESCA": 0,
      "ES_REPESCA_TEXTO": "NO",
      
      "ID_TIENDA_PEDIDO": 45,
      "CODIGO_PEDIDO": "PED-2025-001",
      "FECHA_GENERACION_PEDIDO": "2025-10-09T14:00:00Z",
      "FECHA_FIN_PREPARACION": "2025-10-10T08:00:00Z",
      
      "NOMBRE_TIENDA": "Tienda Centro",
      "SKU": 1234567890,
      "DESCRIPCION_ARTICULO": "Producto Ejemplo XYZ",
      
      "DURACION_OPERACION_MINUTOS": 35,
      "DURACION_OPERACION_SEGUNDOS": 2100,
      "TIEMPO_ESPERA_INICIO_MINUTOS": 15,
      "MINUTOS_DESDE_INICIO_OP": 5,
      "SEGUNDOS_DESDE_INICIO_OP": 300,
      "MINUTOS_DESDE_TRASPASO_ANTERIOR": 2.5,
      "SEGUNDOS_DESDE_TRASPASO_ANTERIOR": 150,
      "FECHA_TRASPASO_ANTERIOR": "2025-10-10T07:02:30Z",
      "NUM_SECUENCIA_ANTERIOR": 0,
      "MINUTOS_HASTA_SIGUIENTE_TRASPASO": 3.2,
      
      "POSICION_TRASPASO": 1,
      "TOTAL_TRASPASOS_OPERACION": 25,
      "ES_PRIMER_TRASPASO": "SI",
      "ES_ULTIMO_TRASPASO": "NO",
      "PORCENTAJE_COMPLETADO": 100,
      
      "FECHA_OPERACION": "2025-10-10",
      "AÑO": 2025,
      "MES": 10,
      "SEMANA": 41,
      "HORA_TRASPASO": 7,
      "DIA_SEMANA": "Thursday"
    }
    // ... más registros
  ],
  "metadata": {
    "total_registros": 2560,
    "fecha_inicio": "2025-10-08",
    "fecha_fin": "2025-10-10",
    "operaciones_unicas": 150,
    "operarios_activos": 15
  }
}
```

---

### GET `/api/picking/kpis`

Obtiene KPIs calculados (alternativa pre-calculada en backend).

**Query Parameters:**
- `start_date` (required)
- `end_date` (required)

**Response:**
```json
{
  "success": true,
  "data": {
    "total_operaciones": 150,
    "total_traspasos": 2560,
    "tiempo_promedio_minutos": 32.5,
    "eficiencia_traspasos_hora": 55,
    "tasa_cumplimiento_porcentaje": 98.5,
    "total_repescas": 128,
    "tasa_repescas_porcentaje": 5.0,
    "tiempo_espera_promedio_minutos": 12.3,
    "tiempo_entre_traspasos_promedio_minutos": 2.1,
    "operarios_activos": 15
  },
  "trends": {
    "total_operaciones": 5.2,
    "total_traspasos": 3.8,
    "tiempo_promedio": -2.1,
    "eficiencia": 8.5,
    "tasa_repescas": -1.5
  }
}
```

---

### GET `/api/picking/operarios`

Performance detallado por operario.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "operario": "SQUIJANO",
      "total_traspasos": 445,
      "total_operaciones": 35,
      "eficiencia_traspasos_hora": 65,
      "tiempo_promedio_operacion": 28.5,
      "tasa_repescas_porcentaje": 3.2,
      "tasa_cumplimiento_porcentaje": 99.1,
      "traspasos_completados": 441,
      "traspasos_incompletos": 4
    },
    {
      "operario": "TSAPETTO",
      "total_traspasos": 256,
      "total_operaciones": 22,
      "eficiencia_traspasos_hora": 58,
      "tiempo_promedio_operacion": 31.2,
      "tasa_repescas_porcentaje": 4.7,
      "tasa_cumplimiento_porcentaje": 97.8,
      "traspasos_completados": 250,
      "traspasos_incompletos": 6
    }
    // ... más operarios
  ]
}
```

---

### GET `/api/picking/distribucion-tiempos`

Distribución de tiempos de operación.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "rango": "0-15 min",
      "cantidad": 45,
      "porcentaje": 30.0
    },
    {
      "rango": "15-30 min",
      "cantidad": 68,
      "porcentaje": 45.3
    },
    {
      "rango": "30-45 min",
      "cantidad": 28,
      "porcentaje": 18.7
    },
    {
      "rango": "45+ min",
      "cantidad": 9,
      "porcentaje": 6.0
    }
  ]
}
```

---

### GET `/api/picking/por-dia-semana`

Traspasos agrupados por día de la semana.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "dia": "Lunes",
      "dia_numero": 1,
      "traspasos": 520,
      "operaciones": 35,
      "promedio_traspasos_por_operacion": 14.9
    },
    {
      "dia": "Martes",
      "dia_numero": 2,
      "traspasos": 485,
      "operaciones": 32,
      "promedio_traspasos_por_operacion": 15.2
    }
    // ... resto de días
  ]
}
```

---

### GET `/api/picking/por-hora`

Distribución de traspasos por hora del día.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "hora": 6,
      "hora_formato": "06:00",
      "traspasos": 45,
      "operaciones": 3
    },
    {
      "hora": 7,
      "hora_formato": "07:00",
      "traspasos": 185,
      "operaciones": 12
    },
    {
      "hora": 8,
      "hora_formato": "08:00",
      "traspasos": 245,
      "operaciones": 18
    }
    // ... 6:00 a 21:00
  ]
}
```

---

### GET `/api/picking/por-turno`

Análisis por turnos (mañana, tarde, noche).

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "turno": "Mañana",
      "rango_horas": "06:00 - 12:00",
      "traspasos": 1250,
      "operaciones": 85,
      "porcentaje_total": 48.8
    },
    {
      "turno": "Tarde",
      "rango_horas": "12:00 - 18:00",
      "traspasos": 980,
      "operaciones": 52,
      "porcentaje_total": 38.3
    },
    {
      "turno": "Noche",
      "rango_horas": "18:00 - 22:00",
      "traspasos": 330,
      "operaciones": 13,
      "porcentaje_total": 12.9
    }
  ]
}
```

---

### GET `/api/picking/por-seccion`

Performance por sección del almacén.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id_seccion": 1,
      "nombre_seccion": "Sección A",
      "traspasos": 680,
      "operaciones": 45,
      "tiempo_promedio_minutos": 28.5,
      "eficiencia": 62
    },
    {
      "id_seccion": 2,
      "nombre_seccion": "Sección B",
      "traspasos": 520,
      "operaciones": 38,
      "tiempo_promedio_minutos": 31.2,
      "eficiencia": 55
    }
    // ... más secciones
  ]
}
```

---

## 📊 FILL RATE DASHBOARD

### GET `/api/fillrate/metricas`

Métricas de completitud de pedidos.

**Query Parameters:**
- `start_date` (required)
- `end_date` (required)
- `tienda` (optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "fill_rate_general": 94.5,
    "fill_rate_lineas": 96.2,
    "fill_rate_unidades": 93.8,
    "total_pedidos": 450,
    "pedidos_completos": 425,
    "pedidos_incompletos": 25,
    "lineas_totales": 5680,
    "lineas_completas": 5464,
    "lineas_incompletas": 216,
    "unidades_solicitadas": 45000,
    "unidades_servidas": 42210,
    "unidades_faltantes": 2790
  },
  "trends": {
    "fill_rate_general": 2.3,
    "fill_rate_lineas": 1.8,
    "fill_rate_unidades": -0.5
  }
}
```

---

### GET `/api/fillrate/por-tienda`

Fill rate detallado por tienda.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id_tienda": 45,
      "nombre_tienda": "Tienda Centro",
      "fill_rate_porcentaje": 96.5,
      "pedidos_totales": 85,
      "pedidos_completos": 82,
      "lineas_totales": 1250,
      "lineas_completas": 1206,
      "unidades_servidas": 12500,
      "unidades_solicitadas": 12960
    }
    // ... más tiendas
  ]
}
```

---

### GET `/api/fillrate/productos-faltantes`

Top productos con mayores faltantes.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "sku": 1234567890,
      "descripcion": "Producto XYZ",
      "categoria": "Electrónica",
      "veces_faltante": 45,
      "unidades_faltantes": 230,
      "impacto_fill_rate": 2.3,
      "pedidos_afectados": 38
    }
    // ... más productos
  ]
}
```

---

## 🚚 RECEPCIONES DASHBOARD

### GET `/api/recepciones/metricas`

KPIs de recepciones de camiones.

**Query Parameters:**
- `start_date` (required)
- `end_date` (required)

**Response:**
```json
{
  "success": true,
  "data": {
    "total_camiones": 125,
    "camiones_a_tiempo": 98,
    "camiones_tarde": 27,
    "porcentaje_puntualidad": 78.4,
    "tiempo_promedio_descarga_minutos": 45.5,
    "tiempo_promedio_espera_minutos": 12.3,
    "pallets_totales": 2450,
    "pallets_promedio_por_camion": 19.6,
    "productividad_pallets_hora": 26.5
  },
  "trends": {
    "total_camiones": 8.2,
    "puntualidad": 3.5,
    "tiempo_descarga": -5.2,
    "productividad": 12.5
  }
}
```

---

### GET `/api/recepciones/camiones`

Detalle de recepciones por camión.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id_recepcion": 45678,
      "fecha_hora_llegada": "2025-10-10T08:30:00Z",
      "fecha_hora_inicio_descarga": "2025-10-10T08:45:00Z",
      "fecha_hora_fin_descarga": "2025-10-10T09:30:00Z",
      "proveedor": "Proveedor ABC",
      "transportista": "Transporte XYZ",
      "patente_camion": "ABC123",
      "numero_remito": "REM-2025-001",
      "cantidad_pallets": 22,
      "tiempo_espera_minutos": 15,
      "tiempo_descarga_minutos": 45,
      "tiempo_total_minutos": 60,
      "operario_responsable": "JPEREZ",
      "estado": "Completado",
      "observaciones": "Sin novedades"
    }
    // ... más camiones
  ]
}
```

---

### GET `/api/recepciones/por-proveedor`

Performance agrupado por proveedor.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "proveedor": "Proveedor ABC",
      "total_recepciones": 45,
      "pallets_totales": 980,
      "tiempo_promedio_descarga": 42.5,
      "puntualidad_porcentaje": 82.2,
      "recepciones_a_tiempo": 37,
      "recepciones_tarde": 8
    }
    // ... más proveedores
  ]
}
```

---

### GET `/api/recepciones/por-hora`

Distribución de recepciones por hora.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "hora": 6,
      "hora_formato": "06:00",
      "cantidad_camiones": 5,
      "pallets_totales": 95,
      "tiempo_promedio_descarga": 38.5
    },
    {
      "hora": 7,
      "hora_formato": "07:00",
      "cantidad_camiones": 12,
      "pallets_totales": 235,
      "tiempo_promedio_descarga": 42.3
    }
    // ... resto de horas
  ]
}
```

---

## 📋 INVENTARIOS DASHBOARD

### GET `/api/inventarios/metricas`

KPIs de operaciones de inventario.

**Query Parameters:**
- `start_date` (required)
- `end_date` (required)

**Response:**
```json
{
  "success": true,
  "data": {
    "total_operaciones": 85,
    "operaciones_completas": 82,
    "operaciones_incompletas": 3,
    "ubicaciones_contadas": 2450,
    "articulos_contados": 15680,
    "tiempo_promedio_operacion_minutos": 125.5,
    "productividad_ubicaciones_hora": 11.7,
    "precision_porcentaje": 98.5,
    "discrepancias_encontradas": 235,
    "ajustes_realizados": 228,
    "valor_ajustes_usd": 5680.50
  },
  "trends": {
    "operaciones": 5.5,
    "precision": 1.2,
    "productividad": 8.5,
    "discrepancias": -3.5
  }
}
```

---

### GET `/api/inventarios/operaciones`

Detalle de operaciones de inventario.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id_operacion": 789,
      "fecha_inicio": "2025-10-10T06:00:00Z",
      "fecha_fin": "2025-10-10T08:15:00Z",
      "tipo": "Cíclico",
      "zona": "Zona A",
      "operario": "MGARCIA",
      "ubicaciones_asignadas": 150,
      "ubicaciones_contadas": 150,
      "articulos_contados": 850,
      "duracion_minutos": 135,
      "discrepancias": 12,
      "ajustes_realizados": 12,
      "precision_porcentaje": 98.6,
      "estado": "Completado"
    }
    // ... más operaciones
  ]
}
```

---

### GET `/api/inventarios/discrepancias`

Análisis de discrepancias encontradas.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "sku": 1234567890,
      "descripcion": "Producto ABC",
      "ubicacion": "A-01-05-12",
      "cantidad_sistema": 50,
      "cantidad_fisica": 48,
      "diferencia": -2,
      "tipo_diferencia": "Faltante",
      "valor_unitario": 25.50,
      "impacto_valor": -51.00,
      "fecha_deteccion": "2025-10-10T08:30:00Z",
      "estado_ajuste": "Ajustado",
      "operario": "MGARCIA"
    }
    // ... más discrepancias
  ]
}
```

---

### GET `/api/inventarios/por-operario`

Performance de operarios en inventarios.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "operario": "MGARCIA",
      "total_operaciones": 18,
      "ubicaciones_contadas": 520,
      "articulos_contados": 3250,
      "tiempo_total_minutos": 2340,
      "productividad_ubicaciones_hora": 13.3,
      "precision_promedio": 99.2,
      "discrepancias_encontradas": 28
    }
    // ... más operarios
  ]
}
```

---

## ⚠️ Códigos de Error

### Códigos Comunes

```json
{
  "success": false,
  "error": "Mensaje descriptivo del error",
  "code": "ERROR_CODE",
  "details": {}
}
```

| Código | Descripción |
|--------|-------------|
| AUTH_001 | Credenciales inválidas |
| AUTH_002 | Token expirado |
| AUTH_003 | Token inválido |
| AUTH_004 | Sin permisos |
| VAL_001 | Parámetros inválidos |
| VAL_002 | Fecha inválida |
| VAL_003 | Rango de fechas muy amplio (>365 días) |
| DATA_001 | No hay datos para el período |
| DATA_002 | Error al procesar datos |
| SYS_001 | Error interno del servidor |
| SYS_002 | Base de datos no disponible |

---

## 🔧 Headers Requeridos

Todas las peticiones (excepto login) deben incluir:

```
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json
```

---

## 📝 Notas Importantes

### Formatos de Fecha
- Todas las fechas en formato ISO 8601: `2025-10-10T08:30:00Z`
- Query parameters de fechas: `YYYY-MM-DD`

### Paginación (opcional para grandes datasets)
Si implementas paginación, usar:

**Query Parameters:**
- `page`: Número de página (default: 1)
- `page_size`: Registros por página (default: 100, max: 1000)

**Response adicional:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "page_size": 100,
    "total_pages": 26,
    "total_records": 2560,
    "has_next": true,
    "has_previous": false
  }
}
```

### Rate Limiting
- 1000 requests por hora por token
- Headers de respuesta incluyen:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 995
X-RateLimit-Reset: 1633024800
```

---

## 🚀 Ejemplo de Implementación en Frontend

```javascript
// services/api.js
const API_BASE_URL = 'https://api.tudominio.com';

const getAuthHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json'
});

export const pickingAPI = {
  getTraspasos: async (startDate, endDate) => {
    const response = await fetch(
      `${API_BASE_URL}/api/picking/traspasos?start_date=${startDate}&end_date=${endDate}`,
      { headers: getAuthHeaders() }
    );
    return response.json();
  },
  
  getKPIs: async (startDate, endDate) => {
    const response = await fetch(
      `${API_BASE_URL}/api/picking/kpis?start_date=${startDate}&end_date=${endDate}`,
      { headers: getAuthHeaders() }
    );
    return response.json();
  }
};
```

---

**Versión:** 1.0  
**Última actualización:** Diciembre 2025
