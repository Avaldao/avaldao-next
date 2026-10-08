"use client";
import { SessionProvider } from "next-auth/react";
import NavLinks from "./nav-links";
import { Language } from "@/translations";

export default function Nav({ language, chainIds }: { language: Language; chainIds: number[] }) {
  return (
    <SessionProvider>
      <NavLinks language={language} chainIds={chainIds} />
    </SessionProvider>
  )
}