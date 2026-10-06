// app/api/language/route.ts
import { NextRequest } from 'next/server';
import { setLanguageCookie } from '@/lib/cookies';
import { isLanguage } from '@/translations/locales';

export async function POST(request: NextRequest) {
  const { language } = await request.json();

  if (!isLanguage(language)) {
    return Response.json({ success: false, error: 'Invalid language' }, { status: 400 });
  }

  await setLanguageCookie(language);

  return Response.json({ success: true });
}
