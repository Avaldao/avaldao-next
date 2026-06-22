import { getAddress } from "ethers";
import AvalFormWrapper from "./aval-form-wrapper";
import { defaultAvaldaoAddress } from "@/blockchain/contracts";
import { getLanguageCookie } from "@/lib/cookies";
import PageHeader from "@/components/ui/layout/page-header";
import { translations } from "@/translations";
import { FilePlus } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AvalesPage() {
  const language = await getLanguageCookie();
  const t = (key: string) => translations[key]?.[language] ?? key;

  return (
    <div className="max-w-6xl">
      <PageHeader
        title={t("avals.new.title")}
        description={t("avals.new.description")}
        icon={<FilePlus className="h-5 w-5" />}
        breadcrumbs={[{ label: t("avals.title"), href: "/guarantees" }, { label: t("avals.new.breadcrumb") }]}
      />
      <AvalFormWrapper
        language={language}
        avaldaoAddress={getAddress(defaultAvaldaoAddress[Number(process.env.DEFAULT_CHAIN_ID!)].toLowerCase())}
      />
    </div>
  );
}