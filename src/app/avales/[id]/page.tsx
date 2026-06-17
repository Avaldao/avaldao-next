import AvalesService from "@/services/avales-service";
import UsersService from "@/services/users-service";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Users, Target, FileText, UserCheck, Store, Shield, CalendarClock, CheckCircle2 } from "lucide-react";
import { shortenAddress } from "@/utils";

import AvalActionsWrapper from "../aval-actions-wrapper";
import { format } from "date-fns";
import { Aval } from "@/types";
import { generateTranchesFromAval, Tranche } from "@/app/entities/aval.entity";
import { getLanguageCookie } from "@/lib/cookies";
import { translations } from "@/translations";
import { contractsAddress } from "@/blockchain/contracts";
import CopyAddress from "@/components/copy-address";
import { Contract, getAddress, JsonRpcProvider } from "ethers";
import avaldaoAbi from "@/blockchain/contracts/avaldao/avaldao.abi";
import IPFSUserAvatar from "@/app/staff/users/ipfs-user-avatar";


interface AvalDetailsPageProps {
  params: Promise<{ id: string }>;
}

const getStatusText = (status: number, t: (key: string) => string) => {
  const statusMap: { [key: number]: { text: string; variant: "default" | "secondary" | "destructive" | "outline" } } = {
    0: { text: t("aval.status.requested"), variant: "outline" },
    1: { text: t("aval.status.rejected"), variant: "destructive" },
    2: { text: t("aval.status.accepted"), variant: "default" },
    3: { text: t("aval.status.active"), variant: "default" },
    4: { text: t("aval.status.finalized"), variant: "secondary" },
  };
  return statusMap[status] || { text: t("aval.status.unknown"), variant: "outline" };
};

const getAddressExplorerUrl = (chainId: Aval["chainId"], address: string) => {
  const baseUrl = contractsAddress[chainId]?.explorerUrl;
  if (!baseUrl) return "#";
  return `${baseUrl.replace(/\/$/, "")}/address/${address}`;
};


export default async function AvalDetailsPage({ params }: AvalDetailsPageProps) {
  const { id } = await params;
  const language = await getLanguageCookie();
  const t = (key: string) => translations[key]?.[language] ?? key;
  const forceSync = true;

  try {
    const aval = await new AvalesService().getAval(id, forceSync);

    if (!aval) {
      return (
        <div className="container mx-auto p-6">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <FileText className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">{t("aval-not-found.title")}</h2>
              <p className="text-slate-600 mb-6">
                {t("aval-not-found.description").replace("{id}", id)}
              </p>
              <Badge variant="destructive">{t("aval-not-found.badge")}</Badge>
            </CardContent>
          </Card>
        </div>
      );
    }

    let explorer;
    let address;

    try {
      const provider = new JsonRpcProvider(contractsAddress[aval.chainId].rpcUrl);
      const avaldaoAddress = contractsAddress[aval.chainId].avaldao;

      if (!aval.address) {
        const avaldaoContract = new Contract(avaldaoAddress, avaldaoAbi, provider);
        const addressRaw = await avaldaoContract.getAvalAddress(aval._id);
        if (addressRaw != "0x0000000000000000000000000000000000000000") {
          address = getAddress(addressRaw);
          explorer = getAddressExplorerUrl(aval.chainId, address);
        }
        try {
          new AvalesService().syncAvalOnChain(aval._id!);
        } catch (err) {
          console.error("Error syncing aval address from chain:", err);
        }
      } else {
        address = aval.address;
        explorer = getAddressExplorerUrl(aval.chainId, address);
      }
    } catch (err) {
      console.error("Error fetching additional data for aval:", err);
    }

    const usersService = new UsersService();
    const participantResults = await Promise.allSettled([
      usersService.getUserByAddress(aval.solicitanteAddress),
      usersService.getUserByAddress(aval.comercianteAddress),
      usersService.getUserByAddress(aval.avaladoAddress),
      usersService.getUserByAddress(aval.avaldaoAddress),
    ]);
    const [solicitante, comerciante, avalado, avaldaoUser] = participantResults.map(
      (r) => (r.status === "fulfilled" ? r.value : null)
    );

    
    const statusInfo = getStatusText(aval.status, t);

    const participants = [
      {
        labelKey: "aval.details.applicant",
        Icon: UserCheck,
        address: aval.solicitanteAddress,
        user: solicitante,
        signature: aval.solicitanteSignature,
      },
      {
        labelKey: "aval.details.merchant",
        Icon: Store,
        address: aval.comercianteAddress,
        user: comerciante,
        signature: aval.comercianteSignature,
      },
      {
        labelKey: "aval.details.avalado",
        Icon: Shield,
        address: aval.avaladoAddress,
        user: avalado,
        signature: aval.avaladoSignature,
      },
      {
        labelKey: "aval.details.avaldao",
        Icon: Users,
        address: aval.avaldaoAddress,
        user: avaldaoUser,
        signature: aval.avaldaoSignature,
      },
    ];

    return (
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <Shield className="w-6 h-6 text-blue-600" />
                  {aval.proyecto}
                </CardTitle>
                <p className="text-slate-600">{t("aval.network")}: {contractsAddress[aval.chainId]?.networkName}</p>
                {address && (
                  <p>{t("aval.address")}:&nbsp;
                    <a href={explorer} target="_blank" rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >{address}</a>
                  </p>
                )}
              </div>
              <Badge variant={statusInfo.variant}>
                {statusInfo.text}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Acciones según estado y rol */}
        <AvalActionsWrapper aval={aval} language={language} />

        {/* Participantes — ancho completo, fila horizontal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              {t("aval.details.participants")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {participants.map(({ labelKey, Icon, address: addr, user, signature }, i) => (
                <div key={`${addr}_${i}`} className="flex flex-col gap-2">
                  <div className="flex items-center gap-2.5">
                    {user?.infoCid ? (
                      <IPFSUserAvatar username={user.name} infoCid={user.infoCid} />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-violet-600 text-white flex items-center justify-center font-medium shrink-0 text-sm">
                        {user?.name?.charAt(0).toUpperCase() ?? addr.slice(2, 3).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate">{user?.name ?? shortenAddress(addr)}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Icon className="w-3 h-3 shrink-0" />
                        {t(labelKey)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <a
                      href={getAddressExplorerUrl(aval.chainId, addr)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-blue-700 hover:underline"
                      title={addr}
                    >
                      {shortenAddress(addr)}
                    </a>
                    <CopyAddress address={addr} />
                  </div>
                  {signature && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                      <span className="font-mono truncate" title={signature}>{shortenAddress(signature)}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contenido principal */}
        <div className="space-y-6">
          {/* Objetivo, Adquisición y Beneficiarios */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div>
                <p className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-1">
                  <Target className="w-3.5 h-3.5" />
                  {t("aval.details.objective")}
                </p>
                <p className="text-slate-700 whitespace-pre-line">{aval.objetivo}</p>
              </div>
              <hr className="border-slate-100" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-1">
                    <DollarSign className="w-3.5 h-3.5" />
                    {t("aval.details.acquisition")}
                  </p>
                  <p className="text-slate-700">{aval.adquisicion}</p>
                </div>
                <div>
                  <p className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-1">
                    <Users className="w-3.5 h-3.5" />
                    {t("aval.details.beneficiaries")}
                  </p>
                  <p className="text-slate-700">{aval.beneficiarios}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cronograma y cuotas */}
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
              <div className="overflow-x-auto">
                <table className="w-full text-sm xl:max-w-4xl">
                  <thead>
                    <tr className="text-left text-slate-500 border-b">
                      <th className="pb-2  pr-12 font-medium">{t("aval.details.tranche-number")}</th>
                      <th className="pb-2  pr-12 font-medium">{t("aval.details.maturity-date")}</th>
                      <th className="pb-2  pr-12 font-medium">{t("aval.details.unlock-date")}</th>
                      <th className="pb-2  pr-12 font-medium text-right">{t("aval.details.amount")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {generateTranchesFromAval(aval).map((tranche: Tranche) => (
                      <tr key={tranche.index} className="font-mono border-b border-slate-50 hover:bg-gray-50 transition-colors">
                        <td className="py-2 pr-8">{t("aval.details.tranche")} {tranche.index}</td>
                        <td className="py-2 pr-8">{format(new Date(tranche.maturityDateSeconds * 1000), "dd/MM/yyyy HH:mm")}</td>
                        <td className="py-2 pr-8">{format(new Date(tranche.unlockDateSeconds * 1000), "dd/MM/yyyy HH:mm")}</td>
                        <td className="py-2 pr-8 text-right">$ {(aval.montoFiat / 100 / aval.cuotasCantidad).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <FileText className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">{t("aval.loading.error")}</h2>
            <p className="text-slate-600 mb-4">
              {t("aval.loading.error-description")}
            </p>
            <Badge variant="destructive">{t("aval.error.badge")}</Badge>
          </CardContent>
        </div>
      </div>
    );
  }
}
