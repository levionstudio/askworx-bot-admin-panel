import React from 'react';

const StatCard = ({ label, value, icon: Icon, color, trend }) => {
  return (
    <div className="glass-card p-6 rounded-2xl flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-1">{label}</p>
        <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
        {trend && (
          <p className={`text-xs mt-2 ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend > 0 ? '+' : ''}{trend}% from yesterday
          </p>
        )}
      </div>
      <div className={`p-4 rounded-xl ${color} bg-opacity-10`}>
        <Icon className={`w-8 h-8 ${color.replace('bg-', 'text-')}`} />
      </div>
    </div>
  );
};

export default StatCard;
