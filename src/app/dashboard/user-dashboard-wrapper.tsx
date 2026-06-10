"use client";

import { SessionProvider } from "next-auth/react";
import UserDashboard from "./user-dashboard";

export default function UserDashboardWrapper() {

  return (
    <SessionProvider>
      <UserDashboard />
    </SessionProvider>
  )
}