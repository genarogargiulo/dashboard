import React, { useState } from 'react';
import { 
  BookOpen, Search, Package, TrendingUp, Truck, ClipboardList,
  Target, Clock, Activity, AlertTriangle, CheckCircle, HelpCircle
} from 'lucide-react';

const DocumentacionDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todas');

  // Definición completa de todas las métricas
  const metricas = {
    picking: {
      title: 'Picking',
      icon: Package,
      color: 'blue',
      metricas: [
        {
          nombre: 'Total Operaciones',
          descripcion: 'Número total de operaciones de picking realizadas en el periodo seleccionado.',
          formula: 'COUNT(DISTINCT ID_OPERACION)',
          unidad: 'operaciones',
          rangoOptimo: 'Variable según volumen',
          interpretacion: 'Mayor cantidad indica mayor actividad. Comparar con periodos anteriores para identificar tendencias.',
          ejemplo: 'Si hay 150 operaciones en una semana, significa que se completaron 150 procesos de picking únicos.'
        },
        {
          nombre: 'Total Traspasos',
          descripcion: 'Suma de todos los movimientos de items realizados durante las operaciones de picking.',
          formula: 'COUNT(ID_TRASPASO)',
          unidad: 'traspasos',
          rangoOptimo: 'Variable',
          interpretacion: 'Indica el volumen total de movimientos. Un valor alto con operaciones bajas puede indicar operaciones complejas.',
          ejemplo: '1,250 traspasos en 150 operaciones = ~8.3 traspasos por operación en promedio.'
        },
        {
          nombre: 'Tiempo Promedio',
          descripcion: 'Tiempo promedio que toma completar una operación de picking desde inicio hasta fin.',
          formula: 'AVG(DURACION_OPERACION_MINUTOS)',
          unidad: 'minutos',
          rangoOptimo: '20-45 minutos',
          interpretacion: 'Valores muy altos pueden indicar problemas de eficiencia o complejidad. Valores muy bajos pueden comprometer la precisión.',
          ejemplo: '35 minutos promedio indica que cada operación toma aproximadamente media hora en completarse.'
        },
        {
          nombre: 'Tasa de Repescas',
          descripcion: 'Porcentaje de traspasos que requieren ser reprocesados o corregidos.',
          formula: '(SUM(ES_REPESCA) / COUNT(*)) × 100',
          unidad: '%',
          rangoOptimo: '< 5%',
          interpretacion: 'Alto porcentaje indica problemas de calidad o proceso. Meta: mantener bajo 5%.',
          ejemplo: '3.5% significa que de cada 100 traspasos, aproximadamente 3-4 necesitan repesca.'
        }
      ]
    },
    fillrate: {
      title: 'Fill Rate',
      icon: TrendingUp,
      color: 'purple',
      metricas: [
        {
          nombre: 'Fill Rate Promedio',
          descripcion: 'Porcentaje promedio de items solicitados que fueron entregados correctamente.',
          formula: '(Items_Entregados / Items_Solicitados) × 100',
          unidad: '%',
          rangoOptimo: '> 95%',
          interpretacion: 'KPI crítico de servicio al cliente. >95% excelente, 90-95% aceptable, <90% crítico.',
          ejemplo: '96.5% significa que de cada 100 items pedidos, se entregan 96-97 correctamente.'
        },
        {
          nombre: 'Pedidos Completos',
          descripcion: 'Cantidad de pedidos que fueron entregados al 100% sin faltantes.',
          formula: 'COUNT(Pedidos WHERE FillRate = 100%)',
          unidad: 'pedidos',
          rangoOptimo: '> 80% del total',
          interpretacion: 'Meta: >80% de pedidos perfectos. Indicador directo de satisfacción del cliente.',
          ejemplo: '120 pedidos completos de 150 totales = 80% de tasa de perfección.'
        }
      ]
    },
    recepciones: {
      title: 'Recepciones',
      icon: Truck,
      color: 'green',
      metricas: [
        {
          nombre: 'Tiempo Total de Recepción',
          descripcion: 'Tiempo desde la llegada del camión hasta la finalización completa del proceso.',
          formula: 'Tiempo_Espera + Tiempo_Descarga + Tiempo_Validación',
          unidad: 'minutos',
          rangoOptimo: '60-120 minutos',
          interpretacion: 'Meta: <90 min para recepciones estándar. >120 min indica cuellos de botella.',
          ejemplo: '85 minutos = 15 min espera + 55 min descarga + 15 min validación.'
        },
        {
          nombre: 'Items por Minuto',
          descripcion: 'Velocidad de descarga medida en items procesados por minuto.',
          formula: 'Total_Items / Tiempo_Descarga',
          unidad: 'items/min',
          rangoOptimo: '8-15 items/min',
          interpretacion: 'Indicador de productividad. Varía según tipo de carga (paletizado > granel > cajas).',
          ejemplo: '12 items/min es excelente para carga mixta.'
        }
      ]
    },
    inventarios: {
      title: 'Inventarios',
      icon: ClipboardList,
      color: 'orange',
      metricas: [
        {
          nombre: 'Precisión de Conteo',
          descripcion: 'Porcentaje que indica qué tan exactos son los conteos vs el inventario esperado.',
          formula: '100 - (|Items_Contados - Items_Esperados| / Items_Esperados × 100)',
          unidad: '%',
          rangoOptimo: '> 95%',
          interpretacion: '>98% excelente, 95-98% bueno, <95% requiere análisis. Meta: 99%+.',
          ejemplo: '97.5% indica alta precisión con desviación de solo 2.5%.'
        },
        {
          nombre: 'Tasa de Exactitud',
          descripcion: 'Porcentaje de operaciones donde el conteo coincide exactamente con lo esperado.',
          formula: '(Operaciones_Exactas / Total_Operaciones) × 100',
          unidad: '%',
          rangoOptimo: '> 70%',
          interpretacion: 'Complementa precisión. >70% excelente, indica conteos perfectos sin diferencias.',
          ejemplo: '75% = 3 de cada 4 conteos son exactos, el cuarto tiene diferencias mínimas.'
        },
        {
          nombre: 'Items por Minuto',
          descripcion: 'Velocidad de conteo medida en items procesados por minuto.',
          formula: 'Items_Contados / Tiempo_Total',
          unidad: 'items/min',
          rangoOptimo: '15-30 items/min',
          interpretacion: 'Varía por tipo de inventario. Cíclico más rápido que anual. Equilibrar velocidad y precisión.',
          ejemplo: '22 items/min es velocidad óptima manteniendo buena precisión.'
        }
      ]
    }
  };

  const categorias = [
    { id: 'todas', label: 'Todas', icon: BookOpen },
    { id: 'picking', label: 'Picking', icon: Package },
    { id: 'fillrate', label: 'Fill Rate', icon: TrendingUp },
    { id: 'recepciones', label: 'Recepciones', icon: Truck },
    { id: 'inventarios', label: 'Inventarios', icon: ClipboardList }
  ];

  // Filtrar métricas
  const metricasFiltradas = () => {
    let resultado = [];
    
    Object.keys(metricas).forEach(categoria => {
      if (selectedCategory === 'todas' || selectedCategory === categoria) {
        metricas[categoria].metricas.forEach(metrica => {
          if (
            searchTerm === '' ||
            metrica.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            metrica.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
          ) {
            resultado.push({
              ...metrica,
              categoria: metricas[categoria].title,
              categoriaId: categoria,
              color: metricas[categoria].color
            });
          }
        });
      }
    });
    
    return resultado;
  };

  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700'
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center mb-4">
          <BookOpen size={32} className="mr-3 text-indigo-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Guía de Métricas</h2>
            <p className="text-gray-600 text-sm">
              Documentación completa de todas las métricas del sistema
            </p>
          </div>
        </div>

        {/* Búsqueda y filtros */}
        <div className="flex flex-col lg:flex-row gap-4 mt-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar métrica..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            {categorias.map(cat => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm ${
                    selectedCategory === cat.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon size={16} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Listado de métricas */}
      <div className="space-y-4">
        {metricasFiltradas().map((metrica, index) => (
          <div 
            key={index} 
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-500"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{metrica.nombre}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${colorClasses[metrica.color]}`}>
                    {metrica.categoria}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{metrica.descripcion}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <p className="text-xs font-semibold text-blue-900 mb-1">Fórmula:</p>
                <code className="text-xs font-mono text-blue-800">{metrica.formula}</code>
              </div>

              <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                <p className="text-xs font-semibold text-green-900 mb-1">Rango Óptimo:</p>
                <p className="text-sm text-green-800">{metrica.rangoOptimo}</p>
              </div>

              <div className="bg-purple-50 rounded-lg p-3 border border-purple-200 md:col-span-2">
                <p className="text-xs font-semibold text-purple-900 mb-1">Interpretación:</p>
                <p className="text-xs text-purple-800">{metrica.interpretacion}</p>
              </div>

              <div className="bg-orange-50 rounded-lg p-3 border border-orange-200 md:col-span-2">
                <p className="text-xs font-semibold text-orange-900 mb-1">Ejemplo:</p>
                <p className="text-xs text-orange-800">{metrica.ejemplo}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentacionDashboard;