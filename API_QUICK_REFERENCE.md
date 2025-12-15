# Resumen Rápido - Estructuras JSON Mínimas

## 🔐 Login
```
POST /api/auth/login
```
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "user": { "username": "admin", "role": "admin" }
}
```

---

## 📦 PICKING

### 1. Traspasos (Datos crudos)
```
GET /api/picking/traspasos?start_date=2025-10-08&end_date=2025-10-10
```
```json
{
  "success": true,
  "data": [
    {
      "ID_OPERACION": 2692343,
      "USUARIO_OPERACION": "SQUIJANO",
      "DURACION_OPERACION_MINUTOS": 35,
      "ES_REPESCA": 0,
      "TOTAL_TRASPASOS_OPERACION": 25,
      "CANT_A_TRASPASAR": 5,
      "CANT_TRASPASADA": 5,
      "HORA_TRASPASO": 11,
      "DIA_SEMANA": "Friday",
      "ID_SECCION": 3,
      "TERMINAL": 7
    }
  ]
}
```

### 2. KPIs (Pre-calculados)
```
GET /api/picking/kpis?start_date=2025-10-08&end_date=2025-10-10
```
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
    "operarios_activos": 15
  }
}
```

### 3. Performance por Operario
```
GET /api/picking/operarios
```
```json
{
  "success": true,
  "data": [
    {
      "operario": "SQUIJANO",
      "total_traspasos": 445,
      "eficiencia_traspasos_hora": 65,
      "tasa_repescas_porcentaje": 3.2
    }
  ]
}
```

### 4. Por Día de Semana
```
GET /api/picking/por-dia-semana
```
```json
{
  "success": true,
  "data": [
    { "dia": "Lunes", "traspasos": 520, "operaciones": 35 },
    { "dia": "Martes", "traspasos": 485, "operaciones": 32 }
  ]
}
```

### 5. Por Hora del Día
```
GET /api/picking/por-hora
```
```json
{
  "success": true,
  "data": [
    { "hora": 6, "hora_formato": "06:00", "traspasos": 45 },
    { "hora": 7, "hora_formato": "07:00", "traspasos": 185 }
  ]
}
```

### 6. Por Turno
```
GET /api/picking/por-turno
```
```json
{
  "success": true,
  "data": [
    { "turno": "Mañana", "traspasos": 1250, "operaciones": 85 },
    { "turno": "Tarde", "traspasos": 980, "operaciones": 52 }
  ]
}
```

### 7. Por Sección
```
GET /api/picking/por-seccion
```
```json
{
  "success": true,
  "data": [
    { "id_seccion": 1, "traspasos": 680, "tiempo_promedio_minutos": 28.5 }
  ]
}
```

### 8. Distribución de Tiempos
```
GET /api/picking/distribucion-tiempos
```
```json
{
  "success": true,
  "data": [
    { "rango": "0-15 min", "cantidad": 45, "porcentaje": 30.0 },
    { "rango": "15-30 min", "cantidad": 68, "porcentaje": 45.3 }
  ]
}
```

---

## 📊 FILL RATE

### 1. Métricas
```
GET /api/fillrate/metricas
```
```json
{
  "success": true,
  "data": {
    "fill_rate_general": 94.5,
    "fill_rate_lineas": 96.2,
    "total_pedidos": 450,
    "pedidos_completos": 425
  }
}
```

### 2. Por Tienda
```
GET /api/fillrate/por-tienda
```
```json
{
  "success": true,
  "data": [
    {
      "id_tienda": 45,
      "nombre_tienda": "Tienda Centro",
      "fill_rate_porcentaje": 96.5,
      "pedidos_totales": 85
    }
  ]
}
```

### 3. Productos Faltantes
```
GET /api/fillrate/productos-faltantes
```
```json
{
  "success": true,
  "data": [
    {
      "sku": 1234567890,
      "descripcion": "Producto XYZ",
      "veces_faltante": 45,
      "unidades_faltantes": 230
    }
  ]
}
```

---

## 🚚 RECEPCIONES

### 1. Métricas
```
GET /api/recepciones/metricas
```
```json
{
  "success": true,
  "data": {
    "total_camiones": 125,
    "porcentaje_puntualidad": 78.4,
    "tiempo_promedio_descarga_minutos": 45.5,
    "productividad_pallets_hora": 26.5
  }
}
```

### 2. Detalle Camiones
```
GET /api/recepciones/camiones
```
```json
{
  "success": true,
  "data": [
    {
      "id_recepcion": 45678,
      "fecha_hora_llegada": "2025-10-10T08:30:00Z",
      "proveedor": "Proveedor ABC",
      "cantidad_pallets": 22,
      "tiempo_descarga_minutos": 45
    }
  ]
}
```

### 3. Por Proveedor
```
GET /api/recepciones/por-proveedor
```
```json
{
  "success": true,
  "data": [
    {
      "proveedor": "Proveedor ABC",
      "total_recepciones": 45,
      "pallets_totales": 980,
      "puntualidad_porcentaje": 82.2
    }
  ]
}
```

### 4. Por Hora
```
GET /api/recepciones/por-hora
```
```json
{
  "success": true,
  "data": [
    { "hora": 6, "cantidad_camiones": 5, "pallets_totales": 95 }
  ]
}
```

---

## 📋 INVENTARIOS

### 1. Métricas
```
GET /api/inventarios/metricas
```
```json
{
  "success": true,
  "data": {
    "total_operaciones": 85,
    "ubicaciones_contadas": 2450,
    "precision_porcentaje": 98.5,
    "productividad_ubicaciones_hora": 11.7
  }
}
```

### 2. Operaciones
```
GET /api/inventarios/operaciones
```
```json
{
  "success": true,
  "data": [
    {
      "id_operacion": 789,
      "fecha_inicio": "2025-10-10T06:00:00Z",
      "operario": "MGARCIA",
      "ubicaciones_contadas": 150,
      "precision_porcentaje": 98.6
    }
  ]
}
```

### 3. Discrepancias
```
GET /api/inventarios/discrepancias
```
```json
{
  "success": true,
  "data": [
    {
      "sku": 1234567890,
      "cantidad_sistema": 50,
      "cantidad_fisica": 48,
      "diferencia": -2
    }
  ]
}
```

### 4. Por Operario
```
GET /api/inventarios/por-operario
```
```json
{
  "success": true,
  "data": [
    {
      "operario": "MGARCIA",
      "total_operaciones": 18,
      "productividad_ubicaciones_hora": 13.3,
      "precision_promedio": 99.2
    }
  ]
}
```

---

## 📝 CAMPOS MÍNIMOS REQUERIDOS

### Para PICKING funcionar completamente:
```json
{
  "ID_OPERACION": number,
  "USUARIO_OPERACION": string,
  "DURACION_OPERACION_MINUTOS": number,
  "ES_REPESCA": 0 | 1,
  "TOTAL_TRASPASOS_OPERACION": number,
  "CANT_A_TRASPASAR": number,
  "CANT_TRASPASADA": number,
  "HORA_TRASPASO": number (0-23),
  "DIA_SEMANA": string,
  "ID_SECCION": number
}
```

### Headers en todas las peticiones (excepto login):
```
Authorization: Bearer {token}
Content-Type: application/json
```

---

## 🎯 Prioridad de Implementación

### FASE 1 (Crítico):
1. `/api/auth/login` - Login
2. `/api/picking/traspasos` - Datos crudos OR
3. `/api/picking/kpis` - KPIs pre-calculados (recomendado)

### FASE 2 (Importante):
4. `/api/picking/operarios` - Ranking operarios
5. `/api/picking/por-dia-semana` - Gráfico por día
6. `/api/picking/distribucion-tiempos` - Gráfico de tiempos

### FASE 3 (Nice to have):
7. `/api/picking/por-hora` - Distribución horaria
8. `/api/picking/por-turno` - Análisis turnos
9. `/api/picking/por-seccion` - Por sección

---

## 💡 Tip: Modo Desarrollo

Para desarrollo local, puedes usar datos mock hasta que el backend esté listo:

```javascript
const USE_MOCK_DATA = process.env.REACT_APP_USE_MOCK === 'true';

export const pickingAPI = {
  getKPIs: async (startDate, endDate) => {
    if (USE_MOCK_DATA) {
      return mockPickingData; // Datos hardcodeados
    }
    // Llamada real a la API
    const response = await fetch(...);
    return response.json();
  }
};
```
