"use client";
import { Aval } from "@/types";
import { SessionProvider } from "next-auth/react";
import AvalActions from "./aval-actions";

export default function AvalActionsWrapper({ aval }: { aval: Aval }) {
  return (
    <SessionProvider>
      <AvalActions aval={aval}/>
    </SessionProvider>
  )
}