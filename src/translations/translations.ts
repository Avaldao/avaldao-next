interface Translations {
  [key: string]: {
    es: string;
    en: string;
  };
}

export type Language = 'es' | 'en';


export const translate = (language: Language) => {
  return (key: string): string => {
    return translations[key]?.[language] ?? key;
  }
}

//const t = translate("en");
//t("nav.home")



export const translations: Translations = {
  'nav.home': {
    es: 'Inicio',
    en: 'Home'
  },
  'features.security.title': {
    es: 'Seguridad',
    en: 'Security'
  },
  'features.security.description': {
    es: 'Las personas y empresas avaladas cuentan con una reputación inmutable, creada por terceras partes de confianza',
    en: 'Endorsed people and companies have an immutable reputation, created by trusted third parties'
  },
   'features.autonomy.title': {
    es: 'Seguridad',
    en: 'Security'
  },
  'features.autonomy.description': {
    es: 'Las personas y empresas avaladas cuentan con una reputación inmutable, creada por terceras partes de confianza',
    en: 'Endorsed people and companies have an immutable reputation, created by trusted third parties'
  },
   'features.transparency.title': {
    es: 'Seguridad',
    en: 'Security'
  },
  'features.transparency.description': {
    es: 'Las personas y empresas avaladas cuentan con una reputación inmutable, creada por terceras partes de confianza',
    en: 'Endorsed people and companies have an immutable reputation, created by trusted third parties'
  }
}