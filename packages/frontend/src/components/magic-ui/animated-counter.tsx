"use client";
import { motion, useSpring, useMotionValue, useTransform } from "framer-motion";
import React, { useEffect } from "react";

interface AnimatedCounterProps {
  value: number;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ value }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.floor(latest));

  const spring = useSpring(count, { stiffness: 100, damping: 20 });

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return (
    <motion.span className="text-3xl font-semibold text-gray-900">
      {rounded}
    </motion.span>
  );
};
