// app/api/language/route.ts
import { NextRequest } from 'next/server';
import { setLanguageCookie } from '@/lib/cookies';

export async function POST(request: NextRequest) {
  const { language } = await request.json();
  
  await setLanguageCookie(language);
  
  return Response.json({ success: true });
}