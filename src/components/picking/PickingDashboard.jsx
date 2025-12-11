import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Area, AreaChart
} from 'recharts';
import { 
  Package, Activity, Clock, AlertCircle, Users, TrendingUp, 
  Timer, Target, CheckCircle, Zap
} from 'lucide-react';
import KPICard from '../shared/KPICard';
import DateSelector from '../shared/DateSelector';
import LoadingSpinner from '../shared/LoadingSpinner';

// Mock data generator basado en la estructura real del Excel
const generatePickingData = (count = 200) => {
  const operarios = ['SQUIJANO', 'TSAPETTO', 'RFERNANDEZ', 'NGOMEZ', 'EVALENZUELA', 'ACOSTA', 'LVIDAL', 'MCASTRO'];
  const tiendas = ['Tienda A', 'Tienda B', 'Tienda C'];
  const secciones = [1, 2, 3, 4, 5];
  const diasSemana = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  const data = [];
  const operacionesBase = 2686000;
  
  for (let i = 0; i < count; i++) {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() - Math.floor(Math.random() * 7));
    
    const horaTraspaso = Math.floor(Math.random() * 15) + 6; // 6-21 horas
    const cantATranspasar = Math.floor(Math.random() * 10) + 1;
    const cantTraspasada = Math.random() > 0.05 ? cantATranspasar : cantATranspasar - 1;
    
    data.push({
      ID_OPERACION: operacionesBase + Math.floor(Math.random() * 6000),
      USUARIO_OPERACION: operarios[Math.floor(Math.random() * operarios.length)],
      DURACION_OPERACION_MINUTOS: Math.floor(Math.random() * 45) + 10,
      ES_REPESCA: Math.random() > 0.85 ? 1 : 0,
      TOTAL_TRASPASOS_OPERACION: Math.floor(Math.random() * 50) + 10,
      CANT_A_TRASPASAR: cantATranspasar,
      CANT_TRASPASADA: cantTraspasada,
      TIEMPO_ESPERA_INICIO_MINUTOS: Math.floor(Math.random() * 30),
      HORA_TRASPASO: horaTraspaso,
      DIA_SEMANA: diasSemana[fecha.getDay()],
      ID_SECCION: secciones[Math.floor(Math.random() * secciones.length)],
      MINUTOS_DESDE_TRASPASO_ANTERIOR: Math.random() > 0.3 ? Math.floor(Math.random() * 5) + 1 : null,
      TERMINAL: Math.floor(Math.random() * 10) + 1,
      NOMBRE_TIENDA: tiendas[Math.floor(Math.random() * tiendas.length)]
    });
  }
  return data;
};

const calculateKPIs = (data) => {
  const operacionesUnicas = new Set(data.map(d => d.ID_OPERACION));
  const totalOps = operacionesUnicas.size;
  
  // C?lculos b?sicos
  const repescas = data.filter(d => d.ES_REPESCA === 1).length;
  const totalTraspasos = data.length;
  const tiempoPromedio = Math.round(
    data.reduce((acc, d) => acc + d.DURACION_OPERACION_MINUTOS, 0) / data.length || 0
  );
  
  // Calcular tiempos totales por operaci?n
  const tiemposPorOperacion = {};
  data.forEach(d => {
    if (!tiemposPorOperacion[d.ID_OPERACION]) {
      tiemposPorOperacion[d.ID_OPERACION] = {
        duracion: d.DURACION_OPERACION_MINUTOS,
        traspasos: d.TOTAL_TRASPASOS_OPERACION
      };
    }
  });
  
  // Eficiencia: traspasos por hora
  const eficienciaPromedio = Math.round(
    Object.values(tiemposPorOperacion).reduce((acc, op) => {
      return acc + (op.traspasos / (op.duracion / 60));
    }, 0) / Object.keys(tiemposPorOperacion).length || 0
  );
  
  // Tasa de cumplimiento
  const tasaCumplimiento = (
    (data.filter(d => d.CANT_TRASPASADA >= d.CANT_A_TRASPASAR).length / totalTraspasos) * 100
  ).toFixed(1);
  
  // Tiempo de espera promedio
  const tiempoEsperaPromedio = Math.round(
    data.reduce((acc, d) => acc + d.TIEMPO_ESPERA_INICIO_MINUTOS, 0) / data.length || 0
  );
  
  // Tiempo entre traspasos
  const tiemposValidos = data.filter(d => d.MINUTOS_DESDE_TRASPASO_ANTERIOR !== null);
  const tiempoEntreTraspasos = tiemposValidos.length > 0 
    ? (tiemposValidos.reduce((acc, d) => acc + d.MINUTOS_DESDE_TRASPASO_ANTERIOR, 0) / tiemposValidos.length).toFixed(1)
    : 0;
  
  // Operarios activos
  const operariosActivos = new Set(data.map(d => d.USUARIO_OPERACION)).size;
  
  return {
    totalOperaciones: totalOps,
    totalTraspasos,
    repescas,
    tasaRepescas: ((repescas / totalTraspasos) * 100).toFixed(1),
    tiempoPromedio,
    eficienciaPromedio,
    tasaCumplimiento,
    tiempoEsperaPromedio,
    tiempoEntreTraspasos,
    operariosActivos
  };
};

const groupByWeekday = (data) => {
  const dias = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const diasEs = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];
  const grouped = {};
  
  dias.forEach((dia, idx) => { 
    grouped[dia] = { dia: diasEs[idx], traspasos: 0, operaciones: new Set() }; 
  });
  
  data.forEach(item => {
    if (grouped[item.DIA_SEMANA]) {
      grouped[item.DIA_SEMANA].traspasos++;
      grouped[item.DIA_SEMANA].operaciones.add(item.ID_OPERACION);
    }
  });
  
  return dias.map(dia => ({
    dia: grouped[dia].dia,
    traspasos: grouped[dia].traspasos,
    operaciones: grouped[dia].operaciones.size
  }));
};

const getOperariosPerformance = (data) => {
  const performance = {};
  
  data.forEach(item => {
    if (!performance[item.USUARIO_OPERACION]) {
      performance[item.USUARIO_OPERACION] = {
        operario: item.USUARIO_OPERACION,
        traspasos: 0,
        operaciones: new Set(),
        tiempoTotal: 0,
        repescas: 0
      };
    }
    
    performance[item.USUARIO_OPERACION].traspasos++;
    performance[item.USUARIO_OPERACION].operaciones.add(item.ID_OPERACION);
    performance[item.USUARIO_OPERACION].tiempoTotal += item.DURACION_OPERACION_MINUTOS;
    if (item.ES_REPESCA === 1) {
      performance[item.USUARIO_OPERACION].repescas++;
    }
  });
  
  return Object.values(performance)
    .map(p => ({
      operario: p.operario,
      traspasos: p.traspasos,
      operaciones: p.operaciones.size,
      eficiencia: Math.round(p.traspasos / (p.tiempoTotal / 60)),
      tasaRepescas: ((p.repescas / p.traspasos) * 100).toFixed(1)
    }))
    .sort((a, b) => b.eficiencia - a.eficiencia)
    .slice(0, 10);
};

const getTraspasosPorHora = (data) => {
  const porHora = {};
  
  for (let h = 6; h <= 21; h++) {
    porHora[h] = { hora: `${h}:00`, traspasos: 0 };
  }
  
  data.forEach(item => {
    if (porHora[item.HORA_TRASPASO]) {
      porHora[item.HORA_TRASPASO].traspasos++;
    }
  });
  
  return Object.values(porHora);
};

const getSeccionesAnalysis = (data) => {
  const secciones = {};
  
  data.forEach(item => {
    if (!secciones[item.ID_SECCION]) {
      secciones[item.ID_SECCION] = {
        seccion: `Seccion ${item.ID_SECCION}`,
        traspasos: 0,
        tiempoPromedio: 0,
        count: 0
      };
    }
    
    secciones[item.ID_SECCION].traspasos++;
    secciones[item.ID_SECCION].tiempoPromedio += item.DURACION_OPERACION_MINUTOS;
    secciones[item.ID_SECCION].count++;
  });
  
  return Object.values(secciones)
    .map(s => ({
      seccion: s.seccion,
      traspasos: s.traspasos,
      tiempoPromedio: Math.round(s.tiempoPromedio / s.count)
    }))
    .sort((a, b) => b.traspasos - a.traspasos);
};

const getTurnosAnalysis = (data) => {
  const turnos = {
    'Ma?ana (6-12h)': { traspasos: 0, operaciones: new Set() },
    'Tarde (12-18h)': { traspasos: 0, operaciones: new Set() },
    'Noche (18-22h)': { traspasos: 0, operaciones: new Set() }
  };
  
  data.forEach(item => {
    const hora = item.HORA_TRASPASO;
    let turno;
    
    if (hora >= 6 && hora < 12) turno = 'Ma?ana (6-12h)';
    else if (hora >= 12 && hora < 18) turno = 'Tarde (12-18h)';
    else if (hora >= 18 && hora <= 22) turno = 'Noche (18-22h)';
    
    if (turno && turnos[turno]) {
      turnos[turno].traspasos++;
      turnos[turno].operaciones.add(item.ID_OPERACION);
    }
  });
  
  return Object.entries(turnos).map(([turno, data]) => ({
    turno,
    traspasos: data.traspasos,
    operaciones: data.operaciones.size
  }));
};

const PickingDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState('2025-10-08');
  const [endDate, setEndDate] = useState('2025-10-10');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    setTimeout(() => {
      setData(generatePickingData(200));
      setLoading(false);
    }, 800);
  };

  if (loading) {
    return <LoadingSpinner message="Cargando datos de picking..." />;
  }

  const kpis = calculateKPIs(data);
  const operacionesPorDia = groupByWeekday(data);
  const operariosPerformance = getOperariosPerformance(data);
  const traspasosPorHora = getTraspasosPorHora(data);
  const seccionesAnalysis = getSeccionesAnalysis(data);
  const turnosAnalysis = getTurnosAnalysis(data);

  const distribucionTiempos = [
    { rango: '0-15 min', cantidad: data.filter(d => d.DURACION_OPERACION_MINUTOS < 15).length, color: '#22c55e' },
    { rango: '15-30 min', cantidad: data.filter(d => d.DURACION_OPERACION_MINUTOS >= 15 && d.DURACION_OPERACION_MINUTOS < 30).length, color: '#3b82f6' },
    { rango: '30-45 min', cantidad: data.filter(d => d.DURACION_OPERACION_MINUTOS >= 30 && d.DURACION_OPERACION_MINUTOS < 45).length, color: '#f59e0b' },
    { rango: '45+ min', cantidad: data.filter(d => d.DURACION_OPERACION_MINUTOS >= 45).length, color: '#ef4444' }
  ].filter(r => r.cantidad > 0);

  return (
    <div className="max-w-[1600px] mx-auto p-6 bg-gray-50">
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

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
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
          title="Eficiencia"
          value={`${kpis.eficienciaPromedio} tr/h`}
          subtitle="Traspasos por hora"
          icon={Zap}
          color="yellow"
          trend={8.5}
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

      {/* KPIs Secundarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard
          title="Operarios Activos"
          value={kpis.operariosActivos}
          icon={Users}
          color="indigo"
        />
        <KPICard
          title="Tasa Cumplimiento"
          value={`${kpis.tasaCumplimiento}%`}
          subtitle="Traspasos completos"
          icon={CheckCircle}
          color="green"
          trend={2.3}
        />
        <KPICard
          title="Espera Promedio"
          value={`${kpis.tiempoEsperaPromedio} min`}
          subtitle="Antes de iniciar"
          icon={Timer}
          color="red"
          trend={-5.2}
        />
        <KPICard
          title="Tiempo Entre Traspasos"
          value={`${kpis.tiempoEntreTraspasos} min`}
          subtitle="Promedio"
          icon={TrendingUp}
          color="teal"
          trend={-3.1}
        />
      </div>

      {/* Gr?ficos Principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Traspasos por Dia */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">
            Traspasos por Dia de la Semana
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={operacionesPorDia}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dia" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="traspasos" fill="#3b82f6" name="Traspasos" />
              <Bar yAxisId="right" dataKey="operaciones" fill="#10b981" name="Operaciones" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Distribuci?n de Tiempos */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">
            Distribucion de Tiempos de Operacion
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

      {/* An?lisis por Hora del D?a */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">
          Traspasos por Hora del Dia
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={traspasosPorHora}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hora" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="traspasos" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Performance de Operarios y An?lisis por Turno */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top Operarios */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">
            Top Operarios por Eficiencia
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={operariosPerformance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="operario" type="category" width={100} />
              <Tooltip />
              <Legend />
              <Bar dataKey="eficiencia" fill="#10b981" name="Traspasos/hora" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* An?lisis por Turno */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">
            Analisis por Turno
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={turnosAnalysis}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="turno" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="traspasos" fill="#f59e0b" name="Traspasos" />
              <Bar yAxisId="right" dataKey="operaciones" fill="#8b5cf6" name="Operaciones" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* An?lisis por Seccion */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">
          Analisis por Seccion
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={seccionesAnalysis}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="seccion" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="traspasos" fill="#06b6d4" name="Traspasos" />
            <Bar yAxisId="right" dataKey="tiempoPromedio" fill="#ec4899" name="Tiempo Promedio (min)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tabla de Detalle de Operarios */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">
          Detalle de Performance por Operario
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Operario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Traspasos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Operaciones
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Eficiencia (tr/h)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tasa Repescas
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {operariosPerformance.map((op, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {op.operario}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {op.traspasos}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {op.operaciones}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      op.eficiencia >= 60 ? 'bg-green-100 text-green-800' : 
                      op.eficiencia >= 40 ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {op.eficiencia}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      parseFloat(op.tasaRepescas) <= 5 ? 'bg-green-100 text-green-800' : 
                      parseFloat(op.tasaRepescas) <= 10 ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {op.tasaRepescas}%
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

export default PickingDashboard;