"use client"

import { motion, type Variants } from "framer-motion"
import type { ReactNode } from "react"

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
}

const staggerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
}

const viewport = { once: true, margin: "-80px" }

interface Props {
  children: ReactNode
  className?: string
  id?: string
}

export function FadeIn({ children, className, id, delay = 0 }: Props & { delay?: number }) {
  return (
    <motion.div
      id={id}
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
      viewport={viewport}
    >
      {children}
    </motion.div>
  )
}

export function StaggerContainer({ children, className }: Props) {
  return (
    <motion.div
      className={className}
      variants={staggerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className }: Props) {
  return (
    <motion.div className={className} variants={fadeUpVariants}>
      {children}
    </motion.div>
  )
}
