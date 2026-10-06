"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { getPathLanguage, Language, languages, switchPathLanguage } from "@/translations/locales";


interface LanguageToggleProps {
  theme?: 'light' | 'dark';
}

const optionClass = (active: boolean) => `
  flex h-7 w-9 items-center justify-center rounded-full text-[11px] font-semibold uppercase tracking-wider
  transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400
  ${active
    ? 'bg-white text-violet-700 shadow-sm ring-1 ring-violet-200'
    : 'text-slate-500 hover:text-violet-700'}
`;

export const LanguageToggle = ({ theme = "light" }: LanguageToggleProps) => {
  const { language, setLanguage } = useLanguage();
  const pathname = usePathname();
  // En páginas públicas el idioma va en la URL: el toggle es un link a la versión en el otro idioma.
  const isLocalizedPage = getPathLanguage(pathname) !== null;

  const renderOption = (lang: Language) => {
    const active = language === lang;

    if (isLocalizedPage) {
      return (
        <Link
          key={lang}
          href={switchPathLanguage(pathname, lang)}
          hrefLang={lang}
          aria-current={active ? 'true' : undefined}
          className={optionClass(active)}
        >
          {lang}
        </Link>
      );
    }

    return (
      <button key={lang} type="button" onClick={() => setLanguage(lang)} aria-pressed={active} className={optionClass(active)}>
        {lang}
      </button>
    );
  };

  return (
    <div className="flex items-center gap-0.5 rounded-full bg-slate-100/80 p-0.5 ring-1 ring-slate-200/70 backdrop-blur-sm">
      {languages.map(renderOption)}
    </div>
  );
};
