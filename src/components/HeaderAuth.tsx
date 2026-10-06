"use client";

import AppkitContextProvider from "@/context/appkit-context";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { AccountDropdown } from "./account-dropdown";
import { useLanguage } from "@/context/LanguageContext";
import { useAppKit } from "@reown/appkit/react";

function HeaderAuthInner() {
  const { data: session, status } = useSession();
  const { t } = useLanguage();
  const { open } = useAppKit();

  if (status === "loading") return null;

  if (status === "authenticated") {
    const address = session?.user?.address;
    if (address) {
      return (
        <AnimatePresence>
          <AccountDropdown address={address} />
        </AnimatePresence>
      );
    }
    return (
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition-all duration-200 hover:bg-violet-50 hover:text-violet-700"
      >
        Sign Out
      </button >
    );
  }

  // En mobile login/signup están dentro del menú hamburguesa.
  return (
    <div className="hidden items-center gap-2 lg:flex">
      <Link
        href="/auth/login"
        className="whitespace-nowrap rounded-lg px-2 py-2 text-sm font-medium sm:px-3 text-slate-700 transition-all duration-200 hover:bg-violet-50 hover:text-violet-700 lg:px-4"
      >
        {t("nav.login")}
      </Link>
      <Link
        href="/auth/signup"
        className="whitespace-nowrap rounded-full bg-linear-to-r from-violet-600 to-fuchsia-600 px-3 py-2 sm:px-4 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:from-violet-700 hover:to-fuchsia-700 hover:shadow-lg hover:shadow-violet-500/40"
      >
        {t("nav.signup")}
      </Link>
    </div>
  );
}

export default function HeaderAuth() {
  return (
    <AppkitContextProvider>
      <SessionProvider>
        <HeaderAuthInner />
      </SessionProvider>
    </AppkitContextProvider>
  );
}
