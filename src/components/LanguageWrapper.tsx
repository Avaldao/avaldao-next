"use client";
import { LanguageProvider } from "@/context/LanguageContext";
import { Language } from "@/translations";

interface LanguageWrapperProps {
  children: React.ReactNode;
  language: Language;
}

export default function LanguageWrapper({ children, language }: LanguageWrapperProps) {
  return (
    <LanguageProvider initialLanguage={language}>
      {children}
    </LanguageProvider >
  );
}