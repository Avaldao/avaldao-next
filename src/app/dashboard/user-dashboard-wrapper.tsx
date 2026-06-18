"use client";

import { SessionProvider } from "next-auth/react";
import UserDashboard from "./user-dashboard";

export default function UserDashboardWrapper({ userName }: { userName: string }) {
  return (
    <SessionProvider>
      <UserDashboard userName={userName} />
    </SessionProvider>
  );
}