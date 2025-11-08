"use client";
import { Copy } from "lucide-react";
import { useState } from "react";

export default function CopyAddress({ address }: { address: string }) {

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
    <div className="relative inline ml-3">
      <button
        onClick={handleCopy}
        title="Copy"
        className="bg-violet-800 p-2 text-white rounded-full cursor-pointer">
        <Copy className="w-3 h-3" />
      </button>
      {copied && (
        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 
                         bg-gray-800 text-white text-xs px-2 py-1 rounded shadow">
          Copied!
        </span>
      )}
    </div>
  )
}