"use client";

import { LayoutDashboard } from "lucide-react";
import { createT, type Language } from "@/translations";

function getGreeting(t: ReturnType<typeof createT>) {
  const hour = new Date().getHours();
  if (hour < 12) return t("dashboard.greeting.morning");
  if (hour < 19) return t("dashboard.greeting.afternoon");
  return t("dashboard.greeting.evening");
}

function formatDate(language: Language) {
  return new Date().toLocaleDateString(language === "en" ? "en-US" : "es-AR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function UserDashboard({ userName, language }: { userName: string; language: Language }) {
  const t = createT(language);
  const firstName = userName.split(" ")[0];

  return (
    <div className="border-b border-slate-100 pb-4 sm:pb-6">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
          <LayoutDashboard className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider sm:tracking-widest text-slate-400">
            {formatDate(language)}
          </p>
          <h1 className="mt-0.5 text-xl sm:text-2xl font-bold text-slate-800">
            {getGreeting(t)}{firstName ? `, ${firstName}` : ""}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {t("dashboard.subtitle.admin")}
          </p>
        </div>
      </div>
    </div>
  );
}