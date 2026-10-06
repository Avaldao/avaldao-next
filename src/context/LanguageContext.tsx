"use client"
import { Language, translations } from '@/translations';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useState, ReactNode } from 'react';


interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
}


export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

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

  const [language, setLanguageState] = useState<Language>(initialLanguage);
  const [prevInitialLanguage, setPrevInitialLanguage] = useState<Language>(initialLanguage);

  // El idioma lo define el servidor (URL o cookie); se sincroniza cuando cambia, ej. tras navegar o refrescar.
  if (initialLanguage !== prevInitialLanguage) {
    setPrevInitialLanguage(initialLanguage);
    setLanguageState(initialLanguage);
  }

  // Cambia la preferencia guardada en cookie. Para las páginas públicas con idioma en la URL,
  // LanguageToggle navega a la URL del otro idioma en lugar de usar esto.
  async function setLanguage(newLanguage: Language) {
    setLanguageState(newLanguage);

    const response = await fetch('/api/language', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ language: newLanguage }),
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