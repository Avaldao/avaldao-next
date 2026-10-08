"use client";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { Check, ChevronDown, Network } from "lucide-react";
import { AvalNetworkOption } from "./aval-form";

interface NetworkListboxProps {
  options: AvalNetworkOption[];
  value: number;
  onChange: (chainId: number) => void;
}

export default function NetworkListbox({ options, value, onChange }: NetworkListboxProps) {
  const selected = options.find((n) => n.chainId === value) ?? null;

  return (
    <Listbox name="chainId" value={selected} onChange={(network) => network && onChange(network.chainId)}>
      <ListboxButton className="relative mt-1 w-full bg-white border border-gray-200 text-slate-800 text-sm text-left rounded-xl pl-10 pr-10 py-3 cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 data-open:ring-2 data-open:ring-violet-500/30 data-open:border-violet-400 transition-all">
        <Network className="absolute left-3 top-3 text-slate-800 h-5 w-5" />
        {selected ? `${selected.name} (${selected.chainId})` : ""}
        <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-slate-500" />
      </ListboxButton>

      <ListboxOptions
        anchor="bottom start"
        transition
        className="w-(--button-width) [--anchor-gap:4px] z-50 rounded-xl border border-gray-200 bg-white p-1 shadow-lg focus:outline-none transition duration-100 ease-in data-leave:data-closed:opacity-0"
      >
        {options.map((n) => (
          <ListboxOption
            key={n.chainId}
            value={n}
            className="group flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-800 cursor-pointer select-none data-focus:bg-violet-50"
          >
            <Check className="h-4 w-4 text-violet-600 invisible group-data-selected:visible" />
            <span>{n.name}</span>
            <span className="ml-auto text-xs text-slate-400">{n.chainId}</span>
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  );
}
