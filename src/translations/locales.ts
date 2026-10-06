// Configuración de idiomas. Sin dependencias de servidor: se usa desde el proxy, server y client components.

export const languages = ['es', 'en'] as const;

export type Language = (typeof languages)[number];

export const defaultLanguage: Language = 'es';

// Cookie con la preferencia de idioma del usuario. La usan las páginas privadas (no indexables),
// que no llevan el idioma en la URL.
export const LANGUAGE_COOKIE = 'language';

export const languageCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 365,
  path: '/',
} as const;

// Header que el proxy agrega a la request con el idioma resuelto para esa request.
export const LANGUAGE_HEADER = 'x-language';

// Páginas públicas e indexables. Se sirven con el idioma como prefijo de la URL (/es, /en/invertir)
// para que cada versión tenga su propia URL indexable, con hreflang y canonical.
export const localizedPaths = ['/', '/invertir'] as const;

export function isLanguage(value: unknown): value is Language {
  return typeof value === 'string' && (languages as readonly string[]).includes(value);
}

export function isLocalizedPath(pathname: string): boolean {
  return (localizedPaths as readonly string[]).includes(pathname);
}

/** Idioma presente como primer segmento de la URL (`/en/invertir` → `en`), o null. */
export function getPathLanguage(pathname: string): Language | null {
  const segment = pathname.split('/')[1];
  return isLanguage(segment) ? segment : null;
}

/** Agrega el prefijo de idioma si `href` es una página pública localizada; si no, lo devuelve igual. */
export function localizeHref(href: string, language: Language): string {
  if (!isLocalizedPath(href)) return href;
  return href === '/' ? `/${language}` : `/${language}${href}`;
}

/** Cambia el prefijo de idioma de una URL localizada (`/es/invertir` → `/en/invertir`). */
export function switchPathLanguage(pathname: string, language: Language): string {
  const rest = getPathLanguage(pathname) ? pathname.split('/').slice(2).join('/') : pathname.slice(1);
  return rest ? `/${language}/${rest}` : `/${language}`;
}

/** Elige el idioma soportado de mayor preferencia según el header Accept-Language. */
export function matchAcceptLanguage(header: string | null): Language | null {
  if (!header) return null;

  const candidates = header
    .split(',')
    .map((part) => {
      const [tag, ...params] = part.trim().split(';');
      const q = params.find((p) => p.trim().startsWith('q='));
      return { language: tag.split('-')[0].toLowerCase(), q: q ? Number(q.trim().slice(2)) : 1 };
    })
    .filter((c) => c.q > 0)
    .sort((a, b) => b.q - a.q);

  const match = candidates.find((c) => isLanguage(c.language));
  return match ? (match.language as Language) : null;
}
