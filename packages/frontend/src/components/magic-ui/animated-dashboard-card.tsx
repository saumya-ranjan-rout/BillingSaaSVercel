import { motion } from "framer-motion";
import { AnimatedCounter } from "./animated-counter";
import { TrendIndicator } from "./trend-indicator";

interface AnimatedDashboardCardProps {
  title: string;
  value: number;
  trend: "up" | "down" | "neutral";
}

export function AnimatedDashboardCard({ title, value, trend }: AnimatedDashboardCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl p-6 shadow-lg"
    >
      <h3 className="text-gray-600">{title}</h3>
      <AnimatedCounter value={value} />
      <TrendIndicator trend={trend} />
    </motion.div>
  );
}
