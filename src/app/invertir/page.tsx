import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectTimeline from "@/components/ProjectTimeline";
import { getLanguageCookie } from "@/lib/cookies";
import { translations } from "@/translations";
import Link from "next/link";
import { Clock, Wrench, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Invertir",
  description:
    "La funcionalidad de inversión en AvalDAO está en desarrollo. Estamos actualizando los smart contracts para soportarla.",
};

export default async function InvertirPage() {
  const language = await getLanguageCookie();
  const t = (key: string) => translations[key]?.[language] ?? key;

  const isEs = language === "es";

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      <Header />
      <div className="h-16" />

      <main>
        {/* Hero section */}
        <section className="bg-linear-to-br from-[#f6f0ff] via-white to-[#eef2ff] py-24">
          <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
            <div className="mb-6 flex justify-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-5 py-2 text-sm font-semibold uppercase tracking-[0.16em] text-violet-700 shadow-sm">
                <Clock className="h-4 w-4" />
                {isEs ? "En desarrollo" : "In development"}
              </span>
            </div>

            <h1 className="font-heading text-4xl font-bold tracking-tight text-slate-950 md:text-5xl lg:text-6xl">
              {isEs
                ? "La funcionalidad de invertir aún no está lista"
                : "The invest feature is not ready yet"}
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              {isEs
                ? "Estamos trabajando en actualizar los smart contracts para soportar la participación de inversores con rendimiento transparente y auditable."
                : "We are working on updating the smart contracts to support investor participation with transparent and auditable yield."}
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <div className="flex items-center gap-2 rounded-2xl border border-violet-100 bg-white px-5 py-3 text-sm font-medium text-slate-700 shadow-sm">
                <Wrench className="h-4 w-4 text-violet-500" />
                {isEs
                  ? "Actualizando contratos inteligentes"
                  : "Updating smart contracts"}
              </div>
              <Link
                href="/"
                className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-600 shadow-sm transition-all hover:border-violet-200 hover:text-violet-700"
              >
                <ArrowLeft className="h-4 w-4" />
                {isEs ? "Volver al inicio" : "Back to home"}
              </Link>
            </div>
          </div>
        </section>

        {/* Roadmap section */}
        <div className="border-t border-violet-100">
          <div className="mx-auto max-w-7xl px-6 pb-4 pt-12 text-center lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-violet-600">
              {isEs ? "¿Cuándo estará listo?" : "When will it be ready?"}
            </p>
          </div>
          <ProjectTimeline />
        </div>
      </main>

      <Footer />
    </div>
  );
}
