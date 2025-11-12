import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

interface TrendIndicatorProps {
  trend: "up" | "down" | "neutral";
}

export const TrendIndicator: React.FC<TrendIndicatorProps> = ({ trend }) => {
  let color = "text-gray-500";
  let Icon = null;

  if (trend === "up") {
    color = "text-green-500";
    Icon = ArrowUp;
  } else if (trend === "down") {
    color = "text-red-500";
    Icon = ArrowDown;
  }

  return (
    <div className={`flex items-center gap-1 ${color}`}>
      {Icon && <Icon size={16} />}
      <span className="text-sm capitalize">{trend}</span>
    </div>
  );
};
