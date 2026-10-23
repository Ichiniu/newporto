"use client";

import React from "react";
import { motion } from "framer-motion";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  animateEntrance?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = "", delay = 0, animateEntrance = true }) => {
  return (
    <motion.div
      initial={animateEntrance ? { opacity: 0, y: 20 } : false}
      whileInView={animateEntrance ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      className={`glass-panel rounded-2xl p-6 transition-all duration-300 ${className}`}
    >
      {children}
    </motion.div>
  );
};
