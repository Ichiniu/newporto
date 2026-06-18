"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "glow";
  children: React.ReactNode;
  className?: string;
  id: string; // Mandatory for browser testing/unique id rule
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  children,
  className = "",
  onClick,
  id,
  ...props
}) => {
  const baseStyles = "px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 text-sm md:text-base cursor-pointer";
  
  const variants = {
    primary: "bg-cyan-500 hover:bg-cyan-400 text-gray-900 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-400/35 border border-cyan-400/20",
    secondary: "bg-gray-800/80 hover:bg-gray-700/80 text-gray-100 border border-gray-700 hover:border-gray-600",
    glow: "bg-[#0c1e2d] hover:bg-[#112a3f] text-cyan-400 border border-cyan-500/30 hover:border-cyan-400/50 shadow-md shadow-cyan-500/5 hover:shadow-cyan-400/20",
  };

  return (
    <motion.button
      id={id}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};
