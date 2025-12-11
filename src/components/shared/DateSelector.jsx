import React from 'react';
import { Calendar, RefreshCw, Download } from 'lucide-react';

const DateSelector = ({ 
  startDate, 
  setStartDate, 
  endDate, 
  setEndDate, 
  onRefresh, 
  onExport,
  loading,
  dataCount 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Calendar className="text-gray-400" size={20} />
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600 font-medium">Desde:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600 font-medium">Hasta:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {dataCount !== undefined && (
            <span className="text-sm text-gray-600 font-medium">
              {dataCount.toLocaleString()} registros
            </span>
          )}
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={loading ? 'animate-spin' : ''} size={16} />
            <span>Actualizar</span>
          </button>
          {onExport && (
            <button
              onClick={onExport}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download size={16} />
              <span>Exportar</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DateSelector;