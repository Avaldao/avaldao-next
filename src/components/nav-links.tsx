"use client";

import { Language, translations } from "@/translations";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect } from "react";

export default function NavLinks({ language }: { language: Language }) {
  const { data: session, status } = useSession();
  const isAdmin = session?.user.roles?.includes("ADMIN_ROLE") ?? false;

  const t = (key: string) => translations[key]?.[language] ?? key;

  console.log("Status de autenticación:", status);

  useEffect(() => {
    console.log("status actual:", status);
  }, [status]);

  return (
    <nav className="hidden md:flex md:items-center md:gap-1 lg:gap-2">
      {status == "authenticated" ? (
        isAdmin ? (
          <>
            <Link 
              href="/staff/users" 
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-violet-50 hover:text-violet-700 lg:px-4 lg:text-base"
            >
              {t("nav.users")}
            </Link>
            <Link 
              href="/avales" 
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-violet-50 hover:text-violet-700 lg:px-4 lg:text-base"
            >
              {t("nav.avales")}
            </Link>
          </>
        ) : (
          <Link 
            href="/avales" 
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-violet-50 hover:text-violet-700 lg:px-4 lg:text-base"
          >
            {t("nav.avales")}
          </Link>
        )
      ) : (
        <>
          <a 
            href="#que-es" 
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-violet-50 hover:text-violet-700 lg:px-4 lg:text-base"
          >
            {t("nav.about")}
          </a>
          <a 
            href="#dashboard" 
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-violet-50 hover:text-violet-700 lg:px-4 lg:text-base"
          >
            {t("nav.dashboard")}
          </a>
          <a 
            href="#invertir" 
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-violet-50 hover:text-violet-700 lg:px-4 lg:text-base"
          >
            {t("nav.invest")}
          </a>
          <a 
            href="#aval" 
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-violet-50 hover:text-violet-700 lg:px-4 lg:text-base"
          >
            {t("nav.request-aval")}
          </a>
        </>
      )}
    </nav>
  )
}