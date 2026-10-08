"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { BadgeCheck, Ban, ShieldAlert, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextArea } from "@/components/ui/textarea";
import type { UserStatus, UserVerification } from "@/lib/db/models/user-model";
import type { VerificationAction } from "@/services/users-service";
import { createT, type Language } from "@/translations";

interface Props {
  userId: string;
  status: UserStatus;
  verification?: UserVerification;
  hasAddress: boolean;
  /** Solo ADMIN_ROLE puede cambiar el estado; AVALDAO_ROLE lo ve en solo lectura. */
  canEdit: boolean;
  language: Language;
}

const STATUS_STYLES: Record<UserStatus, string> = {
  active: "bg-green-50 border-green-200 text-green-800",
  pending: "bg-amber-50 border-amber-200 text-amber-800",
  rejected: "bg-red-50 border-red-200 text-red-800",
  suspended: "bg-slate-100 border-slate-300 text-slate-700",
};

// Mismas transiciones que valida UsersService.setVerification.
const ACTIONS_BY_STATUS: Record<UserStatus, VerificationAction[]> = {
  pending: ["verify", "reject"],
  rejected: ["verify"],
  suspended: ["verify"],
  active: ["suspend"],
};

export default function UserVerification({ userId, status, verification, hasAddress, canEdit, language }: Props) {
  const t = createT(language);
  const router = useRouter();
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState<VerificationAction | null>(null);

  const actions = ACTIONS_BY_STATUS[status] ?? [];

  async function submit(action: VerificationAction) {
    setSaving(action);
    try {
      const res = await fetch(`/api/users/${userId}/verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, note }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message);
      }
      toast.success(t(`staff.verification.${action}.success`));
      setNote("");
      router.refresh();
    } catch (err) {
      toast.error((err instanceof Error && err.message) || t("staff.verification.error"));
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-sm font-semibold text-gray-800">
          <BadgeCheck className="h-4 w-4" /> {t("staff.verification.title")}
        </p>
        <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}>
          {t(`staff.verification.status.${status}`)}
        </span>
      </div>

      {verification?.at && (
        <p className="text-xs text-gray-500">
          {t("staff.verification.last-change", {
            date: format(new Date(verification.at), "dd/MM/yyyy HH:mm"),
            by: verification.byAddress ?? verification.byUserId,
          })}
          {verification.note && <span className="block mt-1 italic">“{verification.note}”</span>}
        </p>
      )}

      {canEdit && (
        <>
          <p className="text-sm text-gray-600">{t("staff.verification.instructions")}</p>

          {!hasAddress && actions.includes("verify") && (
            <div className="flex items-start gap-2 rounded-md bg-amber-50 border border-amber-200 px-3 py-2 text-sm text-amber-800">
              <ShieldAlert className="h-4 w-4 mt-0.5 shrink-0" />
              {t("staff.verification.no-address")}
            </div>
          )}

          <TextArea
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t("staff.verification.note.placeholder")}
          />

          <div className="flex flex-wrap gap-2">
            {actions.includes("verify") && (
              <Button disabled={!!saving || !hasAddress} onClick={() => submit("verify")}>
                <BadgeCheck className="h-4 w-4" />
                {t("staff.verification.verify")}
              </Button>
            )}
            {actions.includes("reject") && (
              <Button
                variant="outline"
                disabled={!!saving}
                onClick={() => submit("reject")}
                className="hover:bg-red-50 hover:border-red-200 hover:text-red-600"
              >
                <XCircle className="h-4 w-4" />
                {t("staff.verification.reject")}
              </Button>
            )}
            {actions.includes("suspend") && (
              <Button
                variant="outline"
                disabled={!!saving}
                onClick={() => submit("suspend")}
                className="hover:bg-red-50 hover:border-red-200 hover:text-red-600"
              >
                <Ban className="h-4 w-4" />
                {t("staff.verification.suspend")}
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
