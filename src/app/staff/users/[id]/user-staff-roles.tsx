"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { STAFF_ROLES, type StaffRole } from "@/lib/auth/staff-roles";
import { createT, type Language } from "@/translations";

interface Props {
  userId: string;
  currentRoles: StaffRole[];
  /** Solo con permiso `users:roles`; si no, se muestran en solo lectura. */
  canEdit: boolean;
  language: Language;
}

export default function UserStaffRoles({ userId, currentRoles, canEdit, language }: Props) {
  const t = createT(language);
  const router = useRouter();
  const [selected, setSelected] = useState<StaffRole[]>(currentRoles);
  const [saving, setSaving] = useState(false);

  const hasChanges =
    selected.length !== currentRoles.length || selected.some(r => !currentRoles.includes(r));

  function toggle(role: StaffRole) {
    setSelected(prev => (prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]));
  }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch(`/api/users/${userId}/staff-roles`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roles: selected }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message);
      }
      toast.success(t("staff.platform-roles.success"));
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message || t("staff.platform-roles.error"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-4">
      <p className="text-sm font-medium text-gray-700">{t("staff.platform-roles.title")}</p>
      <div className="mt-2 rounded-xl border border-gray-200 bg-white p-4">
        <p className="text-xs text-gray-500">{t("staff.platform-roles.description")}</p>

        <div className="mt-3 flex flex-col gap-3">
          {STAFF_ROLES.map(role => (
            <label
              key={role}
              className={`flex items-start gap-2 text-sm text-gray-800 ${canEdit ? "cursor-pointer" : ""}`}
            >
              <input
                type="checkbox"
                className="mt-1"
                checked={selected.includes(role)}
                disabled={!canEdit}
                onChange={() => toggle(role)}
              />
              <span>
                <span className="flex items-center gap-1.5 font-medium">
                  <BadgeCheck className="h-3.5 w-3.5 text-gray-500" />
                  {t(`staff.platform-roles.${role}`)}
                </span>
                <span className="block text-xs text-gray-500">{t(`staff.platform-roles.${role}.description`)}</span>
              </span>
            </label>
          ))}
        </div>

        {canEdit && (
          <div className="mt-4">
            <Button size="sm" disabled={!hasChanges || saving} onClick={save}>
              {t("staff.platform-roles.save")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
