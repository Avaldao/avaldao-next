"use client"
import { Language, translations } from '@/translations';
import { usePathname, useRouter } from 'next/navigation';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';


interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
}


const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
  initialLanguage: Language;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children, initialLanguage }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [language, setLanguage] = useState<Language>(initialLanguage);

  useEffect(() => {
    updateLanguage(language)
  }, [language]);

  async function updateLanguage(language: string) {
    const response = await fetch('/api/language', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ language: language }),
    });

    if (response.ok) {
      router.refresh();
    }

  }

  const t = (key: string, params?: Record<string, string>): string => {
    let value = translations[key]?.[language] || key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        value = value.replace(new RegExp(`{{${k}}}`, 'g'), v);
      });
    }
    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};