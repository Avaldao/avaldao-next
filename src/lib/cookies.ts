// lib/cookies.ts
import {
  defaultLanguage,
  isLanguage,
  Language,
  LANGUAGE_COOKIE,
  LANGUAGE_HEADER,
  languageCookieOptions,
} from '@/translations/locales';
import { cookies, headers } from 'next/headers';

export async function setLanguageCookie(language: Language) {
  (await cookies()).set(LANGUAGE_COOKIE, language, languageCookieOptions);
}

/**
 * Idioma de la request actual. Lo resuelve el proxy (`src/proxy.ts`): en páginas públicas sale
 * del prefijo de la URL; en el resto, de la cookie de preferencia o del Accept-Language.
 */
export async function getLanguage(): Promise<Language> {
  const fromHeader = (await headers()).get(LANGUAGE_HEADER);
  if (isLanguage(fromHeader)) return fromHeader;

  const fromCookie = (await cookies()).get(LANGUAGE_COOKIE)?.value;
  return isLanguage(fromCookie) ? fromCookie : defaultLanguage;
}
