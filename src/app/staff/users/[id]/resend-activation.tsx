"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createT, type Language } from "@/translations";

export default function ResendActivation({ userId, language }: { userId: string; language: Language }) {
  const t = createT(language);
  const [sending, setSending] = useState(false);

  async function resend() {
    setSending(true);
    try {
      const res = await fetch(`/api/users/${userId}/activation`, { method: "POST" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message);
      }
      toast.success(t("staff.users.resend.success"));
    } catch (err) {
      toast.error((err instanceof Error && err.message) || t("staff.users.resend.error"));
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
      <div>
        <p className="text-sm font-semibold text-amber-800">{t("staff.users.resend.title")}</p>
        <p className="text-sm text-amber-800">{t("staff.users.resend.description")}</p>
      </div>
      <Button onClick={resend} disabled={sending} loading={sending}>
        <Mail className="h-4 w-4" />
        {t("staff.users.resend.button")}
      </Button>
    </div>
  );
}
