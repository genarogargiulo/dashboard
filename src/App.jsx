import React, { useState } from 'react';
import Header from './components/layout/Header';
import TabNavigation from './components/layout/TabNavigation';
import PickingDashboard from './components/picking/PickingDashboard';
import FillRateDashboard from './components/fillrate/FillRateDashboard';
import RecepcionesDashboard from './components/recepciones/RecepcionesDashboard';
import InventariosDashboard from './components/inventarios/InventariosDashboard';
import DocumentacionDashboard from './components/documentacion/DocumentacionDashboard';

function App() {
  const [activeTab, setActiveTab] = useState('picking');

  // Configuración de pestañas
  const tabs = [
    { 
      id: 'picking', 
      label: 'Picking', 
      icon: '📦',
      component: PickingDashboard,
      headerTitle: '📦 Dashboard de Picking',
      headerSubtitle: 'Sistema de Análisis de Operaciones en Tiempo Real',
      headerColor: 'blue'
    },
    { 
      id: 'fillrate', 
      label: 'Fill Rate', 
      icon: '📊',
      component: FillRateDashboard,
      headerTitle: '📊 Dashboard de Fill Rate',
      headerSubtitle: 'Análisis de Completitud de Pedidos y Performance',
      headerColor: 'purple'
    },
    { 
      id: 'recepciones', 
      label: 'Recepciones', 
      icon: '🚚',
      component: RecepcionesDashboard,
      headerTitle: '🚚 Dashboard de Recepciones',
      headerSubtitle: 'Productividad y Tiempos de Recepción de Camiones',
      headerColor: 'green'
    },
    { 
      id: 'inventarios', 
      label: 'Inventarios', 
      icon: '📋',
      component: InventariosDashboard,
      headerTitle: '📋 Dashboard de Inventarios',
      headerSubtitle: 'Productividad y Precisión de Operaciones de Inventario',
      headerColor: 'orange'
    },
    { 
      id: 'documentacion', 
      label: 'Documentación', 
      icon: '📖',
      component: DocumentacionDashboard,
      headerTitle: '📖 Documentación de Métricas',
      headerSubtitle: 'Guía Completa de Todas las Métricas del Sistema',
      headerColor: 'indigo'
    }
  ];

  const currentTab = tabs.find(tab => tab.id === activeTab);
  const CurrentComponent = currentTab.component;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header dinámico según la pestaña activa */}
      <Header 
        title={currentTab.headerTitle}
        subtitle={currentTab.headerSubtitle}
        color={currentTab.headerColor}
      />

      {/* Navegación por pestañas */}
      <TabNavigation 
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Contenido dinámico según la pestaña */}
      <div className="py-2">
        <CurrentComponent />
      </div>
    </div>
  );
}

export default App;