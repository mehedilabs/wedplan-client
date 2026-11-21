"use client";

import { useReducedMotion, motion } from "framer-motion";
import type { ReactNode } from "react";

interface HomeSectionMotionProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
  className?: string;
}

const offsets = {
  up: { x: 0, y: 32 },
  left: { x: -32, y: 0 },
  right: { x: 32, y: 0 },
  none: { x: 0, y: 0 },
};

const relaxedEase = [0.22, 0.61, 0.36, 1] as const;

export default function HomeSectionMotion({
  children,
  delay = 0,
  direction = "up",
  className,
}: HomeSectionMotionProps) {
  const shouldReduceMotion = useReducedMotion();

  const wrapperClass = `overflow-x-clip ${className ?? ""}`;

  const viewport = {
    once: true,
    margin: "0px 0px -60px 0px",
  };

  if (shouldReduceMotion) {
    return (
      <motion.div
        className={wrapperClass}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={viewport}
        transition={{ duration: 0.5, delay }}
      >
        {children}
      </motion.div>
    );
  }

  const { x, y } = offsets[direction];

  return (
    <motion.div
      className={wrapperClass}
      initial={{ opacity: 0, x, y, scale: 0.99 }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={viewport}
      transition={{
        x: { duration: 1.2, delay, ease: relaxedEase },
        y: { duration: 1.2, delay, ease: relaxedEase },
        scale: { duration: 1.2, delay, ease: relaxedEase },
        opacity: { duration: 0.9, delay, ease: "easeOut" },
      }}
    >
      {children}
    </motion.div>
  );
}
