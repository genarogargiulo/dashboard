import React, { useState } from 'react';
import { Info, HelpCircle } from 'lucide-react';

const InfoTooltip = ({ 
  title, 
  description, 
  formula, 
  example, 
  interpretation,
  position = 'top',
  size = 'md' 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        className="inline-flex items-center justify-center text-gray-400 hover:text-blue-600 transition-colors focus:outline-none"
      >
        <HelpCircle size={18} />
      </button>

      {isVisible && (
        <div 
          className={`absolute ${positionClasses[position]} z-50 w-80 bg-white rounded-lg shadow-xl border-2 border-blue-100 p-4 animate-fadeIn`}
          style={{ animation: 'fadeIn 0.2s ease-in-out' }}
        >
          {/* Flecha del tooltip */}
          <div className={`absolute w-3 h-3 bg-white border-blue-100 transform rotate-45 ${
            position === 'top' ? 'bottom-[-7px] left-1/2 -translate-x-1/2 border-r-2 border-b-2' :
            position === 'bottom' ? 'top-[-7px] left-1/2 -translate-x-1/2 border-l-2 border-t-2' :
            position === 'left' ? 'right-[-7px] top-1/2 -translate-y-1/2 border-r-2 border-t-2' :
            'left-[-7px] top-1/2 -translate-y-1/2 border-l-2 border-b-2'
          }`} />

          <div className="relative">
            {/* Título */}
            <div className="flex items-center mb-3 pb-2 border-b border-gray-200">
              <Info className="text-blue-600 mr-2 flex-shrink-0" size={20} />
              <h4 className="font-bold text-gray-900 text-sm">{title}</h4>
            </div>

            {/* Descripción */}
            <div className="mb-3">
              <p className="text-xs text-gray-600 leading-relaxed">{description}</p>
            </div>

            {/* Fórmula */}
            {formula && (
              <div className="mb-3 bg-blue-50 rounded-lg p-2">
                <p className="text-xs font-semibold text-blue-800 mb-1">Fórmula:</p>
                <p className="text-xs font-mono text-blue-900 bg-white px-2 py-1 rounded">
                  {formula}
                </p>
              </div>
            )}

            {/* Ejemplo */}
            {example && (
              <div className="mb-3 bg-green-50 rounded-lg p-2">
                <p className="text-xs font-semibold text-green-800 mb-1">Ejemplo:</p>
                <p className="text-xs text-green-900">{example}</p>
              </div>
            )}

            {/* Interpretación */}
            {interpretation && (
              <div className="bg-purple-50 rounded-lg p-2">
                <p className="text-xs font-semibold text-purple-800 mb-1">Interpretación:</p>
                <p className="text-xs text-purple-900">{interpretation}</p>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default InfoTooltip;