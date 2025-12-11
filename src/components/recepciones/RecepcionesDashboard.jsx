import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, ComposedChart
} from 'recharts';
import { 
  Truck, Clock, TrendingUp, Users, Package, AlertTriangle, 
  Activity, Timer, CheckCircle, XCircle
} from 'lucide-react';
import KPICard from '../shared/KPICard';
import DateSelector from '../shared/DateSelector';
import LoadingSpinner from '../shared/LoadingSpinner';

// ============= GENERADOR DE DATOS MOCK =============
const generateRecepcionesData = () => {
  const proveedores = ['Proveedor A', 'Proveedor B', 'Proveedor C', 'Proveedor D', 'Proveedor E'];
  const operarios = ['Juan Pérez', 'María García', 'Carlos López', 'Ana Martínez', 'Pedro Sánchez'];
  const tiposCarga = ['Paletizado', 'Granel', 'Mixto', 'Cajas'];
  const dias = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  
  // Recepciones individuales (últimas 50)
  const recepciones = [];
  for (let i = 0; i < 50; i++) {
    const llegada = new Date();
    llegada.setDate(llegada.getDate() - Math.floor(Math.random() * 30));
    llegada.setHours(6 + Math.floor(Math.random() * 12), Math.floor(Math.random() * 60));
    
    const tiempoEspera = Math.floor(Math.random() * 45) + 5; // 5-50 min
    const tiempoDescarga = Math.floor(Math.random() * 120) + 30; // 30-150 min
    const tiempoValidacion = Math.floor(Math.random() * 30) + 10; // 10-40 min
    const tiempoTotal = tiempoEspera + tiempoDescarga + tiempoValidacion;
    
    const cantidadItems = Math.floor(Math.random() * 500) + 100;
    const itemsPorMinuto = (cantidadItems / tiempoDescarga).toFixed(2);
    
    recepciones.push({
      id: `REC-${1000 + i}`,
      proveedor: proveedores[Math.floor(Math.random() * proveedores.length)],
      operario: operarios[Math.floor(Math.random() * operarios.length)],
      tipoCarga: tiposCarga[Math.floor(Math.random() * tiposCarga.length)],
      fechaLlegada: llegada,
      horaLlegada: llegada.getHours(),
      diaSemana: dias[llegada.getDay()],
      tiempoEspera,
      tiempoDescarga,
      tiempoValidacion,
      tiempoTotal,
      cantidadItems,
      cantidadPallets: Math.floor(Math.random() * 30) + 5,
      itemsPorMinuto: parseFloat(itemsPorMinuto),
      estadoFinal: Math.random() > 0.95 ? 'Incidencia' : 'Completo',
      incidencias: Math.random() > 0.95 ? Math.floor(Math.random() * 3) + 1 : 0
    });
  }
  
  // Recepciones por día de la semana
  const recepcionesPorDia = dias.map(dia => {
    const recDia = recepciones.filter(r => r.diaSemana === dia);
    return {
      dia,
      cantidad: recDia.length,
      tiempoPromedio: recDia.length > 0 
        ? Math.round(recDia.reduce((acc, r) => acc + r.tiempoTotal, 0) / recDia.length)
        : 0
    };
  });
  
  // Recepciones por hora del día
  const recepcionesPorHora = [];
  for (let hora = 6; hora <= 18; hora++) {
    const recHora = recepciones.filter(r => r.horaLlegada === hora);
    recepcionesPorHora.push({
      hora: `${hora}:00`,
      cantidad: recHora.length,
      tiempoPromedio: recHora.length > 0 
        ? Math.round(recHora.reduce((acc, r) => acc + r.tiempoTotal, 0) / recHora.length)
        : 0
    });
  }
  
  // Distribución de tiempos
  const distribucionTiempos = [
    { 
      rango: '< 60 min', 
      cantidad: recepciones.filter(r => r.tiempoTotal < 60).length,
      color: '#22c55e'
    },
    { 
      rango: '60-120 min', 
      cantidad: recepciones.filter(r => r.tiempoTotal >= 60 && r.tiempoTotal < 120).length,
      color: '#3b82f6'
    },
    { 
      rango: '120-180 min', 
      cantidad: recepciones.filter(r => r.tiempoTotal >= 120 && r.tiempoTotal < 180).length,
      color: '#f59e0b'
    },
    { 
      rango: '> 180 min', 
      cantidad: recepciones.filter(r => r.tiempoTotal >= 180).length,
      color: '#ef4444'
    }
  ];
  
  // Desglose de tiempos promedio
  const desgloseTiempos = [
    {
      etapa: 'Espera',
      tiempo: Math.round(recepciones.reduce((acc, r) => acc + r.tiempoEspera, 0) / recepciones.length),
      color: '#ef4444'
    },
    {
      etapa: 'Descarga',
      tiempo: Math.round(recepciones.reduce((acc, r) => acc + r.tiempoDescarga, 0) / recepciones.length),
      color: '#3b82f6'
    },
    {
      etapa: 'Validación',
      tiempo: Math.round(recepciones.reduce((acc, r) => acc + r.tiempoValidacion, 0) / recepciones.length),
      color: '#f59e0b'
    }
  ];
  
  // Productividad por operario
  const productividadOperarios = operarios.map(operario => {
    const recOp = recepciones.filter(r => r.operario === operario);
    return {
      operario,
      recepciones: recOp.length,
      tiempoPromedio: recOp.length > 0 
        ? Math.round(recOp.reduce((acc, r) => acc + r.tiempoTotal, 0) / recOp.length)
        : 0,
      itemsPorMinuto: recOp.length > 0
        ? (recOp.reduce((acc, r) => acc + r.itemsPorMinuto, 0) / recOp.length).toFixed(2)
        : 0,
      eficiencia: Math.floor(85 + Math.random() * 15)
    };
  }).sort((a, b) => b.recepciones - a.recepciones);
  
  // Análisis por proveedor
  const analisisProveedores = proveedores.map(proveedor => {
    const recProv = recepciones.filter(r => r.proveedor === proveedor);
    return {
      proveedor,
      recepciones: recProv.length,
      tiempoPromedio: recProv.length > 0 
        ? Math.round(recProv.reduce((acc, r) => acc + r.tiempoTotal, 0) / recProv.length)
        : 0,
      incidencias: recProv.reduce((acc, r) => acc + r.incidencias, 0),
      tasaIncidencias: recProv.length > 0
        ? ((recProv.filter(r => r.estadoFinal === 'Incidencia').length / recProv.length) * 100).toFixed(1)
        : 0
    };
  }).sort((a, b) => b.recepciones - a.recepciones);
  
  // Comparación tipo de carga
  const comparacionTipoCarga = tiposCarga.map(tipo => {
    const recTipo = recepciones.filter(r => r.tipoCarga === tipo);
    return {
      tipo,
      cantidad: recTipo.length,
      tiempoPromedio: recTipo.length > 0 
        ? Math.round(recTipo.reduce((acc, r) => acc + r.tiempoTotal, 0) / recTipo.length)
        : 0,
      itemsPorMinuto: recTipo.length > 0
        ? (recTipo.reduce((acc, r) => acc + r.itemsPorMinuto, 0) / recTipo.length).toFixed(2)
        : 0
    };
  }).filter(t => t.cantidad > 0);
  
  // Scatter: Items vs Tiempo
  const scatterData = recepciones.slice(0, 30).map(r => ({
    items: r.cantidadItems,
    tiempo: r.tiempoDescarga,
    tipo: r.tipoCarga
  }));
  
  return {
    recepciones,
    recepcionesPorDia,
    recepcionesPorHora,
    distribucionTiempos,
    desgloseTiempos,
    productividadOperarios,
    analisisProveedores,
    comparacionTipoCarga,
    scatterData
  };
};

// ============= COMPONENTE PRINCIPAL =============
const RecepcionesDashboard = () => {
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
      setData(generateRecepcionesData());
      setLoading(false);
    }, 500);
  };

  if (loading) {
    return <LoadingSpinner message="Cargando datos de recepciones..." />;
  }

  if (!data) return null;

  // Calcular KPIs
  const totalRecepciones = data.recepciones.length;
  const tiempoPromedioTotal = Math.round(
    data.recepciones.reduce((acc, r) => acc + r.tiempoTotal, 0) / totalRecepciones
  );
  const itemsPromedioMinuto = (
    data.recepciones.reduce((acc, r) => acc + r.itemsPorMinuto, 0) / totalRecepciones
  ).toFixed(2);
  const recepcionesConIncidencias = data.recepciones.filter(r => r.estadoFinal === 'Incidencia').length;
  const tasaIncidencias = ((recepcionesConIncidencias / totalRecepciones) * 100).toFixed(1);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <DateSelector
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        onRefresh={loadData}
        onExport={() => console.log('Exportar recepciones')}
        loading={loading}
        dataCount={totalRecepciones}
      />

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <KPICard
          title="Total Recepciones"
          value={totalRecepciones}
          icon={Truck}
          color="blue"
          trend={5.2}
        />
        <KPICard
          title="Tiempo Promedio"
          value={`${tiempoPromedioTotal} min`}
          subtitle="Tiempo total de recepción"
          icon={Clock}
          color="orange"
          trend={-3.1}
        />
        <KPICard
          title="Items por Minuto"
          value={itemsPromedioMinuto}
          subtitle="Velocidad de descarga"
          icon={Activity}
          color="green"
          trend={2.8}
        />
        <KPICard
          title="Tasa de Incidencias"
          value={`${tasaIncidencias}%`}
          subtitle={`${recepcionesConIncidencias} con problemas`}
          icon={AlertTriangle}
          color="red"
          trend={-1.2}
        />
      </div>

      {/* Row 1: Recepciones por Día y Distribución */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Recepciones por Día */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">
            Recepciones por Día de la Semana
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={data.recepcionesPorDia}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dia" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="cantidad" fill="#3b82f6" name="Cantidad" radius={[8, 8, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="tiempoPromedio" stroke="#f59e0b" strokeWidth={3} name="Tiempo Prom. (min)" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Distribución de Tiempos */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">
            Distribución de Tiempos de Recepción
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.distribucionTiempos}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ rango, cantidad }) => `${rango}: ${cantidad}`}
                outerRadius={100}
                dataKey="cantidad"
              >
                {data.distribucionTiempos.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Desglose de Tiempos y Recepciones por Hora */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Desglose de Tiempos Promedio */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
            <Timer className="mr-2 text-orange-600" size={24} />
            Desglose de Tiempos por Etapa
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.desgloseTiempos} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="etapa" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="tiempo" radius={[8, 8, 0, 0]} name="Minutos">
                {data.desgloseTiempos.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
            {data.desgloseTiempos.map((etapa, i) => (
              <div key={i} className="text-center p-2 bg-gray-50 rounded">
                <p className="text-gray-600 font-medium">{etapa.etapa}</p>
                <p className="text-2xl font-bold" style={{ color: etapa.color }}>
                  {etapa.tiempo} min
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recepciones por Hora */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">
            Recepciones por Hora del Día
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data.recepcionesPorHora}>
              <defs>
                <linearGradient id="colorRecepciones" x1="0" y1="0" x2="0" y2="1">
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
                fill="url(#colorRecepciones)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 3: Comparación por Tipo de Carga */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
          <Package className="mr-2 text-purple-600" size={24} />
          Comparación por Tipo de Carga
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.comparacionTipoCarga}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="tipo" />
            <YAxis yAxisId="left" label={{ value: 'Tiempo (min)', angle: -90, position: 'insideLeft' }} />
            <YAxis yAxisId="right" orientation="right" label={{ value: 'Items/min', angle: 90, position: 'insideRight' }} />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="tiempoPromedio" fill="#8b5cf6" name="Tiempo Promedio" radius={[8, 8, 0, 0]} />
            <Bar yAxisId="right" dataKey="itemsPorMinuto" fill="#22c55e" name="Items por Minuto" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Row 4: Productividad por Operario */}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recepciones</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tiempo Promedio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items/Min</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Eficiencia</th>
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
                  <td className="px-6 py-4 text-gray-900 font-semibold">{op.recepciones}</td>
                  <td className="px-6 py-4 text-gray-500">{op.tiempoPromedio} min</td>
                  <td className="px-6 py-4 text-gray-900 font-medium">{op.itemsPorMinuto}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 rounded-full ${
                            op.eficiencia >= 95 ? 'bg-green-600' :
                            op.eficiencia >= 90 ? 'bg-blue-600' :
                            'bg-orange-600'
                          }`}
                          style={{width: `${op.eficiencia}%`}}
                        />
                      </div>
                      <span className="text-sm font-medium">{op.eficiencia}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row 5: Análisis por Proveedor */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">
          Análisis por Proveedor
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proveedor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recepciones</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tiempo Promedio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Incidencias</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tasa Incidencias</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.analisisProveedores.map((prov, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{prov.proveedor}</td>
                  <td className="px-6 py-4 text-gray-900">{prov.recepciones}</td>
                  <td className="px-6 py-4 text-gray-500">{prov.tiempoPromedio} min</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      prov.incidencias === 0 ? 'bg-green-100 text-green-800' :
                      prov.incidencias <= 2 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {prov.incidencias}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 rounded-full ${
                            prov.tasaIncidencias < 5 ? 'bg-green-600' :
                            prov.tasaIncidencias < 10 ? 'bg-yellow-600' :
                            'bg-red-600'
                          }`}
                          style={{width: `${Math.min(prov.tasaIncidencias, 100)}%`}}
                        />
                      </div>
                      <span className="text-sm font-medium">{prov.tasaIncidencias}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {prov.tasaIncidencias < 5 ? (
                      <CheckCircle className="text-green-600" size={20} />
                    ) : prov.tasaIncidencias < 10 ? (
                      <AlertTriangle className="text-yellow-600" size={20} />
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
    </div>
  );
};

export default RecepcionesDashboard;