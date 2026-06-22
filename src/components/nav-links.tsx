"use client";

import { Language, translations } from "@/translations";
import { useSession } from "next-auth/react";
import Link from "next/link";

const linkClass = "rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-violet-50 hover:text-violet-700 lg:px-4 lg:text-base";

export default function NavLinks({ language }: { language: Language }) {
  const { data: session, status } = useSession();
  const nroles = session?.user?.nroles;
  const isAdmin =
    nroles?.[30]?.includes("ADMIN_ROLE") ||
    nroles?.[31]?.includes("ADMIN_ROLE") ||
    false;

  const t = (key: string) => translations[key]?.[language] ?? key;

  return (
    <nav className="hidden md:flex md:items-center md:gap-1 lg:gap-2">
      {status == "authenticated" ? (
        <>
          <Link href="/dashboard" className={linkClass}>
            {t("nav.dashboard")}
          </Link>
          {isAdmin && (
            <Link href="/staff/users" className={linkClass}>
              {t("nav.users")}
            </Link>
          )}
        </>
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
          <Link
            href="/invertir"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-violet-50 hover:text-violet-700 lg:px-4 lg:text-base"
          >
            {t("nav.invest")}
          </Link>
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