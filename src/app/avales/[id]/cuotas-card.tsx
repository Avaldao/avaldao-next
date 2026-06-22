import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarClock } from "lucide-react";
import { format } from "date-fns";
import { Aval, AvalState } from "@/types";
import { generateTranchesFromAval, Tranche } from "@/app/entities/aval.entity";
import { translations, Language } from "@/translations";
import { contractsAddress } from "@/blockchain/contracts";
import { Contract, JsonRpcProvider } from "ethers";
import avalAbi from "@/blockchain/contracts/avaldao/aval.abi";
import UnlockCuotaButton from "./unlock-cuota-button";

interface OnchainCuota {
  numero: number;
  montoFiat: number;
  timestampVencimiento: number;
  timestampDesbloqueo: number;
  status: number;
}

interface Props {
  aval: Aval;
  avalAddress?: string;
  language: Language;
}

export default async function CuotasCard({ aval, avalAddress, language }: Props) {
  const t = (key: string) => translations[key]?.[language] ?? key;

  let onchainCuotas: OnchainCuota[] | null = null;
  let hasOpenReclamos = false;

  if ((aval.status === AvalState.VIGENTE || aval.status == AvalState.FINALIZADO) && avalAddress) {
    try {
      const provider = new JsonRpcProvider(contractsAddress[aval.chainId].rpcUrl);
      const avalContract = new Contract(avalAddress, avalAbi, provider);

      const [cuotasCantidad, reclamosLength] = await Promise.all([
        avalContract.cuotasCantidad().then(Number),
        avalContract.getReclamosLength().then(Number),
      ]);

      const [cuotasRaw, reclamosRaw] = await Promise.all([
        Promise.all(
          Array.from({ length: cuotasCantidad }, (_, i) =>
            avalContract.cuotas(i).then((r: { numero: bigint; montoFiat: bigint; timestampVencimiento: bigint; timestampDesbloqueo: bigint; status: bigint }) => ({
              numero: Number(r.numero),
              montoFiat: Number(r.montoFiat),
              timestampVencimiento: Number(r.timestampVencimiento),
              timestampDesbloqueo: Number(r.timestampDesbloqueo),
              status: Number(r.status),
            }))
          )
        ),
        reclamosLength > 0
          ? Promise.all(
              Array.from({ length: reclamosLength }, (_, i) =>
                avalContract.reclamos(i).then((r: { status: bigint }) => Number(r.status))
              )
            )
          : Promise.resolve([] as number[]),
      ]);

      onchainCuotas = cuotasRaw;
      hasOpenReclamos = reclamosRaw.some((s) => s === 0);
    } catch (err) {
      console.error("Error fetching on-chain cuotas:", err);
    }
  }

  const nowSecs = Math.floor(Date.now() / 1000);

  const firstUnlockableCuota = onchainCuotas?.find(
    (c) => c.status === 0 && c.timestampDesbloqueo < nowSecs
  ) ?? null;

  const canUnlock = !!firstUnlockableCuota && !hasOpenReclamos && !!avalAddress && aval.status === AvalState.VIGENTE;

  const isReadyToUnlock = (cuota: OnchainCuota) =>
    cuota.status === 0 && cuota.timestampDesbloqueo < nowSecs;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarClock className="w-5 h-5 text-orange-600" />
          {t("aval.details.schedule")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-x-6 gap-y-3 text-sm">
          <div>
            <p className="text-slate-500">{t("aval.details.start-date")}</p>
            <p className="font-semibold">{format(aval.fechaInicio, "dd/MM/yyyy")}</p>
          </div>
          <div>
            <p className="text-slate-500">{t("aval.details.amount")}</p>
            <p className="font-semibold text-green-600">$ {(aval.montoFiat / 100).toFixed(2)} USD</p>
          </div>
          <div>
            <p className="text-slate-500">{t("aval.details.tranches-amount")}</p>
            <p className="font-semibold">{aval.cuotasCantidad}</p>
          </div>
          <div>
            <p className="text-slate-500">{t("aval.details.duration")}</p>
            <p className="font-semibold">{aval.duracionCuotaSeconds / 86400} {t("aval.details.days")}</p>
          </div>
          <div>
            <p className="text-slate-500">{t("aval.details.unlock")}</p>
            <p className="font-semibold">{aval.desbloqueoSeconds / 86400} {t("aval.details.days")}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cuotas */}
          <div className="overflow-x-auto">
            <p className="text-sm font-semibold text-slate-700 mb-2">{t("aval.details.schedule")}</p>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b">
                  <th className="pb-2 pr-6 font-medium">{t("aval.details.tranche-number")}</th>
                  <th className="pb-2 pr-6 font-medium">{t("aval.details.maturity-date")}</th>
                  {onchainCuotas && <th className="pb-2 pr-6 font-medium">{t("aval.details.status")}</th>}
                  <th className="pb-2 font-medium text-right">{t("aval.details.amount")}</th>
                </tr>
              </thead>
              <tbody>
                {onchainCuotas
                  ? onchainCuotas.map((cuota) => (
                      <tr key={cuota.numero} className="font-mono border-b border-slate-50 hover:bg-gray-50 transition-colors">
                        <td className="py-2 pr-6">{t("aval.details.tranche")} {cuota.numero}</td>
                        <td className="py-2 pr-6">{format(new Date(cuota.timestampVencimiento * 1000), "dd/MM/yyyy")}</td>
                        <td className="py-2 pr-6">
                          {isReadyToUnlock(cuota) && (
                            <span className="inline-flex items-center gap-1.5 text-xs text-blue-700">
                              <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                              {t("aval.details.cuota-status.ready-to-unlock")}
                            </span>
                          )}
                          {cuota.status === 0 && !isReadyToUnlock(cuota) && (
                            <span className="inline-flex items-center gap-1.5 text-xs text-slate-600">
                              <span className="w-2 h-2 rounded-full bg-slate-400 shrink-0" />
                              {t("aval.details.cuota-status.pending")}
                            </span>
                          )}
                          {cuota.status === 1 && (
                            <span className="inline-flex items-center gap-1.5 text-xs text-green-700">
                              <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                              {t("aval.details.cuota-status.cancelled")}
                            </span>
                          )}
                          {cuota.status === 2 && (
                            <span className="inline-flex items-center gap-1.5 text-xs text-amber-700">
                              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                              {t("aval.details.cuota-status.executed")}
                            </span>
                          )}
                        </td>
                        <td className="py-2 text-right">$ {(cuota.montoFiat / 100).toFixed(2)}</td>
                      </tr>
                    ))
                  : generateTranchesFromAval(aval).map((tranche: Tranche) => (
                      <tr key={tranche.index} className="font-mono border-b border-slate-50 hover:bg-gray-50 transition-colors">
                        <td className="py-2 pr-6">{t("aval.details.tranche")} {tranche.index}</td>
                        <td className="py-2 pr-6">{format(new Date(tranche.maturityDateSeconds * 1000), "dd/MM/yyyy")}</td>
                        <td className="py-2 text-right">$ {(aval.montoFiat / 100 / aval.cuotasCantidad).toFixed(2)}</td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          {/* Cuotas Desbloqueables */}
          <div className="overflow-x-auto">
            <p className="text-sm font-semibold text-slate-700 mb-2">{t("aval.details.unlockable-tranches")}</p>
            {onchainCuotas ? (
              <>
                {onchainCuotas.filter(isReadyToUnlock).length === 0 ? (
                  <p className="text-sm text-slate-400 italic">{t("aval.details.no-unlockable-tranches")}</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-slate-500 border-b">
                        <th className="pb-2 pr-6 font-medium">{t("aval.details.tranche-number")}</th>
                        <th className="pb-2 pr-6 font-medium">{t("aval.details.unlock-date")}</th>
                        <th className="pb-2 font-medium text-right">{t("aval.details.amount")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {onchainCuotas.filter(isReadyToUnlock).map((cuota) => (
                        <tr key={cuota.numero} className="font-mono border-b border-slate-50 hover:bg-gray-50 transition-colors">
                          <td className="py-2 pr-6">{t("aval.details.tranche")} {cuota.numero}</td>
                          <td className="py-2 pr-6">{format(new Date(cuota.timestampDesbloqueo * 1000), "dd/MM/yyyy")}</td>
                          <td className="py-2 text-right">$ {(cuota.montoFiat / 100).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                {canUnlock && (
                  <div className="mt-4">
                    <UnlockCuotaButton
                      avalAddress={avalAddress!}
                      solicitanteAddress={aval.solicitanteAddress}
                      chainId={aval.chainId}
                      language={language}
                    />
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-slate-400 italic">{t("aval.details.no-onchain-data")}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
