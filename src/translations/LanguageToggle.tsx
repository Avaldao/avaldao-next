"use client";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";


interface LanguageToggleProps {
  theme?: 'light' | 'dark';
}

export const LanguageToggle = ({ theme = "light" }: LanguageToggleProps) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 rounded-full border border-violet-200/50 bg-white/80 p-1 shadow-sm backdrop-blur-sm">
      <button
        onClick={() => setLanguage('es')}
        className={`
          h-8 rounded-full px-3 text-xs font-semibold uppercase tracking-wide transition-all duration-200
          ${language === 'es' 
            ? 'bg-linear-to-r from-violet-600 to-fuchsia-600 text-white shadow-md shadow-violet-500/30' 
            : 'text-slate-600 hover:bg-violet-50 hover:text-violet-700'}
        `}
      >
        ES
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`
          h-8 rounded-full px-3 text-xs font-semibold uppercase tracking-wide transition-all duration-200
          ${language === 'en' 
            ? 'bg-linear-to-r from-violet-600 to-fuchsia-600 text-white shadow-md shadow-violet-500/30' 
            : 'text-slate-600 hover:bg-violet-50 hover:text-violet-700'}
        `}
      >
        EN
      </button>
    </div>
  );
};