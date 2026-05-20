"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const container = (stagger: number, reduce: boolean) => ({
  initial: {},
  animate: {
    transition: { staggerChildren: reduce ? 0 : stagger, delayChildren: 0.05 },
  },
});

const item = (reduce: boolean) => ({
  initial: { opacity: 0, y: reduce ? 0 : 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: reduce ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] as const },
  },
});

export function StaggerIn({
  children,
  stagger = 0.06,
  className,
  as = "div",
}: {
  children: ReactNode;
  stagger?: number;
  className?: string;
  as?: "div" | "ul" | "section" | "ol";
}) {
  const reduce = !!useReducedMotion();
  const M = motion[as] as typeof motion.div;
  return (
    <M initial="initial" animate="animate" variants={container(stagger, reduce)} className={className}>
      {children}
    </M>
  );
}

export function StaggerItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
}) {
  const reduce = !!useReducedMotion();
  const M = motion[as] as typeof motion.div;
  return (
    <M variants={item(reduce)} className={className}>
      {children}
    </M>
  );
}
