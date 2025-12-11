import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { TrendingUp, CheckCircle, Package, AlertTriangle, Store } from 'lucide-react';
import KPICard from '../shared/KPICard';
import DateSelector from '../shared/DateSelector';
import LoadingSpinner from '../shared/LoadingSpinner';

// Mock data generator
const generateFillRateData = () => {
  const tiendas = ['Tienda A', 'Tienda B', 'Tienda C', 'Tienda D', 'Tienda E'];
  const dias = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  
  const datosPorTienda = tiendas.map(tienda => {
    const itemsSolicitados = Math.floor(Math.random() * 2000) + 1000;
    const itemsEntregados = Math.floor(Math.random() * (itemsSolicitados * 0.2)) + itemsSolicitados * 0.8;
    
    return {
      tienda,
      pedidosCompletos: Math.floor(Math.random() * 100) + 50,
      pedidosIncompletos: Math.floor(Math.random() * 30) + 5,
      itemsSolicitados,
      itemsEntregados,
      fillRate: ((itemsEntregados / itemsSolicitados) * 100).toFixed(1)
    };
  });
  
  datosPorTienda.forEach(d => {
    d.totalPedidos = d.pedidosCompletos + d.pedidosIncompletos;
  });

  const tendenciaSemanal = dias.map(dia => ({
    dia,
    fillRate: (85 + Math.random() * 12).toFixed(1),
    pedidos: Math.floor(Math.random() * 50) + 30
  }));

  const categorias = [
    { categoria: 'Alimentos', faltantes: 45, color: '#ef4444' },
    { categoria: 'Bebidas', faltantes: 30, color: '#f59e0b' },
    { categoria: 'Limpieza', faltantes: 15, color: '#3b82f6' },
    { categoria: 'Cuidado Personal', faltantes: 25, color: '#8b5cf6' },
    { categoria: 'Otros', faltantes: 20, color: '#10b981' }
  ];

  const distribucionCompletitud = [
    { rango: '100%', cantidad: 120, color: '#22c55e' },
    { rango: '90-99%', cantidad: 45, color: '#3b82f6' },
    { rango: '80-89%', cantidad: 25, color: '#f59e0b' },
    { rango: '<80%', cantidad: 10, color: '#ef4444' }
  ];

  const topFaltantes = [
    { producto: 'Producto A', sku: 'SKU001', faltantes: 45, frecuencia: 89 },
    { producto: 'Producto B', sku: 'SKU002', faltantes: 38, frecuencia: 76 },
    { producto: 'Producto C', sku: 'SKU003', faltantes: 32, frecuencia: 68 },
    { producto: 'Producto D', sku: 'SKU004', faltantes: 28, frecuencia: 54 },
    { producto: 'Producto E', sku: 'SKU005', faltantes: 22, frecuencia: 45 }
  ];

  return { datosPorTienda, tendenciaSemanal, categorias, distribucionCompletitud, topFaltantes };
};

const FillRateDashboard = () => {
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
      setData(generateFillRateData());
      setLoading(false);
    }, 500);
  };

  if (loading) {
    return <LoadingSpinner message="Cargando datos de fill rate..." />;
  }

  if (!data) return null;

  const fillRatePromedio = (
    data.datosPorTienda.reduce((acc, t) => acc + parseFloat(t.fillRate), 0) / 
    data.datosPorTienda.length
  ).toFixed(1);

  const totalPedidos = data.datosPorTienda.reduce((acc, t) => acc + t.totalPedidos, 0);
  const pedidosCompletos = data.datosPorTienda.reduce((acc, t) => acc + t.pedidosCompletos, 0);
  const totalFaltantes = data.categorias.reduce((acc, c) => acc + c.faltantes, 0);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <DateSelector
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        onRefresh={loadData}
        onExport={() => console.log('Exportar fill rate')}
        loading={loading}
        dataCount={totalPedidos}
      />

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <KPICard
          title="Fill Rate Promedio"
          value={`${fillRatePromedio}%`}
          icon={TrendingUp}
          color="purple"
          trend={2.3}
        />
        <KPICard
          title="Pedidos Completos"
          value={pedidosCompletos}
          subtitle={`${((pedidosCompletos/totalPedidos)*100).toFixed(1)}% del total`}
          icon={CheckCircle}
          color="green"
          trend={1.8}
        />
        <KPICard
          title="Total Pedidos"
          value={totalPedidos}
          subtitle={`${totalPedidos - pedidosCompletos} incompletos`}
          icon={Package}
          color="blue"
        />
        <KPICard
          title="Items Faltantes"
          value={totalFaltantes}
          subtitle="En todas las categorías"
          icon={AlertTriangle}
          color="orange"
          trend={-1.5}
        />
      </div>

      {/* Gráficos principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Tendencia Semanal */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
            <TrendingUp className="mr-2 text-purple-600" size={24} />
            Tendencia de Fill Rate Semanal
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data.tendenciaSemanal}>
              <defs>
                <linearGradient id="colorFillRate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dia" />
              <YAxis domain={[80, 100]} />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="fillRate" 
                stroke="#8b5cf6" 
                fillOpacity={1} 
                fill="url(#colorFillRate)"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Distribución de Completitud */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">
            Distribución de Completitud
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.distribucionCompletitud}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ rango, cantidad }) => `${rango}: ${cantidad}`}
                outerRadius={100}
                dataKey="cantidad"
              >
                {data.distribucionCompletitud.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Fill Rate por Tienda */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
          <Store className="mr-2 text-blue-600" size={24} />
          Fill Rate por Tienda
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data.datosPorTienda}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="tienda" />
            <YAxis yAxisId="left" label={{ value: 'Fill Rate (%)', angle: -90, position: 'insideLeft' }} />
            <YAxis yAxisId="right" orientation="right" label={{ value: 'Pedidos', angle: 90, position: 'insideRight' }} />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="fillRate" fill="#8b5cf6" name="Fill Rate %" radius={[8, 8, 0, 0]} />
            <Bar yAxisId="right" dataKey="totalPedidos" fill="#3b82f6" name="Total Pedidos" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Items Faltantes por Categoría */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">
          Items Faltantes por Categoría
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.categorias} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="categoria" width={150} />
            <Tooltip />
            <Bar dataKey="faltantes" radius={[0, 8, 8, 0]}>
              {data.categorias.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Productos Faltantes */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
          <AlertTriangle className="mr-2 text-red-600" size={24} />
          Top 5 Productos Más Faltantes
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Veces Faltante</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Frecuencia</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Impacto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.topFaltantes.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                      index === 0 ? 'bg-red-100 text-red-800' :
                      index === 1 ? 'bg-orange-100 text-orange-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">{item.producto}</td>
                  <td className="px-6 py-4 text-gray-500 font-mono text-sm">{item.sku}</td>
                  <td className="px-6 py-4 text-gray-900 font-semibold">{item.faltantes}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-red-600 h-2 rounded-full"
                          style={{width: `${item.frecuencia}%`}}
                        />
                      </div>
                      <span className="text-sm font-medium">{item.frecuencia}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.frecuencia > 70 ? 'bg-red-100 text-red-800' :
                      item.frecuencia > 50 ? 'bg-orange-100 text-orange-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.frecuencia > 70 ? 'CRÍTICO' : item.frecuencia > 50 ? 'ALTO' : 'MEDIO'}
                    </span>
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

export default FillRateDashboard;