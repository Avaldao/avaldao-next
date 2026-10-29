import type { Metadata } from "next";
import { AvalTable } from "@/components/avaldao/avales/avales-table";

export const metadata: Metadata = {
  title: "Mis garantías",
  robots: { index: false, follow: false },
};
import PageHeader from "@/components/ui/layout/page-header";
import { ConnectWalletBannerWrapper } from "@/components/connect-wallet-banner";
import LanguageWrapper from "@/components/LanguageWrapper";
import { getCurrentUser, hasPermission, UnauthenticatedError } from "@/lib/auth/authorization";
import { getLanguage } from "@/lib/cookies";
import { translations } from "@/translations";
import AvalesService from "@/services/avales-service";
import { FileCheck, Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export default async function GuaranteesPage() {
  const language = await getLanguage();
  const t = (key: string) => translations[key]?.[language] ?? key;

  let avales;
  let currentUser;
  let canCreate = false;
  try {
    currentUser = await getCurrentUser();
    const session = await getServerSession(authOptions);
    canCreate = !!session && await hasPermission(session, "avales:create");
    avales = await (new AvalesService()).getAvales();
  } catch (error) {
    if (error instanceof UnauthenticatedError) {
      redirect("/");
    }
  }

  const hasWallet = !!currentUser?.address;

  return (
    <div className="max-w-6xl">
      <PageHeader
        title={t("avals.title")}
        description={t("avals.description")}
        icon={<FileCheck className="h-5 w-5" />}
        breadcrumbs={[{ label: t("avals.title") }]}
      />
      {!hasWallet && (
        <div className="mb-6">
          <LanguageWrapper language={language}>
            <ConnectWalletBannerWrapper />
          </LanguageWrapper>
        </div>
      )}
      <AvalTable avales={avales ?? []} language={language} />
      {canCreate && (
        <Link
          href="/avales/new"
          aria-label={t("avals.new-aval")}
          title={t("avals.new-aval")}
          className="fixed bottom-5 right-5 z-40 flex h-14 items-center justify-center gap-2 rounded-full bg-linear-to-r from-violet-600 to-fuchsia-600 px-4 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition-all duration-200 hover:from-violet-700 hover:to-fuchsia-700 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 sm:bottom-8 sm:right-8 max-sm:w-14 max-sm:px-0"
        >
          <Plus className="h-6 w-6 shrink-0" />
          <span className="max-sm:hidden">{t("avals.new-aval")}</span>
        </Link>
      )}
    </div>
  );
}