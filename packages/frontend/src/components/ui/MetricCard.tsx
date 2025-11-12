import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  change?: string | number; // e.g. "+12%" or "-5%"
  color?: 'blue' | 'green' | 'red' | 'yellow';
  onClick?: () => void;
  className?: string;
}

const colorMap = {
  blue: 'text-blue-500 bg-blue-100',
  green: 'text-green-500 bg-green-100',
  red: 'text-red-500 bg-red-100',
  yellow: 'text-yellow-500 bg-yellow-100',
};

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon: Icon,
  change,
  color = 'blue',
  onClick,
  className = '',
}) => {
  return (
    <div
      onClick={onClick}
      className={`flex cursor-pointer flex-col justify-between rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md ${className}`}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {Icon && (
          <div
            className={`rounded-full p-2 ${colorMap[color]} transition-transform duration-300 hover:scale-105`}
          >
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
   {change && (
  <p
    className={`mt-1 text-sm ${
      change.toString().startsWith('-') ? 'text-red-500' : 'text-green-500'
    }`}
  >
    {typeof change === 'number' ? `${change > 0 ? '+' : ''}${change}%` : change}
  </p>
)}
      </div>
    </div>
  );
};

export default MetricCard;
