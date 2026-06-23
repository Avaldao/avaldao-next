type Entry = { count: number; resetAt: number };

const store = new Map<string, Entry>();

// Purge expired entries every minute to prevent unbounded growth
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key);
  }
}, 60_000).unref?.();

/**
 * Returns true if the request is allowed, false if it should be rejected.
 * @param key      Unique key (e.g. "ip:endpoint" or "email:endpoint")
 * @param limit    Max requests allowed in the window
 * @param windowMs Sliding window duration in milliseconds
 */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= limit) return false;

  entry.count++;
  return true;
}

export function getIP(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'
  );
}

export const TOO_MANY = new Response(
  JSON.stringify({ error: 'Too many requests, please try again later.' }),
  { status: 429, headers: { 'Content-Type': 'application/json' } }
);
