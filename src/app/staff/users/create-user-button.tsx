"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ResponsiveModal from "@/components/ui/responsive-modal";
import { createT, type Language } from "@/translations";

const ROLES: Array<{ value: string; labelKey: string }> = [
  { value: "SOLICITANTE_ROLE", labelKey: "signup.role.applicant.name" },
  { value: "AVALADO_ROLE", labelKey: "signup.role.endorsed.name" },
  { value: "COMERCIANTE_ROLE", labelKey: "signup.role.merchant.name" },
  { value: "INVERSOR_ROLE", labelKey: "signup.role.investor.name" },
];

type AccountType = "personal" | "business";

export default function CreateUserButton({ language }: { language: Language }) {
  const t = createT(language);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [accountType, setAccountType] = useState<AccountType>("personal");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [roles, setRoles] = useState<string[]>([]);

  const isPersonal = accountType === "personal";
  const valid =
    email.trim() !== "" &&
    (address.trim() === "" || /^0x[a-fA-F0-9]{40}$/.test(address.trim())) &&
    roles.length > 0 &&
    (isPersonal ? firstName.trim() !== "" && lastName.trim() !== "" : companyName.trim() !== "");

  function reset() {
    setAccountType("personal");
    setFirstName("");
    setLastName("");
    setCompanyName("");
    setEmail("");
    setAddress("");
    setRoles([]);
  }

  function close() {
    if (saving) return;
    setOpen(false);
  }

  function toggleRole(role: string) {
    setRoles((current) => (current.includes(role) ? current.filter((r) => r !== role) : [...current, role]));
  }

  async function submit() {
    setSaving(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountType,
          email,
          address,
          firstName,
          lastName,
          companyName,
          platformRoles: roles,
          language,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message);
      }
      toast.success(t("staff.users.create.success"));
      reset();
      setOpen(false);
      router.refresh();
    } catch (err) {
      toast.error((err instanceof Error && err.message) || t("staff.users.create.error"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <UserPlus className="h-4 w-4" />
        {t("staff.users.create.button")}
      </Button>

      {open && (
        <ResponsiveModal
          title={t("staff.users.create.title")}
          closeModal={close}
          closeOnBackdropClick={false}
          body={
            <div className="space-y-4">
              <p className="text-sm text-slate-500">{t("staff.users.create.description")}</p>

              <div className="flex gap-2">
                {(["personal", "business"] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setAccountType(type)}
                    className={`rounded-full border px-4 py-1.5 text-sm transition ${
                      accountType === type
                        ? "border-slate-300 bg-slate-100 text-slate-900"
                        : "border-transparent text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {t(`staff.users.create.type.${type}`)}
                  </button>
                ))}
              </div>

              {isPersonal ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label required>{t("staff.users.create.first-name")}</Label>
                    <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  </div>
                  <div>
                    <Label required>{t("staff.users.create.last-name")}</Label>
                    <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
                  </div>
                </div>
              ) : (
                <div>
                  <Label required>{t("staff.users.create.company-name")}</Label>
                  <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                </div>
              )}

              <div>
                <Label required>{t("staff.users.col.email")}</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              <div>
                <Label>{t("staff.users.col.address")}</Label>
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="0x..."
                  className="font-mono"
                  error={address.trim() !== "" && !/^0x[a-fA-F0-9]{40}$/.test(address.trim()) ? t("staff.users.create.address-invalid") : undefined}
                />
              </div>

              <div>
                <Label required>{t("staff.users.col.roles")}</Label>
                <div className="flex flex-wrap gap-2">
                  {ROLES.map((role) => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => toggleRole(role.value)}
                      className={`rounded-full border px-3 py-1.5 text-sm transition ${
                        roles.includes(role.value)
                          ? "border-secondary bg-secondary text-white"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {t(role.labelKey)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          }
          buttons={
            <>
              <Button variant="outline" onClick={close} disabled={saving}>
                {t("staff.users.create.cancel")}
              </Button>
              <Button onClick={submit} disabled={!valid || saving} loading={saving}>
                {t("staff.users.create.submit")}
              </Button>
            </>
          }
        />
      )}
    </>
  );
}
