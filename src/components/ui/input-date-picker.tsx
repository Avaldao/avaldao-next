"use client";
import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import "react-day-picker/style.css";


interface InputDatePickerProps {
  onChange?: (s: Date | undefined) => void
}

export default function InputDatePicker({ onChange }: InputDatePickerProps) {

  const [selected, setSelected] = useState<Date | undefined>(new Date());

  useEffect(() => {
    if (typeof onChange == "function") {
      onChange(selected)
    }
  }, [selected])

  return (
    <Popover className="relative">
      <PopoverButton>
        <div className="relative">
          <Input
            value={selected ? format(selected, "dd/MM/yyyy") : ""}
            className="pl-10 cursor-default"

          />
          <div className="absolute top-2 left-2">
            <Calendar className="text-secondary cursor-pointer" />
          </div>
        </div>
      </PopoverButton>
      <PopoverPanel anchor="bottom" className={"z-2 mt-3"} >
        {({ close }) => (
          <div className="bg-white text-slate-800 p-1 rounded-xl shadow-md">
            <DayPicker
              lang="en"
              animate
              mode="single"
              selected={selected}
              onSelect={(s) => {
                setSelected(s);
                close();
              }}
              disabled={{ before: new Date() }}
            />
          </div>
        )}
      </PopoverPanel>
    </Popover>
  )
}