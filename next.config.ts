import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://ipfs.io https://*.ipfs.io",
      "font-src 'self'",
      "connect-src 'self' https: wss:",
      "frame-src https://www.google.com https://recaptcha.google.com",
      "object-src 'none'",
      "base-uri 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ipfs.io",
      },
    ],
  },
  // Rutas públicas renombradas al inglés: se conservan las URLs viejas ya indexadas.
  async redirects() {
    return [
      { source: "/solicitar", destination: "/request", permanent: true },
      { source: "/:lang(es|en)/solicitar", destination: "/:lang/request", permanent: true },
      { source: "/invertir", destination: "/invest", permanent: true },
      { source: "/:lang(es|en)/invertir", destination: "/:lang/invest", permanent: true },
      { source: "/comercios", destination: "/merchants", permanent: true },
      { source: "/:lang(es|en)/comercios", destination: "/:lang/merchants", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
