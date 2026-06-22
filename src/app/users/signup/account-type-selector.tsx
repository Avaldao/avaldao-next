import { useLanguage } from '@/context/LanguageContext';
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { BriefcaseBusiness, PersonStanding, } from 'lucide-react';
import { ReactNode, Ref, useEffect, useState } from 'react'

export interface AccountType {
  id: number;
  name: string;
  description: string;
  icon: ReactNode;
}

const accountTypes: AccountType[] = [
  {
    id: 1,
    name: 'Personal',
    description: '',
    icon: <PersonStanding />
  },
  {
    id: 2,
    name: 'Business',
    description: '',
    icon: <BriefcaseBusiness />
  },

];

interface AccountTypeComboBoxProps {
  ref?: Ref<HTMLInputElement> | undefined;
  initialAccountType?: number;
  onAccountTypeUpdated?: (accountType: AccountType | null) => void

}

export default function AccountTypeComboBox({ initialAccountType, onAccountTypeUpdated, ref }: AccountTypeComboBoxProps) {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<AccountType | null>(initialAccountType ? accountTypes.find(accountType => accountType.id === initialAccountType) ?? null : null);

  useEffect(() => {
    if (typeof onAccountTypeUpdated == "function") {
      onAccountTypeUpdated(selected);
    }
  }, [selected]);


  return (
    <Combobox immediate value={selected} onChange={setSelected}>
      <div className="relative">
        <ComboboxInput
          ref={ref}
          className={`
              w-full
            border border-gray-300 bg-gray-50 
            pl-4 pr-10 py-2 rounded-lg 
            focus:ring-1 focus:ring-[#18b69b] focus:border-[#18b69b
            focus-visible:border-[#18b69b]
            focus-visible:outline-none 
            hidden
            `}
          aria-label="Account Type"
          value={selected ? selected.name : ""}


        />
        {/* <ComboboxButton className="absolute inset-y-0 right-0 flex items-center px-4 py-4 cursor-pointer">
          {({ open }) => (
            <ChevronUp className={`w-4 h-4 text-gray-600 stroke-3 transition-transform ${open ? 'rotate-180' : ''}`} />
          )}
        </ComboboxButton> */}
        <ComboboxOptions
          static
          className="empty:invisible 
          w-full mt-1 
          flex 
          flex-wrap
          gap-x-6 gap-y-6 justify-center
          min-h-[150px]
          bg-white
          p-4
          
          ">
          {accountTypes.map((accountType) => (
            <ComboboxOption
              key={accountType.id}
              value={accountType}
              className="
                cursor-pointer 
                data-focus:bg-gray-50 
                flex shadow-sm
                rounded-xl
                max-w-[180px]
                ">
              {({ selected }) => (
                <div className={`
                    flex flex-col items-center justify-center 
                    gap-3 min-w-[170px] min-h-[170px] p-4 ${selected ? "bg-green-200 shadow-xl" : ""} rounded-xl`}>

                  <div className={`text-slate-600 [&>svg]:w-8 [&>svg]:h-8 ${selected ? "[&>svg]:stroke-2" : "[&>svg]:stroke-1"}`}>
                    {accountType.icon}
                  </div>

                  <div className="text-slate-800 font-medium">

                    {t(`accountType.${accountType.name.toLowerCase()}.name`)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {t(`accountType.${accountType.name.toLowerCase()}.description`)}
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