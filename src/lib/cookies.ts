// lib/cookies.ts
import { Language } from '@/translations';
import { cookies } from 'next/headers';

export async function setLanguageCookie(language: string) {
  (await cookies()).set('language', language, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
}

export async function getLanguageCookie() : Promise<Language> {
  return ((await cookies()).get('language')?.value || 'en') as Language;
}