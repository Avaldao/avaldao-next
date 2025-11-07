"use client";
import { SessionProvider } from "next-auth/react";
import NavLinks from "./nav-links";

export default function Nav() {
  return (
    <SessionProvider>
      <NavLinks />
    </SessionProvider>
  )
}