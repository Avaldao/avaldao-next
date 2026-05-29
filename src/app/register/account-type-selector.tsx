"use client";
import { Language, translations } from '@/translations';
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { Briefcase, Check, User } from 'lucide-react';
import { ReactNode, Ref, useEffect, useMemo, useState } from 'react'

export interface AccountType {
  id: number;
  name: string;
  value: string;
  description: string;
  icon: ReactNode;
}


export const accountTypes: AccountType[] = [
  {
    id: 1,
    name: 'Personal',
    value: 'personal',
    description: 'Individual investor or applicant managing personal investments and endorsement requests',
    icon: <User />
  },
  {
    id: 2,
    name: 'Business',
    value: 'business',
    description: 'Company account to accept endorsees, offer services, and manage commercial operations',
    icon: <Briefcase />
  },
];

interface ActivitySectorComboBoxProps {
  ref?: Ref<HTMLInputElement> | undefined;
  initialType?: string;
  onTypeSelected?: (type: AccountType) => void
  language: Language;
}

export default function AccountTypeSelector({ initialType, onTypeSelected: onTypeSelected, ref, language }: ActivitySectorComboBoxProps) {

  const t = useMemo(() => (key: string) => translations[key]?.[language] ?? key, [language]);

  const [selectedType, setSelectedType] = useState<AccountType | undefined>(
    initialType ? accountTypes.find((type) => initialType.includes(type.value)) : undefined
  )

  useEffect(() => {
    if (typeof onTypeSelected == "function" && selectedType) {
      onTypeSelected(selectedType);
    }
  }, [onTypeSelected, selectedType]);


  return (
    <Combobox immediate value={selectedType} onChange={(value) => setSelectedType(value ?? undefined)}>
      <div className="relative">
        <ComboboxInput
          ref={ref}
          className="sr-only"
        />

        <ComboboxOptions
          static
          modal={false}
          className="empty:invisible grid min-h-45 w-full grid-cols-1 gap-4 rounded-2xl bg-white  sm:grid-cols-2 py-5"
        >
          {accountTypes.map((activityType) => (
            <ComboboxOption
              key={activityType.id}
              value={activityType}
              className="group cursor-pointer rounded-2xl focus:outline-none"
            >
              {({ selected }) => (
                <div
                  className={`relative flex min-h-47.5 flex-col items-start justify-between gap-4 rounded-2xl border p-5 transition-all duration-200 ease-out ${selected
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
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-xl border text-secondary transition-colors [&>svg]:h-6 [&>svg]:w-6 ${selected
                      ? "border-secondary/30 bg-secondary/10"
                      : "border-slate-200 bg-slate-50 group-hover:border-secondary/20 group-hover:bg-secondary/5"
                      }`}
                  >
                    {activityType.icon}
                  </div>

                  <div className="text-lg font-semibold text-slate-800 capitalize">

                    {t(`account-type.${activityType.value}.name`)}
                  </div>

                  <div className="text-sm leading-relaxed text-slate-500">
                    {t(`account-type.${activityType.value}.description`)}
                  </div>

                </div>

              )}
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </div>
    </Combobox>
  )
}