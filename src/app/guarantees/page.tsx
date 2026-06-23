import type { Metadata } from "next";
import { AvalTable } from "@/components/avaldao/avales/avales-table";

export const metadata: Metadata = {
  title: "Mis garantías",
  robots: { index: false, follow: false },
};
import PageHeader from "@/components/ui/layout/page-header";
import { Button } from "@/components/ui/button";
import { ConnectWalletBannerWrapper } from "@/components/connect-wallet-banner";
import { getCurrentUser, UnauthenticatedError } from "@/lib/auth/authorization";
import { getLanguageCookie } from "@/lib/cookies";
import { translations } from "@/translations";
import AvalesService from "@/services/avales-service";
import { FileCheck, PlusCircle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function GuaranteesPage() {
  const language = await getLanguageCookie();
  const t = (key: string) => translations[key]?.[language] ?? key;

  let avales;
  let currentUser;
  try {
    currentUser = await getCurrentUser();
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
        actions={
          hasWallet ? (
            <Button asChild>
              <Link href="/avales/new">
                <PlusCircle className="h-4 w-4" />
                {t("avals.new-aval")}
              </Link>
            </Button>
          ) : undefined
        }
      />
      {!hasWallet && (
        <div className="mb-6">
          <ConnectWalletBannerWrapper />
        </div>
      )}
      <AvalTable avales={avales ?? []} />
    </div>
  );
}