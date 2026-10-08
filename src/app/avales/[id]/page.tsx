import { Suspense } from "react";
import AvalesService, { AvalRoleEnum } from "@/services/avales-service";
import UsersService from "@/services/users-service";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/ui/layout/page-header";
import { FileText, Shield, CheckCircle2, Clock, Wallet } from "lucide-react";
import { format } from "date-fns";
import { shortenAddress } from "@/utils";

import AvalActionsWrapper from "../aval-actions-wrapper";
import { Aval, AvalState } from "@/types";
import { getLanguage } from "@/lib/cookies";
import { translations } from "@/translations";
import { contractsAddress } from "@/blockchain/contracts";
import CopyAddress from "@/components/copy-address";
import VerifiedName from "@/components/users/verified-name";
import { Contract, getAddress, JsonRpcProvider } from "ethers";
import avaldaoAbi from "@/blockchain/contracts/avaldao/avaldao.abi";
import IPFSUserAvatar from "@/app/staff/users/ipfs-user-avatar";
import CuotasCard from "./cuotas-card";
import ReclamosCard from "./reclamos-card";
import { DetailField, DetailSection } from "./detail-section";

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

const CuotasSkeleton = ({ title }: { title: string }) => (
  <DetailSection title={title}>
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-20 bg-slate-50 rounded animate-pulse" />
      ))}
    </div>
  </DetailSection>
);

const formatMonto = (value: number, language: string) =>
  value.toLocaleString(language === "es" ? "es-AR" : "en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Días con hasta 2 decimales, o 4 si las cuotas duran menos de un día (ej. 0.0417 = 1 hora).
const formatDias = (seconds: number, decimals: number) => String(Number((seconds / 86400).toFixed(decimals)));

export default async function AvalDetailsPage({ params }: AvalDetailsPageProps) {
  const { id } = await params;
  const language = await getLanguage();
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

    const showTime = aval.duracionCuotaSeconds < 86400;
    const diasDecimals = showTime ? 4 : 2;

    // Mismo orden y etiquetas que en el formulario de creación.
    const participants: {
      role: AvalRoleEnum;
      labelKey: string;
      address: string;
      user: typeof solicitante;
      signature?: string;
    }[] = [
      {
        role: "solicitante",
        labelKey: "aval.form.applicant",
        address: aval.solicitanteAddress,
        user: solicitante,
        signature: aval.solicitanteSignature,
      },
      {
        role: "avaldao",
        labelKey: "aval.form.avaldao",
        address: aval.avaldaoAddress,
        user: avaldaoUser,
        signature: aval.avaldaoSignature,
      },
      {
        role: "comerciante",
        labelKey: "aval.form.merchant",
        address: aval.comercianteAddress,
        user: comerciante,
        signature: aval.comercianteSignature,
      },
      {
        role: "avalado",
        labelKey: "aval.form.endorsed",
        address: aval.avaladoAddress,
        user: avalado,
        signature: aval.avaladoSignature,
      },
    ];

    // Un aval solo puede aceptarse si todas sus addresses pertenecen a usuarios con
    // identidad verificada (status "active"). Si la consulta falló no se sabe si el
    // usuario está verificado: se bloquea igual.
    const unverifiedRoles = participants.filter(({ user }) => user?.status !== "active").map(({ role }) => role);

    return (
      <div className="max-w-6xl space-y-3 sm:space-y-6">
        <PageHeader
          title={aval.proyecto}
          icon={<Shield className="h-5 w-5" />}
          breadcrumbs={[{ label: "Avales", href: "/guarantees" }, { label: aval.proyecto }]}
          actions={<Badge variant={statusInfo.variant}>{statusInfo.text}</Badge>}
          description={
            <span className="text-sm text-slate-500">
              <span className="block sm:inline">
                {t("aval.network")}: {contractsAddress[aval.chainId]?.networkName}
              </span>
              {address && (
                <span className="block sm:inline">
                  <span className="hidden sm:inline">{" · "}</span>
                  {t("aval.address")}:{" "}
                  <a
                    href={explorer}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-violet-600 hover:underline"
                    title={address}
                  >
                    {/* En mobile la address completa no entra: se acorta como en participantes. */}
                    <span className="sm:hidden">{shortenAddress(address)}</span>
                    <span className="hidden sm:inline break-all">{address}</span>
                  </a>
                </span>
              )}
            </span>
          }
        />

        {/* Acciones según estado y rol */}
        <AvalActionsWrapper aval={aval} language={language} unverifiedRoles={unverifiedRoles} />

        {/* Las secciones siguen el mismo orden y estilo que el formulario de creación. */}
        <div className="space-y-4">
          {/* El proyecto */}
          <DetailSection title={t("aval.form.project-info")}>
            <DetailField label={t("aval.form.project")}>{aval.proyecto}</DetailField>
            <DetailField label={t("aval.form.objective")}>
              <p className="whitespace-pre-line">{aval.objetivo}</p>
            </DetailField>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DetailField label={t("aval.form.acquisition")}>{aval.adquisicion}</DetailField>
              <DetailField label={t("aval.form.beneficiaries")}>{aval.beneficiarios}</DetailField>
            </div>
          </DetailSection>

          {/* Condiciones del aval */}
          <DetailSection title={t("aval.form.conditions")}>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-3 gap-y-3 sm:gap-4">
              <DetailField label={t("aval.form.amount")}>
                <span className="font-semibold">$ {formatMonto(aval.montoFiat / 100, language)}</span>
              </DetailField>
              <DetailField label={t("aval.form.installments")}>{aval.cuotasCantidad}</DetailField>
              <DetailField label={t("aval.form.start-date")}>
                {format(aval.fechaInicio, showTime ? "dd/MM/yyyy HH:mm" : "dd/MM/yyyy")}
              </DetailField>
              <DetailField label={t("aval.form.duration-days")}>{formatDias(aval.duracionCuotaSeconds, diasDecimals)}</DetailField>
              <DetailField label={t("aval.form.unlock-days")}>{formatDias(aval.desbloqueoSeconds, diasDecimals)}</DetailField>
            </div>
          </DetailSection>

          {/* Plan de cuotas — streamed desde el contrato si vigente */}
          <Suspense fallback={<CuotasSkeleton title={t("aval.form.schedule")} />}>
            <CuotasCard aval={aval} avalAddress={address} language={language} />
          </Suspense>

          {/* Participantes */}
          <DetailSection title={t("aval.form.participants")}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {participants.map(({ labelKey, address: addr, user, signature }, i) => (
                <DetailField key={`${addr}_${i}`} label={t(labelKey)}>
                  <div className="flex items-center gap-2.5 rounded-md border border-slate-200 px-3 py-2">
                    {user?.infoCid ? (
                      <IPFSUserAvatar username={user.name} infoCid={user.infoCid} />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-violet-600 text-white flex items-center justify-center font-medium shrink-0 text-sm">
                        {user?.name?.charAt(0).toUpperCase() ?? addr.slice(2, 3).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      {user?.name ? (
                        <p className="text-sm font-medium text-primary">
                          <VerifiedName name={user.name} status={user.status} language={language} />
                        </p>
                      ) : (
                        <p className="text-sm text-amber-600 truncate">{t("aval.details.user-not-registered")}</p>
                      )}
                      <div className="flex items-center gap-1">
                        <Wallet className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <a
                          href={getAddressExplorerUrl(aval.chainId, addr)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-xs text-violet-600 hover:underline"
                          title={addr}
                        >
                          {shortenAddress(addr)}
                        </a>
                        <CopyAddress address={addr} language={language} />
                      </div>
                    </div>
                    {signature ? (
                      <span
                        className="inline-flex items-center gap-1 text-xs text-green-700 shrink-0"
                        title={signature}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                        {t("aval.details.signed")}
                      </span>
                    ) : aval.status === AvalState.ACEPTADO ? (
                      <span className="inline-flex items-center gap-1 text-xs text-slate-500 shrink-0">
                        <Clock className="w-3.5 h-3.5" />
                        {t("aval.details.signature-pending")}
                      </span>
                    ) : null}
                  </div>
                </DetailField>
              ))}
            </div>
          </DetailSection>

          {/* Reclamos — streamed desde el contrato si vigente y existen */}
          <Suspense fallback={null}>
            <ReclamosCard aval={aval} avalAddress={address} language={language} />
          </Suspense>
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
