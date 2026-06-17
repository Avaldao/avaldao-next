"use client";
import { Aval } from "@/types";
import { SessionProvider } from "next-auth/react";
import AvalActions from "./aval-actions";
import { LanguageProvider } from "@/context/LanguageContext";
import { Language } from "@/translations";


export default function AvalActionsWrapper({ aval, language }: { aval: Aval; language: Language }) {

  return (
    <LanguageProvider initialLanguage={language}>
      <SessionProvider>
        <AvalActions aval={aval}/>
      </SessionProvider>
    </LanguageProvider>
  )
}