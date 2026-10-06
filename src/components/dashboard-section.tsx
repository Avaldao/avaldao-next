import { Suspense } from "react";
import { getLanguageCookie } from "@/lib/cookies";
import DashboardAnimation from "./dashboard-animation";
import GuaranteeFund from "./GuaranteeFund";
import { Language, translations } from "@/translations";
import AvaldaoPlatformStatusModel, { type IAvaldaoPlatformStatus } from "@/lib/db/models/avaldao-platform-status-model";
import "@/lib/mongodb";

// La landing siempre muestra datos de Rootstock Mainnet, independientemente de DEFAULT_CHAIN_ID.
const ROOTSTOCK_MAINNET_CHAIN_ID = 30;
const ONCHAIN_VIGENTE = 3;
const ONCHAIN_FINALIZADO = 4;

/**
 * Último snapshot del estado onchain de la plataforma (lo genera /api/platform-status).
 * Se lee de MongoDB para no recorrer todos los avales onchain en cada visita al home.
 */
async function getPlatformMetrics(chainId: number) {
  try {
    // Si Mongo no responde rápido, el home se muestra sin métricas en vez de esperar el timeout de buffering (10s).
    const snapshot = await Promise.race([
      AvaldaoPlatformStatusModel.findOne({ chainId })
        .sort({ fetchedAt: -1 })
        .lean<IAvaldaoPlatformStatus>(),
      new Promise<null>((_, reject) => setTimeout(() => reject(new Error("Platform metrics timeout")), 3000)),
    ]);
    if (!snapshot) return null;

    const avales = snapshot.avales.filter(
      (a) => a.onchainStatus === ONCHAIN_VIGENTE || a.onchainStatus === ONCHAIN_FINALIZADO
    );

    return {
      vigentes: snapshot.totalVigentes,
      finalizados: snapshot.totalFinalizados,
      cuotas: avales.reduce((s, a) => s + a.cuotasCantidad, 0),
      monto: avales.reduce((s, a) => s + a.montoFiat, 0),
      fetchedAt: snapshot.fetchedAt,
    };
  } catch (e) {
    console.error("Error loading platform metrics:", e);
    return null;
  }
}

async function PlatformMetrics({ language }: { language: Language }) {
  const t = (key: string) => translations[key]?.[language] ?? key;
  const locale = language === "es" ? "es-AR" : "en-US";

  const metrics = await getPlatformMetrics(ROOTSTOCK_MAINNET_CHAIN_ID);
  if (!metrics) return null;

  const items = [
    { label: t("dashboard.metrics.vigentes"), value: metrics.vigentes.toLocaleString(locale) },
    { label: t("dashboard.metrics.cuotas"), value: metrics.cuotas.toLocaleString(locale) },
    { label: t("dashboard.metrics.finalizados"), value: metrics.finalizados.toLocaleString(locale) },
    { label: t("dashboard.metrics.monto"), value: metrics.monto.toLocaleString(locale, { maximumFractionDigits: 0 }) },
  ];

  return (
    <>
      <dl className="mx-auto grid max-w-5xl grid-cols-2 gap-4 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col-reverse rounded-2xl border border-white/20 bg-white/10 p-5 text-center backdrop-blur-sm">
            <dt className="mt-1 text-sm text-white/80">{item.label}</dt>
            <dd className="font-heading text-3xl font-bold sm:text-4xl">{item.value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-center text-xs text-white/70">
        {t("dashboard.metrics.updated")}{" "}
        {new Date(metrics.fetchedAt).toLocaleString(locale, { dateStyle: "medium", timeStyle: "short" })}
      </p>
    </>
  );
}

export default async function DashboardSection() {
  const language = await getLanguageCookie();
  const t = (key: string) => translations[key]?.[language] ?? key;

  return (
    <section id="dashboard" className="
    relative scroll-mt-20 py-20 bg-primary text-white bg-[url(/images/guarantee-fund-bg.png)]
    bg-cover bg-no-repeat
    ">
      <DashboardAnimation />

      <div className="container mx-auto px-4 z-2 relative max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white sm:px-4 sm:text-sm sm:tracking-[0.24em]">
            {t("dashboard.eyebrow")}
          </span>
          <h2 className="mt-4 text-3xl font-bold font-heading sm:mt-6 sm:text-4xl">{t("dashboard.title")}</h2>
          <p className="mt-4 text-lg text-gray-100 mb-12">
            {t("dashboard.description")}
          </p>
        </div>

        <GuaranteeFund chainId={ROOTSTOCK_MAINNET_CHAIN_ID} />

        {/* Las métricas dependen de MongoDB: se cargan en streaming para no bloquear el resto del home */}
        <Suspense fallback={null}>
          <PlatformMetrics language={language} />
        </Suspense>
      </div>
    </section>
  )
}
