import React, { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import TabNavigation from './components/layout/TabNavigation';
import Login from './components/auth/Login';
import PickingDashboard from './components/picking/PickingDashboard';
import FillRateDashboard from './components/fillrate/FillRateDashboard';
import RecepcionesDashboard from './components/recepciones/RecepcionesDashboard';
import InventariosDashboard from './components/inventarios/InventariosDashboard';
import DocumentacionDashboard from './components/documentacion/DocumentacionDashboard';
import { LogOut } from 'lucide-react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('picking');
  const [username, setUsername] = useState('');

  // Verificar si el usuario ya está autenticado al cargar la app
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    const savedUsername = localStorage.getItem('username');
    
    if (authStatus === 'true' && savedUsername) {
      setIsAuthenticated(true);
      setUsername(savedUsername);
    }
  }, []);

  // Manejar login exitoso
  const handleLogin = (success) => {
    if (success) {
      setIsAuthenticated(true);
      const savedUsername = localStorage.getItem('username');
      setUsername(savedUsername);
    }
  };

  // Manejar logout
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
    setUsername('');
    setActiveTab('picking'); // Reset a la primera pestaña
  };

  // Si no está autenticado, mostrar login
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

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
      icon: '📚',
      component: DocumentacionDashboard,
      headerTitle: '📚 Documentación de Métricas',
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
        logoUrl="/assets/LOGO.png"
        logoAlt="TECSIDEL"
        logoStyle="transparent"
        logoHeight="h-30"
      />

      {/* Barra de usuario y logout */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-sm text-gray-600">
              Sesión iniciada como: <span className="font-semibold text-gray-800">{username}</span>
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
          >
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </button>
        </div>
      </div>

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