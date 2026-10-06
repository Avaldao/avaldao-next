"use client";
import React, { useEffect, useState } from "react";
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
            compactError

          />
          <div className="absolute top-2 left-2">
            <Calendar className="text-secondary cursor-pointer" />
          </div>
        </div>
      </PopoverButton>
      <PopoverPanel anchor={{ to: "bottom start", gap: 8, padding: 16 }} className="z-50">
        {({ close }) => (
          <div className="bg-white text-slate-800 p-2 rounded-xl border border-gray-200 shadow-lg">
            <DayPicker
              lang="en"
              style={{
                "--rdp-accent-color": "var(--color-violet-600)",
                "--rdp-accent-background-color": "var(--color-violet-50)",
                "--rdp-day-width": "34px",
                "--rdp-day-height": "34px",
                "--rdp-day_button-width": "32px",
                "--rdp-day_button-height": "32px",
              } as React.CSSProperties}
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