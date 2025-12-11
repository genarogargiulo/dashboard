import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';
import { Package, Activity, Clock, AlertCircle } from 'lucide-react';
import KPICard from '../shared/KPICard';
import DateSelector from '../shared/DateSelector';
import LoadingSpinner from '../shared/LoadingSpinner';

// Mock data generator
const generatePickingData = (count = 100) => {
  const operarios = ['Juan Pérez', 'María García', 'Carlos López', 'Ana Martínez'];
  const data = [];
  
  for (let i = 0; i < count; i++) {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() - Math.floor(Math.random() * 30));
    
    data.push({
      ID_OPERACION: `OP-${1000 + i}`,
      USUARIO_OPERACION: operarios[Math.floor(Math.random() * operarios.length)],
      DURACION_OPERACION_MINUTOS: Math.floor(Math.random() * 60) + 10,
      ES_REPESCA: Math.random() > 0.9 ? 1 : 0,
      TOTAL_TRASPASOS_OPERACION: Math.floor(Math.random() * 20) + 5,
      DIA_SEMANA: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'][fecha.getDay()]
    });
  }
  return data;
};

const calculateKPIs = (data) => {
  const totalOps = new Set(data.map(d => d.ID_OPERACION)).size;
  const repescas = data.filter(d => d.ES_REPESCA).length;
  const tiempoPromedio = Math.round(
    data.reduce((acc, d) => acc + d.DURACION_OPERACION_MINUTOS, 0) / data.length || 0
  );
  
  return {
    totalOperaciones: totalOps,
    totalTraspasos: data.length,
    repescas,
    tasaRepescas: ((repescas / data.length) * 100).toFixed(1),
    tiempoPromedio
  };
};

const groupByWeekday = (data) => {
  const dias = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const grouped = {};
  dias.forEach(dia => { grouped[dia] = { traspasos: 0 }; });
  
  data.forEach(item => {
    if (grouped[item.DIA_SEMANA]) {
      grouped[item.DIA_SEMANA].traspasos++;
    }
  });
  
  return dias.map(dia => ({ dia, ...grouped[dia] }));
};

const PickingDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState('2025-01-01');
  const [endDate, setEndDate] = useState('2025-01-31');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    setTimeout(() => {
      setData(generatePickingData(100));
      setLoading(false);
    }, 500);
  };

  if (loading) {
    return <LoadingSpinner message="Cargando datos de picking..." />;
  }

  const kpis = calculateKPIs(data);
  const operacionesPorDia = groupByWeekday(data);

  const distribucionTiempos = [
    { rango: '0-15 min', cantidad: data.filter(d => d.DURACION_OPERACION_MINUTOS < 15).length, color: '#22c55e' },
    { rango: '15-30 min', cantidad: data.filter(d => d.DURACION_OPERACION_MINUTOS >= 15 && d.DURACION_OPERACION_MINUTOS < 30).length, color: '#3b82f6' },
    { rango: '30-45 min', cantidad: data.filter(d => d.DURACION_OPERACION_MINUTOS >= 30 && d.DURACION_OPERACION_MINUTOS < 45).length, color: '#f59e0b' },
    { rango: '45+ min', cantidad: data.filter(d => d.DURACION_OPERACION_MINUTOS >= 45).length, color: '#ef4444' }
  ].filter(r => r.cantidad > 0);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <DateSelector
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        onRefresh={loadData}
        onExport={() => console.log('Exportar picking')}
        loading={loading}
        dataCount={data.length}
      />

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <KPICard
          title="Total Operaciones"
          value={kpis.totalOperaciones}
          icon={Package}
          color="blue"
          trend={5.2}
        />
        <KPICard
          title="Total Traspasos"
          value={kpis.totalTraspasos.toLocaleString()}
          icon={Activity}
          color="green"
          trend={3.8}
        />
        <KPICard
          title="Tiempo Promedio"
          value={`${kpis.tiempoPromedio} min`}
          icon={Clock}
          color="orange"
          trend={-2.1}
        />
        <KPICard
          title="Tasa Repescas"
          value={`${kpis.tasaRepescas}%`}
          subtitle={`${kpis.repescas} repescas`}
          icon={AlertCircle}
          color="purple"
          trend={-1.5}
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">
            Traspasos por Día de la Semana
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={operacionesPorDia}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dia" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="traspasos" fill="#3b82f6" name="Traspasos" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">
            Distribución de Tiempos
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={distribucionTiempos}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ rango, cantidad }) => `${rango}: ${cantidad}`}
                outerRadius={100}
                dataKey="cantidad"
              >
                {distribucionTiempos.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PickingDashboard;