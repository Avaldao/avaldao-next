"use client";
import { Aval } from "@/types";
import { SessionProvider } from "next-auth/react";
import AvalActions from "./aval-actions";
import { LanguageProvider } from "@/context/LanguageContext";
import { Language } from "@/translations";
import { AvalRoleEnum } from "@/services/avales-service";


export default function AvalActionsWrapper({ aval, language, unverifiedRoles }: { aval: Aval; language: Language; unverifiedRoles: AvalRoleEnum[] }) {

  return (
    <LanguageProvider initialLanguage={language}>
      <SessionProvider>
        <AvalActions aval={aval} unverifiedRoles={unverifiedRoles}/>
      </SessionProvider>
    </LanguageProvider>
  )
}