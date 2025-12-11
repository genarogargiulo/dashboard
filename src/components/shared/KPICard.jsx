import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import InfoTooltip from './InfoTooltip';

const KPICard = ({ title, value, subtitle, icon: Icon, color, trend, tooltip }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    red: 'from-red-500 to-red-600',
    orange: 'from-orange-500 to-orange-600',
    purple: 'from-purple-500 to-purple-600',
    indigo: 'from-indigo-500 to-indigo-600',
    pink: 'from-pink-500 to-pink-600'
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-br ${colorClasses[color]} text-white`}>
          <Icon size={24} />
        </div>
        <div className="flex items-center space-x-2">
          {tooltip && <InfoTooltip {...tooltip} />}
          {trend !== undefined && (
            <div className={`flex items-center text-sm font-semibold ${
              trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-600'
            }`}>
              {trend > 0 && <TrendingUp size={16} />}
              {trend < 0 && <TrendingDown size={16} />}
              <span className="ml-1">{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
      </div>
      <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-2">{subtitle}</p>}
    </div>
  );
};

export default KPICard;