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
    <nav className="hidden md:flex space-x-8">
      {status == "authenticated" ? (
        isAdmin ? (
          <>
            <Link href="/staff/users" className="text-gray-600 hover:text-slate-800" >
              {t("nav.users")}
            </Link>
            <Link href="/avales" className="text-gray-600 hover:text-slate-800" >
              {t("nav.avales")}
            </Link>
          </>
        ) : (
          <Link href="/avales" className="text-gray-600 hover:text-slate-800" >
            {t("nav.avales")}
          </Link>
        )
      ) : (
        <>
          <a href="#que-es" className="text-gray-600 hover:text-slate-800">{t("nav.about")}</a>
          <a href="#dashboard" className="text-gray-600 hover:text-slate-800">{t("nav.dashboard")}</a>
          <a href="#invertir" className="text-gray-600 hover:text-slate-800">{t("nav.invest")}</a>
          <a href="#aval" className="text-gray-600 hover:text-slate-800">{t("nav.request-aval")}</a>
        </>
      )}
    </nav>
  )
}