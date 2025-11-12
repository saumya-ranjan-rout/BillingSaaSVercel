import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface NotificationToastProps {
  show: boolean;
  onClose: () => void;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

const NotificationToast: React.FC<NotificationToastProps> = ({
  show,
  onClose,
  message,
  type = 'info',
  duration = 5000,
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && show && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose, isClient]);

  if (!isClient || !show) return null;

  const typeStyles = {
    success: 'bg-green-100 border-green-400 text-green-800',
    error: 'bg-red-100 border-red-400 text-red-800',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-800',
    info: 'bg-blue-100 border-blue-400 text-blue-800',
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
      <div
        className={cn(
          'flex items-center p-4 rounded-lg border shadow-lg transform transition-all duration-300',
          typeStyles[type],
          show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        )}
        role="alert"
      >
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-4 p-1 rounded-md hover:bg-opacity-20 hover:bg-black focus:outline-none"
          aria-label="Close notification"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default NotificationToast;
