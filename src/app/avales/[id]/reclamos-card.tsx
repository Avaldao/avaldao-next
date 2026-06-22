import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { Aval, AvalState } from "@/types";
import { translations, Language } from "@/translations";
import { contractsAddress } from "@/blockchain/contracts";
import { Contract, JsonRpcProvider } from "ethers";
import avalAbi from "@/blockchain/contracts/avaldao/aval.abi";

interface OnchainReclamo {
  numero: number;
  status: number;
  timestampCreacion: number;
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

  let reclamos: OnchainReclamo[] = [];

  try {
    const provider = new JsonRpcProvider(contractsAddress[aval.chainId].rpcUrl);
    const avalContract = new Contract(avalAddress, avalAbi, provider);

    const reclamosLength = Number(await avalContract.getReclamosLength());
    if (reclamosLength > 0) {
      reclamos = await Promise.all(
        Array.from({ length: reclamosLength }, (_, i) =>
          avalContract.reclamos(i).then((r: { numero: bigint; status: bigint; timestampCreacion: bigint }) => ({
            numero: Number(r.numero),
            status: Number(r.status),
            timestampCreacion: Number(r.timestampCreacion),
          }))
        )
      );
    }
  } catch (err) {
    console.error("Error fetching on-chain reclamos:", err);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          {t("aval.details.claims")}
          {reclamos.length > 0 && <span>({reclamos.length})</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {reclamos.length === 0 ? (
          <p className="text-sm text-slate-500">{t("aval.details.no-claims")}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b">
                  <th className="pb-2 pr-12 font-medium">{t("aval.details.claim-number")}</th>
                  <th className="pb-2 pr-12 font-medium">{t("aval.details.creation-date")}</th>
                  <th className="pb-2 pr-12 font-medium">{t("aval.details.status")}</th>
                </tr>
              </thead>
              <tbody>
                {reclamos.map((reclamo) => (
                  <tr key={reclamo.numero} className="font-mono border-b border-slate-50 hover:bg-gray-50 transition-colors">
                    <td className="py-2 pr-8">{reclamo.numero + 1}</td>
                    <td className="py-2 pr-8">{format(new Date(reclamo.timestampCreacion * 1000), "dd/MM/yyyy HH:mm")}</td>
                    <td className="py-2 pr-8">
                      {reclamo.status === 0
                        ? <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100">{t("aval.details.claim-status.active")}</Badge>
                        : <Badge variant="secondary">{t("aval.details.claim-status.closed")}</Badge>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
