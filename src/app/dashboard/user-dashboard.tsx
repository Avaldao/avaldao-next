"use client";

import { LayoutDashboard } from "lucide-react";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Buenos días";
  if (hour < 19) return "Buenas tardes";
  return "Buenas noches";
}

function formatDate() {
  return new Date().toLocaleDateString("es-AR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function UserDashboard({ userName }: { userName: string }) {
  const firstName = userName.split(" ")[0];

  return (
    <div className="border-b border-slate-100 pb-6">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
          <LayoutDashboard className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-slate-400">
            {formatDate()}
          </p>
          <h1 className="mt-0.5 text-2xl font-bold text-slate-800">
            {getGreeting()}{firstName ? `, ${firstName}` : ""}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Plataforma Avaldao · Panel de administración
          </p>
        </div>
      </div>
    </div>
  );
}