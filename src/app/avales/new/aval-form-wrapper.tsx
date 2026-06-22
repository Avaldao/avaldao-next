"use client";
import { SessionProvider, useSession } from "next-auth/react";
import AvalForm from "./aval-form";
import { useLanguage } from "@/context/LanguageContext";
import { Language } from "@/translations";

export default function AvalFormWrapper({ avaldaoAddress, language }: { avaldaoAddress: string, language: Language }) {
  return (
    <div className="mb-15">
      <SessionProvider>
        <W_ avaldaoAddress={avaldaoAddress} language={language} />
      </SessionProvider>
    </div>
  )
}

function W_({ avaldaoAddress, language }: { avaldaoAddress: string, language: Language }) {
  const { status } = useSession();

  if (status == "authenticated")
    return <AvalForm avaldaoAddress={avaldaoAddress} language={language} />;
}

