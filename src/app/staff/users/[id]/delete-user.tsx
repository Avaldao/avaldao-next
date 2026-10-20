"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createT, type Language } from "@/translations";

interface Props {
  userId: string;
  userName: string;
  language: Language;
}

export default function DeleteUser({ userId, userName, language }: Props) {
  const t = createT(language);
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function remove() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/users/${userId}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message);
      }
      toast.success(t("staff.users.delete.success"));
      router.push("/staff/users");
      router.refresh();
    } catch (err) {
      toast.error((err instanceof Error && err.message) || t("staff.users.delete.error"));
      setDeleting(false);
    }
  }

  return (
    <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
      <p className="text-sm font-semibold text-red-800">{t("staff.users.delete.title")}</p>
      <p className="text-sm text-red-800">{t("staff.users.delete.description")}</p>

      {confirming ? (
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-red-900">{t("staff.users.delete.confirm", { name: userName })}</span>
          <Button variant="destructive" size="sm" onClick={remove} disabled={deleting} loading={deleting}>
            {t("staff.users.delete.confirm-button")}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setConfirming(false)} disabled={deleting}>
            {t("staff.users.delete.cancel")}
          </Button>
        </div>
      ) : (
        <div className="mt-3">
          <Button variant="destructive" size="sm" onClick={() => setConfirming(true)}>
            <Trash2 className="h-4 w-4" />
            {t("staff.users.delete.button")}
          </Button>
        </div>
      )}
    </div>
  );
}
