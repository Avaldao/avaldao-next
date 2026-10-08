import { format } from "date-fns";
import { DetailSection } from "./detail-section";
import { Aval, AvalState } from "@/types";
import { generateTranchesFromAval, Tranche } from "@/app/entities/aval.entity";
import { translations, Language } from "@/translations";
import { contractsAddress } from "@/blockchain/contracts";
import { Contract, JsonRpcProvider } from "ethers";
import avalAbi from "@/blockchain/contracts/avaldao/aval.abi";
import AvalTxAction from "./aval-tx-action";
import { Unlock } from "lucide-react";
import InstallmentList from "@/components/avales/installment-list";

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
    <DetailSection title={t("aval.form.schedule")}>
      <InstallmentList
        t={t}
        showTime={aval.duracionCuotaSeconds < 86400 || aval.desbloqueoSeconds < 86400}
        items={
          onchainCuotas
            ? onchainCuotas.map((cuota) => ({
                key: cuota.numero,
                label: `${t("aval.details.tranche")} ${cuota.numero}`,
                amount: `$ ${(cuota.montoFiat / 100).toFixed(2)}`,
                startSeconds: cuota.timestampVencimiento - aval.duracionCuotaSeconds,
                maturitySeconds: cuota.timestampVencimiento,
                unlockSeconds: cuota.timestampDesbloqueo,
                status: <CuotaStatus cuota={cuota} ready={isReadyToUnlock(cuota)} t={t} />,
              }))
            : generateTranchesFromAval(aval).map((tranche: Tranche) => ({
                key: tranche.index,
                label: `${t("aval.details.tranche")} ${tranche.index}`,
                amount: `$ ${(aval.montoFiat / 100 / aval.cuotasCantidad).toFixed(2)}`,
                startSeconds: tranche.startDateSeconds,
                maturitySeconds: tranche.maturityDateSeconds,
                unlockSeconds: tranche.unlockDateSeconds,
              }))
        }
      />

      {/* Antes de estar onchain, la misma nota que en el formulario */}
      {!onchainCuotas && (
        <p className="text-xs text-slate-500">
          {t("aval.form.schedule.note").replace("{days}", String(Number((aval.desbloqueoSeconds / 86400).toFixed(aval.duracionCuotaSeconds < 86400 ? 4 : 2))))}
        </p>
      )}

      {/* Cuotas desbloqueables — solo con datos del contrato */}
      {onchainCuotas && (
        <div className="overflow-x-auto pt-3 border-t border-slate-100">
          <p className="text-sm font-medium text-primary mb-2">{t("aval.details.unlockable-tranches")}</p>
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
              <AvalTxAction
                avalAddress={avalAddress!}
                actorAddress={aval.solicitanteAddress}
                chainId={aval.chainId}
                language={language}
                method="unlockFundManual"
                title={t("aval.details.unlock-cuota.title")}
                description={t("aval.details.unlock-cuota.description")}
                buttonLabel={t("aval.details.unlock-cuota.button")}
                icon={<Unlock className="w-4 h-4 mr-2" />}
                hint={t("aval.details.unlock-cuota.hint")}
                wrongNetworkMessage={t("tx.error.wrong-network")}
              />
            </div>
          )}
        </div>
      )}
    </DetailSection>
  );
}

function CuotaStatus({ cuota, ready, t }: { cuota: OnchainCuota; ready: boolean; t: (key: string) => string }) {
  if (ready) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-blue-700">
        <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
        {t("aval.details.cuota-status.ready-to-unlock")}
      </span>
    );
  }
  if (cuota.status === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-slate-600">
        <span className="w-2 h-2 rounded-full bg-slate-400 shrink-0" />
        {t("aval.details.cuota-status.pending")}
      </span>
    );
  }
  if (cuota.status === 1) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-green-700">
        <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
        {t("aval.details.cuota-status.cancelled")}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-amber-700">
      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
      {t("aval.details.cuota-status.executed")}
    </span>
  );
}
