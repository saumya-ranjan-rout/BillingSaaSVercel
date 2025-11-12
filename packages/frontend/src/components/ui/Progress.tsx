import React from 'react';

interface ProgressProps {
  /** Current progress value (0 .. max) */
  value: number;
  /** Maximum value (defaults to 100) */
  max?: number;
  /** Optional extra classes for the outer wrapper */
  className?: string;
  /** Show percentage label on the progress bar */
  showLabel?: boolean;
  /** Small / normal / large sizes */
  size?: 'sm' | 'md' | 'lg';
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  className = '',
  showLabel = false,
  size = 'md',
}) => {
  const safeValue = Math.max(0, Math.min(value, max));
  const percentage = max > 0 ? Math.round((safeValue / max) * 100) : 0;

  const sizeHeight = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  }[size];

  return (
    <div className={`w-full ${className}`}>
      <div
        role="progressbar"
        aria-valuenow={safeValue}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label="Progress"
        className={`relative bg-gray-100 rounded-md overflow-hidden ${sizeHeight}`}
      >
        <div
          style={{ width: `${percentage}%` }}
          className="absolute left-0 top-0 bottom-0 bg-blue-600 transition-all duration-300"
        />
      </div>

      {showLabel && (
        <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
          <span>
            {safeValue} / {max}
          </span>
          <span>{percentage}%</span>
        </div>
      )}
    </div>
  );
};
