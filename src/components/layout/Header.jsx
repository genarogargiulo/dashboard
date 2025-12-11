import React from 'react';

const Header = ({ title, subtitle, color = 'blue' }) => {
  const gradientColors = {
    blue: 'from-blue-600 to-blue-800',
    purple: 'from-purple-600 to-indigo-700',
    green: 'from-green-600 to-emerald-700',
    orange: 'from-orange-600 to-red-700',
    indigo: 'from-indigo-600 to-purple-600'
  };

  return (
    <div className={`bg-gradient-to-r ${gradientColors[color]} text-white p-6 shadow-lg`}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-opacity-90 text-white">{subtitle}</p>
      </div>
    </div>
  );
};

export default Header;