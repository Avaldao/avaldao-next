import { Suspense } from "react";
import GuaranteeFundValue from "./GuaranteeFundValue";
import { Badge } from "./ui/badge";
import ContractsFactory from "@/blockchain/contracts";
import { getLanguageCookie } from "@/lib/cookies";
import { translations } from "@/translations";


export default async function GuaranteeFund() {
  //first get contracts

  const chainId = Number(process.env.DEFAULT_CHAIN_ID!);
  const {
    vault: vaultAddress,
    explorerUrl,
    networkName,
    avaldao: avaldaoAddress,
    tokens,
  } = ContractsFactory.getNetworkInfo(chainId)!;

  const docAddress = tokens?.doc!;
  const language = await getLanguageCookie();
  const t = (key: string) => translations[key]?.[language] ?? key;

  return (
    <div className="relative bg-linear-to-r from-blue-500 to-purple-600 text-white p-8 pt-11 rounded-2xl shadow-lg text-center mb-12 max-w-md mx-auto min-h-45">
      <div className="absolute top-3 right-3">
        <Badge variant="outline" className="text-xs">{networkName}</Badge>
      </div>
      <h3 className="text-2xl font-bold mb-1 font-heading">{t("dashboard.guarantee-fund.title")}</h3>

      <a target="_blank" href={`${explorerUrl}/address/${vaultAddress}?tab=tokens`}>
        <div className="text-4xl font-bold font-heading flex flex-col gap-y-2 my-3 select-none">
          <div className="flex flex-row  justify-center gap-x-2">
            <div className="min-w-32">
              <Suspense fallback={
                <div className="h-full rounded-md bg-white/60 animate-pulse"></div>
              }>
                <GuaranteeFundValue
                  chainId={chainId}
                  docAddress={docAddress}
                />
              </Suspense>
            </div>
            USD*
          </div>
          <p className="text-xs text-white/80">{t("dashboard.guarantee-fund.clarification")}</p>


        </div>
      </a>
      <a
        target="_blank"
        href={`${explorerUrl}/address/${avaldaoAddress}`}

        className="inline-block mt-4 text-xs text-white/90 hover:text-white underline underline-offset-2 transition-colors"
      >
        {t("dashboard.guarantee-fund.see-contract")}
      </a>
    </div>
  )
}