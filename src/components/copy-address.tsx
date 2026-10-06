"use client";
import { Copy } from "lucide-react";
import { useState } from "react";
import { createT, type Language } from "@/translations";

export default function CopyAddress({ address, className = "ml-3", language = "es" }: { address: string; className?: string; language?: Language }) {
  const t = createT(language);

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(address).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }).catch(err => {
      console.error("Failed to copy:", err);
    });
  }


  return (
    <div className={`relative inline ${className}`}>
      <button
        onClick={handleCopy}
        title={t("common.copy")}
        className="p-1.5 text-slate-500 hover:text-slate-700 cursor-pointer transition-colors">
        <Copy className="w-3 h-3" />
      </button>
      {copied && (
        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 
                         bg-gray-800 text-white text-xs px-2 py-1 rounded shadow">
          {t("common.copied")}
        </span>
      )}
    </div>
  )
}