"use client";
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from "@headlessui/react";
import { BadgeCheck, Check, FileSearch, Store, TrendingUp } from "lucide-react";
import { ReactNode, Ref, useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Language, translations } from "@/translations";

export interface PlatformRole {
  id: number;
  value: string;
  nameKey: string;
  descKey: string;
  icon: ReactNode;
}

const platformRoles: PlatformRole[] = [
  {
    id: 1,
    value: "SOLICITANTE_ROLE",
    nameKey: "signup.role.applicant.name",
    descKey: "signup.role.applicant.description",
    icon: <FileSearch />,
  },
  {
    id: 2,
    value: "AVALADO_ROLE",
    nameKey: "signup.role.endorsed.name",
    descKey: "signup.role.endorsed.description",
    icon: <BadgeCheck />,
  },
  {
    id: 3,
    value: "COMERCIANTE_ROLE",
    nameKey: "signup.role.merchant.name",
    descKey: "signup.role.merchant.description",
    icon: <Store />,
  },
  {
    id: 4,
    value: "INVERSOR_ROLE",
    nameKey: "signup.role.investor.name",
    descKey: "signup.role.investor.description",
    icon: <TrendingUp />,
  },
];

interface PlatformRoleSelectorProps {
  ref?: Ref<HTMLInputElement>;
  initialRoles?: string[];
  onRolesSelected?: (roles: PlatformRole[]) => void;
  language: Language;
}

export default function PlatformRoleSelector({
  initialRoles,
  onRolesSelected,
  ref,
  language,
}: PlatformRoleSelectorProps) {
  const t = useMemo(() => (key: string) => translations[key]?.[language] ?? key, [language]);

  const [selectedRoles, setSelectedRoles] = useState<PlatformRole[]>(
    !initialRoles ? [] : platformRoles.filter((r) => initialRoles.includes(r.value))
  );

  useEffect(() => {
    if (typeof onRolesSelected === "function") {
      onRolesSelected(selectedRoles);
    }
  }, [onRolesSelected, selectedRoles]);

  return (
    <Combobox immediate multiple value={selectedRoles} onChange={setSelectedRoles}>
      <div className="relative">
        <ComboboxInput ref={ref} className="sr-only" />
        <ComboboxOptions
          static
          modal={false}
          className="empty:invisible mt-3 grid w-full grid-cols-1 gap-4 rounded-2xl border border-slate-200/80 bg-linear-to-br from-slate-50 via-white to-slate-100 p-4 shadow-inner sm:grid-cols-4 sm:p-5"
        >
          {platformRoles.map((role) => (
            <ComboboxOption
              key={role.id}
              value={role}
              className="group flex cursor-pointer flex-col rounded-2xl focus:outline-none"
            >
              {({ selected }) => (
                <div
                  className={`relative flex h-full flex-col items-start gap-3 rounded-2xl border p-5 transition-all duration-200 ease-out ${
                    selected
                      ? "border-secondary/40 bg-white shadow-[0_14px_32px_-16px_rgba(120,104,229,0.55)]"
                      : "border-slate-200 bg-white/85 hover:-translate-y-0.5 hover:border-secondary/25 hover:shadow-[0_12px_24px_-16px_rgba(15,23,42,0.4)]"
                  }`}
                >
                  {selected && (
                    <span className="absolute right-4 top-4 inline-flex h-6 w-6 items-center justify-center rounded-full border border-secondary/20 bg-secondary/10 text-secondary">
                      <Check className="h-4 w-4" />
                    </span>
                  )}

                  <div
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-xl border text-secondary transition-colors [&>svg]:h-6 [&>svg]:w-6 ${
                      selected
                        ? "border-secondary/30 bg-secondary/10"
                        : "border-slate-200 bg-slate-50 group-hover:border-secondary/20 group-hover:bg-secondary/5"
                    }`}
                  >
                    {role.icon}
                  </div>

                  <div className="text-base font-semibold text-slate-800">{t(role.nameKey)}</div>

                  <div className="text-sm leading-relaxed text-slate-500">{t(role.descKey)}</div>
                </div>
              )}
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </div>
    </Combobox>
  );
}
