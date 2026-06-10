"use client";

import { useSession } from "next-auth/react";

export default function UserDashboard() {
  const { data: session } = useSession();
  const user = session?.user;

  
  return (
    <div className="text-slate-700">
      <h1 className="text-2xl font-bold">User Dashboard</h1>
      <p>Welcome to your dashboard, {user?.name}!</p>

      {/* User required roles? */}
      

    </div>
  )
}