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
  const baseStyles = "group px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 text-sm md:text-base cursor-pointer";
  
  const variants = {
    primary: "button-primary shadow-sm",
    secondary: "button-secondary",
    glow: "button-secondary shadow-sm",
  };

  return (
    <motion.button
      id={id}
      whileHover={props.disabled ? undefined : { scale: 1.02 }}
      whileTap={props.disabled ? undefined : { scale: 0.98 }}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};
