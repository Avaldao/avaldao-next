"use client";
import { motion } from "framer-motion";

export default function DashboardAnimation(){
  return (
    <motion.div
      className="bg-[url(/images/guarantee-fund-n.png)]  w-full max-w-[300px] h-[283px] absolute bottom-6/12 right-5 z-0 opacity-50 hidden md:block"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
    >
    </motion.div>

  )
}