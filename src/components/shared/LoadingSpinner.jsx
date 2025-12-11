import React from 'react';
import { RefreshCw } from 'lucide-react';

const LoadingSpinner = ({ message = 'Cargando datos...', size = 48 }) => {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <RefreshCw 
          className="animate-spin text-blue-600 mx-auto mb-4" 
          size={size} 
        />
        <p className="text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;