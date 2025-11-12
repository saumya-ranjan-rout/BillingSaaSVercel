import React from "react";
import { X } from "lucide-react";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export const Dialog: React.FC<DialogProps> = ({
  open,
  onClose,
  children,
  className = "",
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      {/* Dialog box */}
      <div
        className={`relative z-10 w-full max-w-lg rounded-lg bg-white shadow-lg ${className}`}
      >
        {children}
      </div>
    </div>
  );
};

export const DialogHeader: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="flex items-center justify-between border-b p-4">
    {children}
  </div>
);

export const DialogTitle: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <h3 className="text-lg font-semibold text-gray-800">{children}</h3>
);

export const DialogContent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className="p-4">{children}</div>;
