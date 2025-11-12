import React from "react";
import clsx from "clsx";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "outline";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  className = "",
}) => {
  const baseStyles =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";

  const variants: Record<string, string> = {
    default: "bg-blue-100 text-blue-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
    outline: "border border-gray-300 text-gray-800",
  };

  return (
    <span className={clsx(baseStyles, variants[variant], className)}>
      {children}
    </span>
  );
};
