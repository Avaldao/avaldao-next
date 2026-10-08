import { Badge } from "@/components/ui/badge";
import { DetailSection } from "./detail-section";
import { format } from "date-fns";
import { Aval, AvalState, ReclamoView } from "@/types";
import { translations, Language } from "@/translations";
import { contractsAddress } from "@/blockchain/contracts";
import { Contract, JsonRpcProvider } from "ethers";
import avalAbi from "@/blockchain/contracts/avaldao/aval.abi";
import { AlertTriangle, Gavel } from "lucide-react";
import AvalTxAction from "./aval-tx-action";
import OpenReclamoAction from "./open-reclamo-action";
import ReclamoMensajes from "./reclamo-mensajes";
import ReclamosService from "@/services/reclamos-service";
import type { ReclamoAutorRol } from "@/lib/db/models/reclamo-model";

interface OnchainCuota {
  numero: number;
  montoFiat: number;
  timestampVencimiento: number;
  status: number;
}

interface Props {
  aval: Aval;
  avalAddress?: string;
  language: Language;
}

export default async function ReclamosCard({ aval, avalAddress, language }: Props) {
  const t = (key: string) => translations[key]?.[language] ?? key;

  const visible = aval.status === AvalState.VIGENTE || aval.status === AvalState.FINALIZADO;
  if (!visible || !avalAddress) return null;

  let reclamos: ReclamoView[] = [];
  let viewerRol: ReclamoAutorRol | null = null;
  let cuotas: OnchainCuota[] = [];

  try {
    const provider = new JsonRpcProvider(contractsAddress[aval.chainId].rpcUrl);
    const avalContract = new Contract(avalAddress, avalAbi, provider);
    const cuotasCantidad = Number(await avalContract.cuotasCantidad());

    // Lee los reclamos onchain, sincroniza la colección y trae los mensajes.
    [{ reclamos, viewerRol }, cuotas] = await Promise.all([
      new ReclamosService().getReclamos(aval._id),
      Promise.all(
        Array.from({ length: cuotasCantidad }, (_, i) =>
          avalContract.cuotas(i).then((c: { numero: bigint; montoFiat: bigint; timestampVencimiento: bigint; status: bigint }) => ({
            numero: Number(c.numero),
            montoFiat: Number(c.montoFiat),
            timestampVencimiento: Number(c.timestampVencimiento),
            status: Number(c.status),
          }))
        )
      ),
    ]);
  } catch (err) {
    console.error("Error fetching on-chain reclamos:", err);
  }

  // Mismas condiciones que Aval.openReclamo / Aval.ejecutarGarantia: cuotas
  // Pendientes cuya fecha de vencimiento ya pasó.
  const nowSecs = Math.floor(Date.now() / 1000);
  const cuotasVencidas = cuotas.filter((c) => c.status === 0 && c.timestampVencimiento <= nowSecs);
  const hasReclamoVigente = reclamos.some((r) => r.status === 0);
  const isVigente = aval.status === AvalState.VIGENTE;

  const canOpenReclamo = isVigente && !hasReclamoVigente && cuotasVencidas.length > 0;
  const canEjecutarGarantia = isVigente && hasReclamoVigente && cuotasVencidas.length > 0;

  const cuotasLabel = cuotasVencidas.map((c) => c.numero).join(", ");
  const montoVencido = `$ ${(cuotasVencidas.reduce((sum, c) => sum + c.montoFiat, 0) / 100).toFixed(2)}`;
  const fill = (key: string) => t(key).replace("{cuotas}", cuotasLabel).replace("{amount}", montoVencido);

  // Los más recientes primero: el vigente, si hay, queda arriba.
  const reclamosOrdenados = [...reclamos].sort((a, b) => b.numero - a.numero);

  return (
    <DetailSection title={<>{t("aval.details.claims")}{reclamos.length > 0 && ` (${reclamos.length})`}</>}>
      {reclamos.length === 0 ? (
        <p className="text-sm text-slate-500">{t("aval.details.no-claims")}</p>
      ) : (
        <ul className="space-y-3">
          {reclamosOrdenados.map((reclamo) => (
            <li key={reclamo.numero} className="rounded-lg border border-slate-200 bg-slate-50/60 p-3 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-baseline gap-3 text-sm">
                  {/* El contrato numera los reclamos desde 1. */}
                  <span className="font-semibold text-primary">
                    {t("aval.details.claim-number")}{reclamo.numero}
                  </span>
                  <span className="font-mono text-xs text-slate-500">
                    {t("aval.details.claim-opened-at")} {format(new Date(reclamo.timestampCreacion * 1000), "dd/MM/yyyy HH:mm")}
                  </span>
                </div>
                {reclamo.status === 0
                  ? <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100">{t("aval.details.claim-status.active")}</Badge>
                  : <Badge variant="secondary">{t("aval.details.claim-status.closed")}</Badge>
                }
              </div>
              {viewerRol && (
                <ReclamoMensajes
                  avalId={aval._id}
                  reclamo={reclamo}
                  canPost={reclamo.status === 0}
                  language={language}
                />
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Visible para todos los participantes: qué está en juego con el reclamo abierto. */}
      {canEjecutarGarantia && (
        <p className="flex items-start gap-2 text-sm text-amber-800">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          {fill("aval.details.claim-open-notice")}
        </p>
      )}

      {/* Solo se renderizan si la wallet conectada es la que el contrato exige. */}
      {canOpenReclamo && (
        <OpenReclamoAction
          avalId={aval._id}
          avalAddress={avalAddress}
          comercianteAddress={aval.comercianteAddress}
          chainId={aval.chainId}
          language={language}
          numero={reclamos.length + 1}
          description={fill("aval.details.open-claim.description")}
        />
      )}

      {canEjecutarGarantia && (
        <AvalTxAction
          avalAddress={avalAddress}
          actorAddress={aval.solicitanteAddress}
          chainId={aval.chainId}
          language={language}
          method="ejecutarGarantia"
          tone="red"
          title={t("aval.details.execute-guarantee.title")}
          description={fill("aval.details.execute-guarantee.description")}
          buttonLabel={t("aval.details.execute-guarantee.button")}
          icon={<Gavel className="w-4 h-4 mr-2" />}
          hint={fill("aval.details.execute-guarantee.hint")}
          wrongNetworkMessage={t("tx.error.wrong-network")}
        />
      )}
    </DetailSection>
  );
}
