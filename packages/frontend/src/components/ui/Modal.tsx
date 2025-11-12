import React, { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  className = '',
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-4xl', // increased a bit for large forms
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className={`relative w-full ${sizeClasses[size]} mx-4 rounded-lg bg-white shadow-lg flex flex-col max-h-[90vh] ${className}`}
      >
        {/* Close Button */}
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {/* Title */}
        {title && (
          <div className="border-b px-6 py-3 text-lg font-semibold text-gray-800 flex-shrink-0">
            {title}
          </div>
        )}

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};
