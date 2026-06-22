"use client";
import { SessionProvider } from "next-auth/react";
import NavLinks from "./nav-links";
import { Language } from "@/translations";

export default function Nav({ language }: { language: Language }) {
  return (
    <SessionProvider>
      <NavLinks language={language} />
    </SessionProvider>
  )
}