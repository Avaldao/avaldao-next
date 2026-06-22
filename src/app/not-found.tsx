import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getLanguageCookie } from "@/lib/cookies";
import { translations } from "@/translations";
import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

export const metadata: Metadata = {
  title: "Página no encontrada",
  description: "La página que buscás no existe en AvalDAO.",
};

export default async function NotFound() {
  const language = await getLanguageCookie();
  const t = (key: string) => translations[key]?.[language] ?? key;

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      <Header />
      <div className="h-16" />

      <main className="flex flex-1 flex-col">
        <section className="flex flex-1 items-center bg-linear-to-br from-[#f6f0ff] via-white to-[#eef2ff] py-32">
          <div className="mx-auto max-w-2xl px-6 text-center lg:px-8">
            <div className="mb-6 flex justify-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-5 py-2 text-sm font-semibold uppercase tracking-[0.16em] text-violet-700 shadow-sm">
                <SearchX className="h-4 w-4" />
                {t("not-found.badge")}
              </span>
            </div>

            <p className="font-heading text-8xl font-bold text-violet-200 select-none md:text-[10rem]">
              404
            </p>

            <h1 className="font-heading mt-2 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
              {t("not-found.title")}
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-600">
              {t("not-found.description")}
            </p>

            <div className="mt-8 flex justify-center">
              <Link
                href="/"
                className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-600 shadow-sm transition-all hover:border-violet-200 hover:text-violet-700"
              >
                <ArrowLeft className="h-4 w-4" />
                {t("not-found.go-home")}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
