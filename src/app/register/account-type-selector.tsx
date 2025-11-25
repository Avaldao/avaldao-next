"use client";
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { Briefcase, Check, ChevronUp, Factory, Trees, Truck, User } from 'lucide-react';
import { ReactNode, Ref, useEffect, useState } from 'react'

export interface AccountType {
  id: number;
  name: string;
  value: string;
  description: string;
  icon: ReactNode;
}


const accountTypes: AccountType[] = [
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

}

export default function AccountTypeSelector({ initialType, onTypeSelected: onTypeSelected, ref }: ActivitySectorComboBoxProps) {
  const t = (key: string) => (key);
  const [selectedType, setSelectedType] = useState<any>(initialType ? accountTypes.find(type => initialType.includes(type.value)) : undefined)

  useEffect(() => {
    if (typeof onTypeSelected == "function") {
      console.log("selectedType", selectedType)
      onTypeSelected(selectedType);
    }
  }, [selectedType]);


  return (
    <Combobox immediate value={selectedType} onChange={setSelectedType}>
      <div className="relative">

        <ComboboxOptions
          static
          className="empty:invisible 
          w-full mt-1 
          flex 
          flex-wrap
          gap-2 sm:gap-x-6 justify-center 
          min-h-[150px]
          bg-white
          p-4
          
          
          ">
          {accountTypes.map((sector) => (
            <ComboboxOption
              key={sector.id}
              value={sector}
              className="
                cursor-pointer 
                hover:shadow-violet-500/50
                hover:shadow-lg
                flex shadow-md
                rounded-xl
                max-w-[200px]
                ">
              {({ selected }) => (
                <div className={`
                    flex flex-col items-center justify-center 
                    gap-3 min-w-[180px] min-h-[170px] p-4 ${selected ? "bg-violet-100 shadow-xl border border-violet-400" : "border border-gray-50"} rounded-xl`}>

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