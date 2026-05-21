"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect } from "react";

export default function NavLinks() {
  const { data: session, status } = useSession();
  const isAdmin = session?.user.roles?.includes("ADMIN_ROLE") ?? false;
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
              Usuarios
            </Link>
            <Link href="/avales" className="text-gray-600 hover:text-slate-800" >
              Avales
            </Link>
          </>
        ) : (
          <Link href="/avales" className="text-gray-600 hover:text-slate-800" >
            Avales
          </Link>
        )
      ) : (
        <>
          <a href="#que-es" className="text-gray-600 hover:text-slate-800">Qué es</a>
          <a href="#dashboard" className="text-gray-600 hover:text-slate-800">Dashboard</a>
          <a href="#invertir" className="text-gray-600 hover:text-slate-800">Invertir</a>
          <a href="#aval" className="text-gray-600 hover:text-slate-800">Solicitar Aval</a>
        </>
      )}
    </nav>
  )
}