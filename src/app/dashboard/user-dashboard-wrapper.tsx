"use client";

import { SessionProvider } from "next-auth/react";
import UserDashboard from "./user-dashboard";
import type { Language } from "@/translations";

export default function UserDashboardWrapper({ userName, language }: { userName: string; language: Language }) {
  return (
    <SessionProvider>
      <UserDashboard userName={userName} language={language} />
    </SessionProvider>
  );
}