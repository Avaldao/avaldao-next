"use client";
import { SessionProvider, useSession } from "next-auth/react";
import AvalForm, { AvalNetworkOption } from "./aval-form";
import { Language } from "@/translations";
import AppkitContextProvider from "@/context/appkit-context";

interface AvalFormWrapperProps {
  networkOptions: AvalNetworkOption[];
  initialChainId: number;
  language: Language;
}

export default function AvalFormWrapper(props: AvalFormWrapperProps) {
  return (
    <div className="mb-15">
      <AppkitContextProvider>
        <SessionProvider>
          <W_ {...props} />
        </SessionProvider>
      </AppkitContextProvider>
    </div>
  )
}

function W_(props: AvalFormWrapperProps) {
  const { status } = useSession();

  if (status == "authenticated")
    return <AvalForm {...props} />;
}
