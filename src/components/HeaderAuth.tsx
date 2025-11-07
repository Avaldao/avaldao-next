"use client";

import AppkitContextProvider from "@/context/appkit-context";
import { SessionProvider } from "next-auth/react";
import WalletAuth from "./wallet-auth";

export default function HeaderAuth() {
  return (
    <AppkitContextProvider>
      <SessionProvider>
        <WalletAuth />
      </SessionProvider>
    </AppkitContextProvider>
  )
}