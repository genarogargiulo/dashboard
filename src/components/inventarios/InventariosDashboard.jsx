import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  ComposedChart, ScatterChart, Scatter, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer
} from 'recharts';
import { 
  ClipboardList, Clock, TrendingUp, Users, Package, AlertTriangle,
  CheckCircle, XCircle, BarChart3, Activity, Target, Layers, Eye
} from 'lucide-react';
import KPICard from '../shared/KPICard';
import DateSelector from '../shared/DateSelector';
import LoadingSpinner from '../shared/LoadingSpinner';

// ============= GENERADOR DE DATOS MOCK =============
const generateInventariosData = () => {
  const operarios = ['Juan Perez', 'Maria Garcia', 'Carlos Lopez', 'Ana Martinez', 'Pedro Sanchez', 'Laura Torres'];
  const zonas = ['Zona A', 'Zona B', 'Zona C', 'Zona D', 'Zona E'];
  const categorias = ['Electronica', 'Alimentos', 'Textil', 'Hogar', 'Farmacia'];
  const tiposInventario = ['Ciclico', 'Anual', 'Sorpresa', 'Por Demanda'];
  const dias = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];
  
  // Operaciones de inventario individuales
  const operaciones = [];
  for (let i = 0; i < 100; i++) {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() - Math.floor(Math.random() * 30));
    fecha.setHours(8 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 60));
    
    const itemsContados = Math.floor(Math.random() * 500) + 50;
    const itemsEsperados = itemsContados + Math.floor(Math.random() * 20) - 10;
    const diferencias = Math.abs(itemsContados - itemsEsperados);
    const tiempoTotal = Math.floor(Math.random() * 180) + 30; // 30-210 min
    const itemsPorMinuto = (itemsContados / tiempoTotal).toFixed(2);
    
    const precisionBase = 95 + Math.random() * 5;
    const precision = Math.max(85, Math.min(100, precisionBase - (diferencias / itemsEsperados * 100)));
    
    operaciones.push({
      id: `INV-${2000 + i}`,
      fecha,
      dia: dias[fecha.getDay()],
      hora: fecha.getHours(),
      operario: operarios[Math.floor(Math.random() * operarios.length)],
      zona: zonas[Math.floor(Math.random() * zonas.length)],
      categoria: categorias[Math.floor(Math.random() * categorias.length)],
      tipoInventario: tiposInventario[Math.floor(Math.random() * tiposInventario.length)],
      itemsContados,
      itemsEsperados,
      diferencias,
      tiempoTotal,
      itemsPorMinuto: parseFloat(itemsPorMinuto),
      precision: precision.toFixed(1),
      ubicacionesRevisadas: Math.floor(Math.random() * 50) + 10,
      reconteos: Math.random() > 0.8 ? Math.floor(Math.random() * 3) + 1 : 0,
      estado: diferencias === 0 ? 'Exacto' : diferencias <= 5 ? 'Aceptable' : 'Con Diferencias',
      turno: fecha.getHours() < 14 ? 'Ma?ana' : 'Tarde'
    });
  }
  
  // KPIs Generales
  const totalOperaciones = operaciones.length;
  const itemsTotalesContados = operaciones.reduce((acc, op) => acc + op.itemsContados, 0);
  const diferenciasTotales = operaciones.reduce((acc, op) => acc + op.diferencias, 0);
  const precisionPromedio = (operaciones.reduce((acc, op) => acc + parseFloat(op.precision), 0) / totalOperaciones).toFixed(1);
  const tiempoPromedioTotal = Math.round(operaciones.reduce((acc, op) => acc + op.tiempoTotal, 0) / totalOperaciones);
  
  // Operaciones por día de la semana
  const operacionesPorDia = dias.map(dia => {
    const opsDia = operaciones.filter(op => op.dia === dia);
    return {
      dia,
      cantidad: opsDia.length,
      precision: opsDia.length > 0 ? (opsDia.reduce((acc, op) => acc + parseFloat(op.precision), 0) / opsDia.length).toFixed(1) : 0,
      itemsPromedio: opsDia.length > 0 ? Math.round(opsDia.reduce((acc, op) => acc + op.itemsContados, 0) / opsDia.length) : 0
    };
  });
  
  // Operaciones por hora del día
  const operacionesPorHora = [];
  for (let hora = 8; hora <= 18; hora++) {
    const opsHora = operaciones.filter(op => op.hora === hora);
    operacionesPorHora.push({
      hora: `${hora}:00`,
      cantidad: opsHora.length,
      precision: opsHora.length > 0 ? (opsHora.reduce((acc, op) => acc + parseFloat(op.precision), 0) / opsHora.length).toFixed(1) : 0
    });
  }
  
  // Distribución de precisión
  const distribucionPrecision = [
    { rango: '95-100%', cantidad: operaciones.filter(op => parseFloat(op.precision) >= 95).length, color: '#22c55e' },
    { rango: '90-95%', cantidad: operaciones.filter(op => parseFloat(op.precision) >= 90 && parseFloat(op.precision) < 95).length, color: '#3b82f6' },
    { rango: '85-90%', cantidad: operaciones.filter(op => parseFloat(op.precision) >= 85 && parseFloat(op.precision) < 90).length, color: '#f59e0b' },
    { rango: '< 85%', cantidad: operaciones.filter(op => parseFloat(op.precision) < 85).length, color: '#ef4444' }
  ].filter(d => d.cantidad > 0);
  
  // Distribución por estado
  const distribucionEstado = [
    { estado: 'Exacto', cantidad: operaciones.filter(op => op.estado === 'Exacto').length, color: '#22c55e' },
    { estado: 'Aceptable', cantidad: operaciones.filter(op => op.estado === 'Aceptable').length, color: '#3b82f6' },
    { estado: 'Con Diferencias', cantidad: operaciones.filter(op => op.estado === 'Con Diferencias').length, color: '#ef4444' }
  ].filter(d => d.cantidad > 0);
  
  // Productividad por operario
  const productividadOperarios = operarios.map(operario => {
    const opsOp = operaciones.filter(op => op.operario === operario);
    if (opsOp.length === 0) return null;
    
    return {
      operario,
      operaciones: opsOp.length,
      itemsContados: opsOp.reduce((acc, op) => acc + op.itemsContados, 0),
      precision: (opsOp.reduce((acc, op) => acc + parseFloat(op.precision), 0) / opsOp.length).toFixed(1),
      itemsPorMinuto: (opsOp.reduce((acc, op) => acc + op.itemsPorMinuto, 0) / opsOp.length).toFixed(2),
      tiempoPromedio: Math.round(opsOp.reduce((acc, op) => acc + op.tiempoTotal, 0) / opsOp.length),
      diferencias: opsOp.reduce((acc, op) => acc + op.diferencias, 0),
      reconteos: opsOp.reduce((acc, op) => acc + op.reconteos, 0)
    };
  }).filter(op => op !== null).sort((a, b) => b.operaciones - a.operaciones);
  
  // Análisis por zona
  const analisisZonas = zonas.map(zona => {
    const opsZona = operaciones.filter(op => op.zona === zona);
    return {
      zona,
      operaciones: opsZona.length,
      itemsContados: opsZona.reduce((acc, op) => acc + op.itemsContados, 0),
      precision: opsZona.length > 0 ? (opsZona.reduce((acc, op) => acc + parseFloat(op.precision), 0) / opsZona.length).toFixed(1) : 0,
      tiempoPromedio: opsZona.length > 0 ? Math.round(opsZona.reduce((acc, op) => acc + op.tiempoTotal, 0) / opsZona.length) : 0,
      diferencias: opsZona.reduce((acc, op) => acc + op.diferencias, 0)
    };
  }).sort((a, b) => b.operaciones - a.operaciones);
  
  // Análisis por categoría
  const analisisCategorias = categorias.map(categoria => {
    const opsCat = operaciones.filter(op => op.categoria === categoria);
    return {
      categoria,
      operaciones: opsCat.length,
      precision: opsCat.length > 0 ? (opsCat.reduce((acc, op) => acc + parseFloat(op.precision), 0) / opsCat.length).toFixed(1) : 0,
      diferencias: opsCat.reduce((acc, op) => acc + op.diferencias, 0),
      tasaDiferencias: opsCat.length > 0 ? ((opsCat.filter(op => op.diferencias > 0).length / opsCat.length) * 100).toFixed(1) : 0
    };
  }).filter(c => c.operaciones > 0);
  
  // Análisis por tipo de inventario
  const analisisTipos = tiposInventario.map(tipo => {
    const opsTipo = operaciones.filter(op => op.tipoInventario === tipo);
    return {
      tipo,
      cantidad: opsTipo.length,
      precision: opsTipo.length > 0 ? (opsTipo.reduce((acc, op) => acc + parseFloat(op.precision), 0) / opsTipo.length).toFixed(1) : 0,
      tiempoPromedio: opsTipo.length > 0 ? Math.round(opsTipo.reduce((acc, op) => acc + op.tiempoTotal, 0) / opsTipo.length) : 0
    };
  }).filter(t => t.cantidad > 0);
  
  // Tendencia de precisión en el tiempo
  const tendenciaPrecision = [];
  for (let i = 29; i >= 0; i--) {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() - i);
    const fechaStr = fecha.toISOString().split('T')[0];
    const opsFecha = operaciones.filter(op => op.fecha.toISOString().split('T')[0] === fechaStr);
    
    if (opsFecha.length > 0) {
      tendenciaPrecision.push({
        fecha: `${fecha.getDate()}/${fecha.getMonth() + 1}`,
        precision: (opsFecha.reduce((acc, op) => acc + parseFloat(op.precision), 0) / opsFecha.length).toFixed(1),
        operaciones: opsFecha.length
      });
    }
  }
  
  // Comparación turnos
  const comparacionTurnos = ['Mañana', 'Tarde'].map(turno => {
    const opsTurno = operaciones.filter(op => op.turno === turno);
    return {
      turno,
      operaciones: opsTurno.length,
      precision: opsTurno.length > 0 ? (opsTurno.reduce((acc, op) => acc + parseFloat(op.precision), 0) / opsTurno.length).toFixed(1) : 0,
      itemsPorMinuto: opsTurno.length > 0 ? (opsTurno.reduce((acc, op) => acc + op.itemsPorMinuto, 0) / opsTurno.length).toFixed(2) : 0
    };
  });
  
  // Top diferencias (últimas operaciones con más diferencias)
  const topDiferencias = [...operaciones]
    .sort((a, b) => b.diferencias - a.diferencias)
    .slice(0, 10)
    .map(op => ({
      id: op.id,
      operario: op.operario,
      zona: op.zona,
      categoria: op.categoria,
      itemsContados: op.itemsContados,
      itemsEsperados: op.itemsEsperados,
      diferencias: op.diferencias,
      precision: op.precision,
      fecha: op.fecha.toLocaleDateString()
    }));
  
  // Radar de performance por zona
  const radarZonas = analisisZonas.slice(0, 5).map(zona => ({
    zona: zona.zona,
    Precisión: parseFloat(zona.precision),
    Velocidad: Math.min(100, (zona.itemsContados / zona.operaciones) / 10),
    Volumen: Math.min(100, zona.operaciones * 2)
  }));
  
  // Scatter: Items vs Tiempo
  const scatterData = operaciones.slice(0, 50).map(op => ({
    items: op.itemsContados,
    tiempo: op.tiempoTotal,
    precision: parseFloat(op.precision)
  }));
  
  return {
    operaciones,
    totalOperaciones,
    itemsTotalesContados,
    diferenciasTotales,
    precisionPromedio,
    tiempoPromedioTotal,
    operacionesPorDia,
    operacionesPorHora,
    distribucionPrecision,
    distribucionEstado,
    productividadOperarios,
    analisisZonas,
    analisisCategorias,
    analisisTipos,
    tendenciaPrecision,
    comparacionTurnos,
    topDiferencias,
    radarZonas,
    scatterData
  };
};

// ============= COMPONENTE PRINCIPAL =============
const InventariosDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [startDate, setStartDate] = useState('2025-01-01');
  const [endDate, setEndDate] = useState('2025-01-31');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    setTimeout(() => {
      setData(generateInventariosData());
      setLoading(false);
    }, 500);
  };

  if (loading) {
    return <LoadingSpinner message="Cargando datos de inventarios..." />;
  }

  if (!data) return null;

  const tasaExactitud = ((data.operaciones.filter(op => op.estado === 'Exacto').length / data.totalOperaciones) * 100).toFixed(1);
  const operacionesConReconteo = data.operaciones.filter(op => op.reconteos > 0).length;
  const itemsPromedioMinuto = (data.operaciones.reduce((acc, op) => acc + op.itemsPorMinuto, 0) / data.totalOperaciones).toFixed(2);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <DateSelector
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        onRefresh={loadData}
        onExport={() => console.log('Exportar inventarios')}
        loading={loading}
        dataCount={data.totalOperaciones}
      />

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
        <KPICard
          title="Total Operaciones"
          value={data.totalOperaciones}
          icon={ClipboardList}
          color="blue"
          trend={3.2}
        />
        <KPICard
          title="Precisión Promedio"
          value={`${data.precisionPromedio}%`}
          icon={Target}
          color="green"
          trend={1.5}
        />
        <KPICard
          title="Items Contados"
          value={data.itemsTotalesContados.toLocaleString()}
          icon={Package}
          color="purple"
        />
        <KPICard
          title="Tasa Exactitud"
          value={`${tasaExactitud}%`}
          subtitle={`${data.operaciones.filter(op => op.estado === 'Exacto').length} exactos`}
          icon={CheckCircle}
          color="indigo"
          trend={2.1}
        />
        <KPICard
          title="Items/Minuto"
          value={itemsPromedioMinuto}
          subtitle="Velocidad promedio"
          icon={Activity}
          color="orange"
          trend={1.8}
        />
      </div>

      {/* Row 1: Operaciones por Día y Distribución de Precisión */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Operaciones por Día */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">
            Operaciones y Precisión por Día
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={data.operacionesPorDia}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dia" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" domain={[90, 100]} />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="cantidad" fill="#3b82f6" name="Cantidad" radius={[8, 8, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="precision" stroke="#22c55e" strokeWidth={3} name="Precisión %" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Distribución de Precisión */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">
            Distribución de Precisión
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.distribucionPrecision}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ rango, cantidad }) => `${rango}: ${cantidad}`}
                outerRadius={100}
                dataKey="cantidad"
              >
                {data.distribucionPrecision.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Tendencia de Precisión y Distribución por Estado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Tendencia de Precisión */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
            <TrendingUp className="mr-2 text-green-600" size={24} />
            Tendencia de Precisión (Últimos 30 días)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data.tendenciaPrecision}>
              <defs>
                <linearGradient id="colorPrecision" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" />
              <YAxis domain={[85, 100]} />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="precision" 
                stroke="#22c55e" 
                fillOpacity={1} 
                fill="url(#colorPrecision)"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Distribución por Estado */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">
            Distribución por Estado
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.distribucionEstado}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="estado" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="cantidad" radius={[8, 8, 0, 0]}>
                {data.distribucionEstado.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {data.distribucionEstado.map((estado, i) => (
              <div key={i} className="text-center p-3 rounded-lg" style={{ backgroundColor: `${estado.color}20` }}>
                <p className="text-xs text-gray-600 font-medium">{estado.estado}</p>
                <p className="text-2xl font-bold mt-1" style={{ color: estado.color }}>
                  {estado.cantidad}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {((estado.cantidad / data.totalOperaciones) * 100).toFixed(1)}%
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Análisis por Zona y Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Análisis por Zona */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
            <Layers className="mr-2 text-purple-600" size={24} />
            Análisis por Zona
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.analisisZonas}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="zona" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" domain={[90, 100]} />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="operaciones" fill="#8b5cf6" name="Operaciones" radius={[8, 8, 0, 0]} />
              <Bar yAxisId="right" dataKey="precision" fill="#22c55e" name="Precisión %" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Radar Performance por Zona */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">
            Performance Multidimensional por Zona
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={data.radarZonas}>
              <PolarGrid />
              <PolarAngleAxis dataKey="zona" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar 
                name="Performance" 
                dataKey="Precisión" 
                stroke="#22c55e" 
                fill="#22c55e" 
                fillOpacity={0.6}
                strokeWidth={2}
              />
              <Radar 
                name="Velocidad" 
                dataKey="Velocidad" 
                stroke="#3b82f6" 
                fill="#3b82f6" 
                fillOpacity={0.4}
                strokeWidth={2}
              />
              <Tooltip />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 4: Operaciones por Hora y Comparación Turnos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Operaciones por Hora */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
            <Clock className="mr-2 text-blue-600" size={24} />
            Distribución Horaria
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data.operacionesPorHora}>
              <defs>
                <linearGradient id="colorHora" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hora" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="cantidad" 
                stroke="#3b82f6" 
                fillOpacity={1} 
                fill="url(#colorHora)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Comparación por Turnos */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">
            Comparación por Turno
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.comparacionTurnos}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="turno" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="operaciones" fill="#3b82f6" name="Operaciones" radius={[8, 8, 0, 0]} />
              <Bar dataKey="precision" fill="#22c55e" name="Precisión %" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {data.comparacionTurnos.map((turno, i) => (
              <div key={i} className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                <p className="text-sm text-gray-600 font-medium">{turno.turno}</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{turno.operaciones}</p>
                <div className="mt-2 flex justify-between text-xs">
                  <span className="text-gray-600">Precisión: <span className="font-bold text-green-600">{turno.precision}%</span></span>
                  <span className="text-gray-600">Vel: <span className="font-bold text-orange-600">{turno.itemsPorMinuto}/min</span></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

// CONTINUACIÓN DEL DASHBOARD - Agregar después de Row 4

      {/* Row 5: Análisis por Tipo y Categoría */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Análisis por Tipo de Inventario */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">
            Análisis por Tipo de Inventario
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.analisisTipos} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tipo" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="cantidad" fill="#6366f1" name="Cantidad" radius={[8, 8, 0, 0]} />
              <Bar dataKey="tiempoPromedio" fill="#f59e0b" name="Tiempo Prom. (min)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Análisis por Categoría */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">
            Precisión por Categoría
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.analisisCategorias} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[85, 100]} />
              <YAxis type="category" dataKey="categoria" width={100} />
              <Tooltip />
              <Bar dataKey="precision" fill="#8b5cf6" name="Precisión %" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 6: Productividad por Operario */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
          <Users className="mr-2 text-blue-600" size={24} />
          Ranking de Productividad por Operario
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Operario</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Operaciones</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items Contados</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precisión</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items/Min</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tiempo Prom.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Diferencias</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reconteos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.productividadOperarios.map((op, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                      index === 0 ? 'bg-yellow-100 text-yellow-800' :
                      index === 1 ? 'bg-gray-200 text-gray-800' :
                      index === 2 ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-50 text-blue-800'
                    }`}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">{op.operario}</td>
                  <td className="px-6 py-4 text-gray-900 font-semibold">{op.operaciones}</td>
                  <td className="px-6 py-4 text-gray-500">{op.itemsContados.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 rounded-full ${
                            op.precision >= 95 ? 'bg-green-600' :
                            op.precision >= 90 ? 'bg-blue-600' :
                            'bg-orange-600'
                          }`}
                          style={{width: `${op.precision}%`}}
                        />
                      </div>
                      <span className="text-sm font-medium">{op.precision}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-900 font-medium">{op.itemsPorMinuto}</td>
                  <td className="px-6 py-4 text-gray-500">{op.tiempoPromedio} min</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      op.diferencias === 0 ? 'bg-green-100 text-green-800' :
                      op.diferencias <= 10 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {op.diferencias}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {op.reconteos > 0 ? (
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-semibold">
                        {op.reconteos}
                      </span>
                    ) : (
                      <CheckCircle className="text-green-600 mx-auto" size={20} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row 7: Top 10 Operaciones con Mayores Diferencias */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
          <AlertTriangle className="mr-2 text-red-600" size={24} />
          Top 10 Operaciones con Mayores Diferencias
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Operario</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Zona</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items Contados</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items Esperados</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Diferencias</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precisión</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Severidad</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.topDiferencias.map((op, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-sm text-blue-600 font-medium">{op.id}</td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{op.fecha}</td>
                  <td className="px-6 py-4 text-gray-900">{op.operario}</td>
                  <td className="px-6 py-4 text-gray-500">{op.zona}</td>
                  <td className="px-6 py-4 text-gray-500">{op.categoria}</td>
                  <td className="px-6 py-4 text-gray-900 font-semibold">{op.itemsContados}</td>
                  <td className="px-6 py-4 text-gray-500">{op.itemsEsperados}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                      op.diferencias === 0 ? 'bg-green-100 text-green-800' :
                      op.diferencias <= 5 ? 'bg-yellow-100 text-yellow-800' :
                      op.diferencias <= 15 ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {op.diferencias}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 rounded-full ${
                            op.precision >= 95 ? 'bg-green-600' :
                            op.precision >= 90 ? 'bg-blue-600' :
                            op.precision >= 85 ? 'bg-orange-600' :
                            'bg-red-600'
                          }`}
                          style={{width: `${op.precision}%`}}
                        />
                      </div>
                      <span className="text-sm">{op.precision}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {op.diferencias === 0 ? (
                      <CheckCircle className="text-green-600" size={20} />
                    ) : op.diferencias <= 5 ? (
                      <Eye className="text-yellow-600" size={20} />
                    ) : op.diferencias <= 15 ? (
                      <AlertTriangle className="text-orange-600" size={20} />
                    ) : (
                      <XCircle className="text-red-600" size={20} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row 8: Resumen Estadístico */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <BarChart3 className="text-blue-600" size={32} />
            <span className="text-xs font-semibold text-blue-600 bg-blue-200 px-3 py-1 rounded-full">
              VOLUMEN
            </span>
          </div>
          <h4 className="text-gray-600 text-sm font-medium mb-2">Total Items Procesados</h4>
          <p className="text-4xl font-bold text-blue-600 mb-2">
            {data.itemsTotalesContados.toLocaleString()}
          </p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Promedio por operación:</span>
            <span className="font-bold text-blue-700">
              {Math.round(data.itemsTotalesContados / data.totalOperaciones)}
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <Target className="text-green-600" size={32} />
            <span className="text-xs font-semibold text-green-600 bg-green-200 px-3 py-1 rounded-full">
              CALIDAD
            </span>
          </div>
          <h4 className="text-gray-600 text-sm font-medium mb-2">Diferencias Totales</h4>
          <p className="text-4xl font-bold text-green-600 mb-2">
            {data.diferenciasTotales}
          </p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Tasa de error:</span>
            <span className="font-bold text-green-700">
              {((data.diferenciasTotales / data.itemsTotalesContados) * 100).toFixed(2)}%
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <Clock className="text-orange-600" size={32} />
            <span className="text-xs font-semibold text-orange-600 bg-orange-200 px-3 py-1 rounded-full">
              TIEMPO
            </span>
          </div>
          <h4 className="text-gray-600 text-sm font-medium mb-2">Tiempo Promedio Total</h4>
          <p className="text-4xl font-bold text-orange-600 mb-2">
            {data.tiempoPromedioTotal} min
          </p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Tiempo total invertido:</span>
            <span className="font-bold text-orange-700">
              {Math.round(data.operaciones.reduce((acc, op) => acc + op.tiempoTotal, 0) / 60)} hrs
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventariosDashboard;