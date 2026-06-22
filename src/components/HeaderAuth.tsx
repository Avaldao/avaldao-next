"use client";

import AppkitContextProvider from "@/context/appkit-context";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { AccountDropdown } from "./account-dropdown";
import { useLanguage } from "@/context/LanguageContext";

function HeaderAuthInner() {
  const { data: session, status } = useSession();
  const { t } = useLanguage();

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
        className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition-all duration-200 hover:bg-violet-50 hover:text-violet-700"
      >
        Sign Out
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/auth/login"
        className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-violet-50 hover:text-violet-700 lg:px-4"
      >
        {t("nav.login")}
      </Link>
      <Link
        href="/auth/signup"
        className="rounded-full bg-linear-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:from-violet-700 hover:to-fuchsia-700 hover:shadow-lg hover:shadow-violet-500/40"
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
