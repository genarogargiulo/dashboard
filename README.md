# Dashboard de Picking - Sistema de Análisis en Tiempo Real

Dashboard interactivo desarrollado en React para el análisis y monitoreo de operaciones de picking y traspasos en almacén.

## 🚀 Características

- **Análisis en tiempo real** de operaciones y traspasos
- **Filtros por fecha** flexibles (hoy, últimos 7/30 días, rango personalizado)
- **Múltiples vistas**:
  - Vista General: KPIs y distribuciones
  - Rendimiento: Análisis por secuencias y métricas
  - Operarios: Ranking y desempeño
  - Detalles: Operaciones individuales
- **Visualizaciones interactivas** con gráficos de barras, líneas y circular
- **Exportación a CSV** de todos los datos
- **Responsive design** compatible con móviles y tablets

## 📋 Requisitos Previos

- Node.js 14.x o superior
- npm 6.x o superior (o yarn 1.22+)

## 🛠️ Instalación

1. **Clonar o descargar el proyecto**
```bash
cd picking-dashboard
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno** (opcional)

Crear archivo `.env` en la raíz:
```env
REACT_APP_API_URL=https://tu-api.com/api
```

4. **Iniciar en modo desarrollo**
```bash
npm start
```

La aplicación se abrirá en `http://localhost:3000`

## 📦 Compilar para Producción
```bash
npm run build
```

Los archivos compilados estarán en la carpeta `/build`

## 🔌 Integración con tu API

### Paso 1: Configurar la URL de tu API

En `src/services/api.js`, actualiza la constante:
```javascript
const API_BASE_URL = 'https://tu-api-real.com/api';
```

### Paso 2: Estructura esperada del endpoint

Tu API debe responder en el endpoint `/picking` (POST) con la siguiente estructura:

**Request:**
```json
{
  "fecha_inicio": "2024-01-01T00:00:00.000Z",
  "fecha_fin": "2024-01-07T23:59:59.999Z"
}
```

**Response (array de objetos):**
```json
[
  {
    "ID_OPERACION": "OP-1001",
    "FECHA_CREACION_OPERACION": "2024-01-05T08:30:00.000Z",
    "FECHA_INICIO_OPERACION": "2024-01-05T08:35:00.000Z",
    "FECHA_FIN_OPERACION": "2024-01-05T09:15:00.000Z",
    "USUARIO_OPERACION": "Juan Pérez",
    "TERMINAL": "T-05",
    "NUM_SECUENCIA": 1,
    "FECHA_TRASPASO": "2024-01-05T08:36:30.000Z",
    "DURACION_OPERACION_MINUTOS": 40,
    "SEGUNDOS_DESDE_TRASPASO_ANTERIOR": 90,
    "ES_REPESCA": 0,
    ...
  }
]
```

### Paso 3: Reemplazar datos mock

En `src/components/Dashboard.jsx`, localiza la función `fetchData` y reemplaza:
```javascript
// ANTES (línea ~50)
const mockData = generateMockData(50);
const filtered = mockData.filter(...);

// DESPUÉS
const response = await fetch(`${API_BASE_URL}/picking`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    fecha_inicio: start.toISOString(),
    fecha_fin: end.toISOString()
  })
});
const data = await response.json();
```

## 📊 Campos Utilizados de la Consulta SQL

El dashboard utiliza los siguientes campos de tu consulta SQL:

### Operación
- `ID_OPERACION`
- `FECHA_INICIO_OPERACION`
- `FECHA_FIN_OPERACION`
- `USUARIO_OPERACION`
- `TERMINAL`
- `DURACION_OPERACION_MINUTOS`

### Traspaso
- `NUM_SECUENCIA`
- `FECHA_TRASPASO`
- `SEGUNDOS_DESDE_TRASPASO_ANTERIOR`
- `ES_REPESCA`
- `POSICION_TRASPASO`
- `TOTAL_TRASPASOS_OPERACION`

### Otros
- `DIA_SEMANA`
- `CANT_A_TRASPASAR`
- `CANT_TRASPASADA`

## 🎨 Personalización

### Modificar colores del tema

Edita las clases de Tailwind en los componentes:
- Colores principales: `blue-600`, `green-500`, etc.
- Gradientes: `from-blue-600 to-blue-800`

### Agregar nuevos gráficos

1. Importa el componente de Recharts necesario
2. Crea una función de procesamiento en `src/utils/dataProcessing.js`
3. Agrega el gráfico en el componente Dashboard

### Modificar rangos de fecha predefinidos

En `src/components/Dashboard.jsx`, modifica el array `tabs` y el switch de `dateRange`

## 📁 Estructura del Proyecto