"use client";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";


interface LanguageToggleProps {
  theme?: 'light' | 'dark';
}

export const LanguageToggle = ({ theme = "light" }: LanguageToggleProps) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={`flex rounded-lg p-1 ${(theme === 'dark' ? ' bg-slate-500/80 text-white' : 'bg-muted ')}` }>
      <Button
        variant={language === 'es' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setLanguage('es')}
        className="text-xs h-8 px-3"
      >
        ES
      </Button>
      <Button
        variant={language === 'en' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setLanguage('en')}
        className="text-xs h-8 px-3"
      >
        EN
      </Button>
    </div>
  );
};