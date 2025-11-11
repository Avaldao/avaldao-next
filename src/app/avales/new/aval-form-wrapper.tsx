"use client";
import { SessionProvider, useSession } from "next-auth/react";
import AvalForm from "./aval-form";

export default function AvalFormWrapper({ avaldaoAddress }: { avaldaoAddress: string }) {
  return (
    <div className="mb-15">
      <SessionProvider>
        <W_ avaldaoAddress={avaldaoAddress} />
      </SessionProvider>
    </div>

  )
}

function W_({ avaldaoAddress }: { avaldaoAddress: string }) {
  const { status } = useSession();
  if (status == "authenticated")
    return <AvalForm avaldaoAddress={avaldaoAddress} />;
}

