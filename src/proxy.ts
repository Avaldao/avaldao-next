import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import {
  defaultLanguage,
  getPathLanguage,
  isLanguage,
  isLocalizedPath,
  Language,
  LANGUAGE_COOKIE,
  LANGUAGE_HEADER,
  languageCookieOptions,
  localizeHref,
  matchAcceptLanguage,
} from "@/translations/locales";

const protectedPaths = [
  "/avales",
  "/guarantees",
  "/dashboard",
  "/staff",
  "/user",
  "/blockchain",
];

function isProtectedPath(pathname: string) {
  return protectedPaths.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

function detectLanguage(req: NextRequest): Language {
  const fromCookie = req.cookies.get(LANGUAGE_COOKIE)?.value;
  if (isLanguage(fromCookie)) return fromCookie;
  return matchAcceptLanguage(req.headers.get("accept-language")) ?? defaultLanguage;
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const pathLanguage = getPathLanguage(pathname);

  // Página pública sin prefijo (ej. "/"): redirige a la versión del idioma preferido.
  if (!pathLanguage && isLocalizedPath(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = localizeHref(pathname, detectLanguage(req));
    return NextResponse.redirect(url);
  }

  if (isProtectedPath(pathname)) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }
  }

  const language = pathLanguage ?? detectLanguage(req);
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set(LANGUAGE_HEADER, language);

  const response = NextResponse.next({ request: { headers: requestHeaders } });

  // Visitar una URL con idioma la convierte en la preferencia, así las páginas privadas siguen en ese idioma.
  if (pathLanguage && req.cookies.get(LANGUAGE_COOKIE)?.value !== pathLanguage) {
    response.cookies.set(LANGUAGE_COOKIE, pathLanguage, languageCookieOptions);
  }

  return response;
}

export const config = {
  matcher: [
    // Todo excepto API, assets de Next y archivos estáticos (cualquier ruta con extensión).
    "/((?!api|_next/static|_next/image|.*\\..*).*)",
  ],
};
