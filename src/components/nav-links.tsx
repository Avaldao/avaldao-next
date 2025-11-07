"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function NavLinks() {
  const { data: session, status } = useSession();
  const isAdmin = session?.user.roles?.includes("ADMIN_ROLE") ?? false;

  if (status == "authenticated") {
    if (isAdmin) {
      return (
        <nav className="hidden md:flex space-x-8">
          <Link href="/admin/users" className="text-gray-600 hover:text-slate-800" >
            Usuarios
          </Link>
          <Link href="/avales" className="text-gray-600 hover:text-slate-800" >
            Avales
          </Link>

        </nav>
      )
    } else {
      return (
        <nav className="hidden md:flex space-x-8">
          <Link href="/avales" className="text-gray-600 hover:text-slate-800" >
            Avales
          </Link>

        </nav>
      )
    }

  }

  return (
    <nav className="hidden md:flex space-x-8">
      <a href="#que-es" className="text-gray-600 hover:text-slate-800">Qué es</a>
      <a href="#dashboard" className="text-gray-600 hover:text-slate-800">Dashboard</a>
      <a href="#invertir" className="text-gray-600 hover:text-slate-800">Invertir</a>
      <a href="#aval" className="text-gray-600 hover:text-slate-800">Solicitar Aval</a>
    </nav>
  )
}