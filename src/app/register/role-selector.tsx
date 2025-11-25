"use client";
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { BadgeCheck, Briefcase, Check, ChevronUp, Factory, FileSearch, Store, Trees, TrendingUp, Truck, User } from 'lucide-react';
import { ReactNode, Ref, useEffect, useState } from 'react'

export interface AccountRole {
  id: number;
  name: string;
  value: string;
  description: string;
  icon: ReactNode;
}


const roles: AccountRole[] = [
  {
    id: 1,
    name: 'Investor',
    value: 'investor',
    description: 'Provide capital for projects and investment opportunities',
    icon: <TrendingUp />
  },
  {
    id: 2,
    name: 'merchant',
    value: 'merchant', 
    description: 'Sell products/services and accept endorsees on Avaldao platform',
    icon: <Store />
  },
   {
    id: 3,
    name: 'applicant',
    value: 'applicant',
    description: 'Submit endorsement requests and applications on behalf of endorsed users',
    icon: <FileSearch />
  },
   {
    id: 4,
    name: 'endorsed',
    value: 'endorsed',
    description: 'Receive endorsements and verification through platform applicants',
    icon: <BadgeCheck />
  },
];

interface ActivitySectorComboBoxProps {
  ref?: Ref<HTMLInputElement> | undefined;
  initialRoles?: string[];
  onSelectedRoles?: (roles: AccountRole[]) => void

}

export default function RolesSelector({ initialRoles, onSelectedRoles: onSelectedRoles, ref }: ActivitySectorComboBoxProps) {
  const t  = (key: string) => (key);
  const [selectedRoles, setSelectedRoles] = useState<any[]>(!initialRoles ? [] : roles.filter(type => initialRoles.includes(type.value)))

  useEffect(() => {
    if (typeof onSelectedRoles == "function") {
      onSelectedRoles(selectedRoles);
    }
  }, [selectedRoles]);


  return (
    <Combobox immediate multiple value={selectedRoles} onChange={setSelectedRoles}>
      <div className="relative">
    
        <ComboboxOptions
          static
          className="empty:invisible 
          w-full mt-1 
          flex 
          flex-wrap
          gap-2 gap-x-6 justify-center 
          min-h-[150px]
          bg-white
          p-4
          
          
          ">
          {roles.map((sector) => (
            <ComboboxOption
              key={sector.id}
              value={sector}
              className="
                cursor-pointer 
                hover:shadow-violet-500/50
                hover:shadow-lg
                flex shadow-md
                rounded-xl
                max-w-[180px]
                ">
              {({ selected }) => (
                <div className={`
                    flex flex-col items-center justify-center 
                    gap-3 min-w-[170px] min-h-[170px] p-4 ${selected ? "bg-violet-100 shadow-xl border border-violet-400" : "border border-gray-50"} rounded-xl`}>

                  <div className={`text-violet-600 [&>svg]:w-8 [&>svg]:h-8 ${selected ? "[&>svg]:stroke-2" : "[&>svg]:stroke-1"}`}>
                    {sector.icon}
                  </div>

                  <div className="text-slate-700 font-medium capitalize">
                    {t(`${sector.name.toLowerCase()}`)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {sector.description}
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