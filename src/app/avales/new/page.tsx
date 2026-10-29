import { getAddress } from "ethers";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/authorization";
import AvalFormWrapper from "./aval-form-wrapper";
import { defaultAvaldaoAddress, getAvalChainIds, networks } from "@/blockchain/contracts";
import { getLanguage } from "@/lib/cookies";
import PageHeader from "@/components/ui/layout/page-header";
import { translations } from "@/translations";
import { FilePlus } from "lucide-react";
import { AvalNetworkOption } from "./aval-form";

export const dynamic = 'force-dynamic';

export default async function AvalesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || !(await hasPermission(session, "avales:create"))) redirect("/guarantees");

  const language = await getLanguage();
  const t = (key: string) => translations[key]?.[language] ?? key;

  const networkOptions: AvalNetworkOption[] = getAvalChainIds().map((chainId) => ({
    chainId,
    name: networks[chainId].name,
    avaldaoAddress: getAddress(defaultAvaldaoAddress[chainId].toLowerCase()),
  }));

  // Se preselecciona la red por defecto si está habilitada.
  const defaultChainId = Number(process.env.DEFAULT_CHAIN_ID);
  const initialChainId = networkOptions.some((n) => n.chainId === defaultChainId)
    ? defaultChainId
    : networkOptions[0]?.chainId;

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
        networkOptions={networkOptions}
        initialChainId={initialChainId}
      />
    </div>
  );
}
