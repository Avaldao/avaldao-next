"use client";

import { useState, useMemo } from "react";
import avaldaoAbi from "@/blockchain/contracts/avaldao/avaldao.abi";
import { Button } from "@/components/ui/button";
import { Aval, AvalState } from "@/types";
import { useAppKitAccount, useAppKitNetwork, useAppKitProvider } from "@reown/appkit/react";
import {
  BrowserProvider,
  Contract,
  Eip1193Provider,
  JsonRpcProvider,
  JsonRpcSigner,
} from "ethers";
import { PenLine, PlayCircle, CheckCircle2, Clock, XCircle, AlertCircle, ShieldCheck, FileCheck2, Info } from "lucide-react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/context/LanguageContext";
import { ROOTSTOCK_NETWORKS } from "@/config";
import toast from "react-hot-toast";
import avalAbi from "@/blockchain/contracts/avaldao/aval.abi";
import { generateStructDataToSign, getTranchesTs } from "../entities/aval.entity";
import { generateTerminosTexto } from "../entities/aval-terms.entity";
import adminAbi from "@/blockchain/contracts/avaldao/admin.abi";
import { AvalRoleEnum } from "@/services/avales-service";
import { useRouter } from "next/navigation";
import vaultAbi from "@/blockchain/contracts/avaldao/vault.abi";
import { getSignatures } from "@/blockchain/utils/signatures";
import { contractsAddress } from "@/blockchain/contracts";
import TransactionTracker from "@/components/blockchain/transaction-tracker/transaction-tracker";
import useBlockchainTransaction from "@/hooks/useBlockchainTransaction";
import SignModal, { SignStatus } from "@/app/users/signup/sign-modal";

interface GetContractsOptions {
  permissions?: boolean;
}

interface ContractsResult {
  avaldao: Contract;
  vault: Contract;
  avalContract?: Contract;
  avaldaoAddress: string;
  vaultAddress: string;
  avalAddress?: string;
  signer: JsonRpcSigner;
  permissions?: { address: string; contract?: Contract };
}

const ROLE_LABEL_KEYS: Record<AvalRoleEnum, string> = {
  solicitante: "aval.form.applicant",
  avaldao: "aval.form.avaldao",
  comerciante: "aval.form.merchant",
  avalado: "aval.form.endorsed",
};

export default function AvalActions({ aval, unverifiedRoles }: { aval: Aval; unverifiedRoles: AvalRoleEnum[] }) {
  const { data: session } = useSession();
  const { t, language } = useLanguage();
  const router = useRouter();
  const { walletProvider } = useAppKitProvider<Eip1193Provider>("eip155");
  const { address } = useAppKitAccount();
  const [showTxTracker, setShowTxTracker] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejecting, setRejecting] = useState(false);
  const [showSignModal, setShowSignModal] = useState(false);
  const [signStatus, setSignStatus] = useState<SignStatus>("idle");
  const [signingRole, setSigningRole] = useState<AvalRoleEnum | null>(null);
  const [repinning, setRepinning] = useState(false);
  const [selectedRole, setSelectedRole] = useState<AvalRoleEnum | null>(null);

  const provider = useMemo(() => {
    if (!walletProvider) return null;
    return new BrowserProvider(walletProvider);
  }, [walletProvider]);

  // Texto de términos a mostrar al firmar. Lo normal es que venga guardado en el
  // aval, que es lo que quedó pineado bajo el infoCid. Para avales viejos, sin
  // términos persistidos, lo generamos al vuelo y avisamos que el CID no los
  // commitea.
  const signTerms = useMemo(() => {
    const stored = aval.terminos?.textos?.[language];
    if (stored) return { texto: stored, warning: undefined as string | undefined };
    try {
      return {
        texto: generateTerminosTexto(aval, language),
        warning: t("aval.sign.terms.not-committed"),
      };
    } catch {
      return null;
    }
  }, [aval, language, t]);

  const { run, estimateCost, estimatedCost, txState, clearTxState } = useBlockchainTransaction(provider);

  if (!session?.user) return null;

  const user = session.user;

  // Role checks
  const hasAvaldaoRoleOnChain =
    !!user.nroles?.[aval.chainId]?.includes("AVALDAO_ROLE");

  // Roles del aval en el mismo orden que el formulario y la sección de participantes.
  const signatureRoles: { role: AvalRoleEnum; addr: string; signature: string | undefined }[] = [
    { role: "solicitante", addr: aval.solicitanteAddress, signature: aval.solicitanteSignature },
    { role: "avaldao",     addr: aval.avaldaoAddress,     signature: aval.avaldaoSignature     },
    { role: "comerciante", addr: aval.comercianteAddress, signature: aval.comercianteSignature },
    { role: "avalado",     addr: aval.avaladoAddress,     signature: aval.avaladoSignature     },
  ];

  const roleLabel = (role: AvalRoleEnum) => t(ROLE_LABEL_KEYS[role]);

  // Una misma wallet puede ocupar varios roles del aval; firma una vez por cada uno.
  const myRoles = address
    ? signatureRoles.filter(({ addr }) => addr && address.toLowerCase() === addr.toLowerCase())
    : [];
  const pendingRoles = myRoles.filter(({ signature }) => !signature).map(({ role }) => role);
  const signedRoles = myRoles.filter(({ signature }) => !!signature).map(({ role }) => role);
  // Si el rol elegido ya se firmó (o no hay elección), se propone el primero pendiente.
  const roleToSign = pendingRoles.find((r) => r === selectedRole) ?? pendingRoles[0];

  const signatureCount = signatureRoles.filter(({ signature }) => !!signature).length;

  const allSigned = signatureCount === 4;
  const canStartAval =
    allSigned &&
    address &&
    address.toLowerCase() === aval.avaldaoAddress?.toLowerCase();

  // ── Helpers ──────────────────────────────────────────────────────────────

  async function switchNet(targetChainId: number) {
    const networkConfig =
      targetChainId === 30
        ? ROOTSTOCK_NETWORKS["mainnet"]
        : targetChainId === 31
        ? ROOTSTOCK_NETWORKS["testnet"]
        : null;
    if (!networkConfig) return;
    try {
      await walletProvider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: networkConfig.chainId }],
      });
      return true;
    } catch (err: any) {
      if (err.code === 4902) {
        try {
          await walletProvider.request({
            method: "wallet_addEthereumChain",
            params: [networkConfig],
          });
          return true;
        } catch {
          return false;
        }
      }
    }
  }

  async function getContracts(
    chainId: 30 | 31 = aval.chainId,
    { permissions = false }: GetContractsOptions = {}
  ): Promise<ContractsResult> {
    let ethersProvider = new BrowserProvider(walletProvider);
    let signer = await ethersProvider.getSigner();
    const rpcProvider = new JsonRpcProvider(contractsAddress[Number(chainId)].rpcUrl);
    const connectedChainId = signer.provider._network.chainId;

    if (Number(connectedChainId) !== chainId) {
      const switched = await switchNet(chainId);
      if (!switched)
        throw new Error(
          t("aval.actions.wrong-network", { chainId: String(chainId) })
        );
      ethersProvider = new BrowserProvider(walletProvider);
      signer = await ethersProvider.getSigner();
    }

    const avaldaoAddress = contractsAddress[Number(chainId)].avaldao;
    const avaldao = new Contract(avaldaoAddress, avaldaoAbi, rpcProvider);
    const vaultAddress = await avaldao.vault();
    const vault = new Contract(vaultAddress, vaultAbi, rpcProvider);

    let avalAddress: string | undefined;
    let avalContract: Contract | undefined;
    if (aval._id) {
      avalAddress = await avaldao.getAvalAddress(aval._id);
      avalContract = new Contract(avalAddress!, avalAbi, signer);
    }

    const result: ContractsResult = {
      avaldao,
      vault,
      avalContract,
      avaldaoAddress,
      avalAddress,
      vaultAddress,
      signer,
    };

    if (permissions) {
      const permissionsAddress = contractsAddress[Number(chainId)].permissions;
      result.permissions = {
        address: permissionsAddress,
        contract: new Contract(permissionsAddress, adminAbi, signer),
      };
    }

    return result;
  }

  async function acceptAval() {
    if (!aval.infoCid) {
      toast.error(t("aval.actions.missing-info-cid"));
      return;
    }
    if (unverifiedRoles.length > 0) {
      toast.error(t("aval.actions.unverified.title"));
      return;
    }
    setShowTxTracker(true);
    await run(async () => {
      const { avaldao, signer } = await getContracts(aval.chainId);
      // avaldao está conectado al rpcProvider (solo lectura); la escritura va con el signer de la wallet.
      const saveAval = (avaldao.connect(signer) as Contract).saveAval;
      const args = [
        aval._id,
        aval.infoCid,
        [
          aval.avaldaoAddress,
          aval.solicitanteAddress,
          aval.comercianteAddress,
          aval.avaladoAddress,
        ],
        aval.montoFiat,
        getTranchesTs(aval).map((ts: number) => `0x${ts.toString(16)}`),
      ];
      estimateCost(signer, saveAval.populateTransaction(...args));
      return saveAval(...args, { gasLimit: BigInt(5_000_000) });
    });
  }

  async function rejectAval() {
    if (!rejectReason.trim()) {
      toast.error(t("aval.actions.reject.validation"));
      return;
    }
    setRejecting(true);
    try {
      const res = await fetch(`/api/avales/${aval._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject", reason: rejectReason.trim() }),
      });
      if (!res.ok) throw new Error(t("aval.actions.reject-aval-error"));
      toast.success(t("aval.actions.reject.success"));
      router.refresh();
    } catch (err: any) {
      toast.error(err.message ?? t("aval.actions.unknown-error"));
    } finally {
      setRejecting(false);
    }
  }

  async function repinAval() {
    setRepinning(true);
    try {
      const res = await fetch(`/api/avales/${aval._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "repin" }),
      });
      if (!res.ok) throw new Error(t("aval.actions.repin.error"));
      toast.success(t("aval.actions.repin.success"));
      router.refresh();
    } catch (err: any) {
      toast.error(err.message ?? t("aval.actions.unknown-error"));
    } finally {
      setRepinning(false);
    }
  }

  async function signAval(role: AvalRoleEnum) {
    const { avaldaoAddress, avalAddress, signer } = await getContracts(aval.chainId);
    if (!avalAddress)
      throw new Error(t("aval.actions.aval-address-not-found", { id: aval._id ?? "" }));

    // Sin infoCid la firma no compromete ningún término: el mensaje EIP-712
    // quedaría sin referencia al JSON del aval.
    if (!aval.infoCid) throw new Error(t("aval.actions.missing-info-cid"));

    aval.address = avalAddress;

    const data = JSON.stringify(generateStructDataToSign(aval, avaldaoAddress));

    const signature = await walletProvider.request({
      method: "eth_signTypedData_v4",
      params: [signer.address, data],
    });

    const response = await fetch(`/api/avales/${aval._id}/signatures`, {
      method: "POST",
      body: JSON.stringify({ signature, data, role }),
    });
    if (!response.ok) throw new Error(t("aval.actions.sign.success"));
  }

  async function handleSign() {
    if (!signingRole) return;
    setSignStatus("waiting");
    try {
      await signAval(signingRole);
      setSignStatus("success");
      setTimeout(() => {
        setShowSignModal(false);
        setSignStatus("idle");
        setSigningRole(null);
        router.refresh();
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setSignStatus("error");
    }
  }

  async function startAval() {
    setShowTxTracker(true);
    await run(async () => {
      const { avalContract, signer } = await getContracts(aval.chainId);
      if (!avalContract) throw new Error(t("aval.actions.contract-not-found"));
      const signatures = getSignatures(aval);
      if (!signatures) throw new Error(t("aval.actions.incomplete-signatures"));
      const [r, v, s] = signatures;
      estimateCost(signer, avalContract.sign.populateTransaction(r, v, s));
      return avalContract.sign(r, v, s, { gasLimit: BigInt(5_000_000) });
    });
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {showTxTracker && address && (
        <TransactionTracker
          contract={{
            name: "Avaldao",
            address: contractsAddress[aval.chainId].avaldao,
          }}
          explorerUrl={contractsAddress[aval.chainId]?.explorerUrl}
          txState={txState}
          estimatedCost={estimatedCost}
          testnet={aval.chainId === 31}
          onClose={() => {
            // La página sincroniza con la blockchain al renderizar: refrescar trae el nuevo estado del aval.
            const confirmed = txState.status === "confirmed";
            clearTxState();
            setShowTxTracker(false);
            if (confirmed) router.refresh();
          }}
        />
      )}

      {/* Sin infoCid no hay términos publicados: ni aceptar ni firmar tienen sentido. */}
      {!aval.infoCid &&
        (aval.status === AvalState.SOLICITADO || aval.status === AvalState.ACEPTADO) && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-5 mb-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-red-900">{t("aval.actions.missing-info-cid.title")}</p>
                <p className="text-sm text-red-700 mt-0.5">
                  {t("aval.actions.missing-info-cid.description")}
                </p>
                {hasAvaldaoRoleOnChain && (
                  <Button className="mt-4" disabled={repinning} onClick={repinAval}>
                    {t("aval.actions.repin")}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

      {/* ── Status 0: Solicitado ── */}
      {aval.status === AvalState.SOLICITADO && hasAvaldaoRoleOnChain && (
        <div className="rounded-xl border border-violet-200 bg-violet-50/70 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-white text-violet-600 ring-1 ring-violet-200 flex items-center justify-center shrink-0">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <CardTitle>{t("aval.actions.pending-review.title")}</CardTitle>
                <p className="text-sm text-slate-600 mt-1.5">
                  {t("aval.actions.pending-review.description", {
                    amount: (aval.montoFiat / 100).toLocaleString(language === "es" ? "es-AR" : "en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }),
                    cuotas: String(aval.cuotasCantidad),
                    network: contractsAddress[aval.chainId]?.networkName ?? String(aval.chainId),
                  })}
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Qué implica aceptar */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-violet-500 mb-3">
                {t("aval.actions.pending-review.steps.title")}
              </p>
              <ol className="space-y-3">
                {[1, 2, 3].map((step) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary-soft text-white text-xs font-semibold flex items-center justify-center shrink-0">
                      {step}
                    </span>
                    <div className="text-sm">
                      <p className="font-medium text-primary">
                        {t(`aval.actions.pending-review.step${step}.title`)}
                      </p>
                      <p className="text-slate-600">
                        {t(`aval.actions.pending-review.step${step}.description`)}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="flex items-start gap-2.5 rounded-lg bg-white/80 border border-violet-100 p-3 text-sm text-slate-600">
              <Info className="w-4 h-4 text-violet-500 mt-0.5 shrink-0" />
              <p>{t("aval.actions.pending-review.not-binding")}</p>
            </div>

            {/* Sin cuenta no hay nombre verificable detrás de la address: no se acepta. */}
            {unverifiedRoles.length > 0 && (
              <div className="flex items-start gap-2.5 rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
                <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">{t("aval.actions.unverified.title")}</p>
                  <p className="mt-0.5">
                    {t("aval.actions.unverified.description", {
                      roles: unverifiedRoles.map(roleLabel).join(", "),
                    })}
                  </p>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-violet-200/70">
              {!showRejectForm ? (
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={acceptAval}
                    disabled={!aval.infoCid || unverifiedRoles.length > 0}
                    className="bg-primary-soft hover:bg-primary shadow-sm shadow-violet-500/20"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {t("aval.actions.accept")}
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-white border-violet-200 text-slate-700 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                    onClick={() => setShowRejectForm(true)}
                  >
                    <XCircle className="w-4 h-4" />
                    {t("aval.actions.reject")}
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-primary">
                    {t("aval.actions.reject.reason.label")}
                  </label>
                  <textarea
                    className="w-full rounded-md border border-violet-200 bg-white p-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400"
                    rows={3}
                    placeholder={t("aval.actions.reject.reason.placeholder")}
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  />
                  <div className="flex flex-wrap gap-2">
                    <Button
                      disabled={rejecting}
                      onClick={rejectAval}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      <XCircle className="w-4 h-4" />
                      {t("aval.actions.reject.confirm")}
                    </Button>
                    <Button
                      variant="outline"
                      className="bg-white border-violet-200 text-slate-700 hover:bg-violet-100"
                      onClick={() => {
                        setShowRejectForm(false);
                        setRejectReason("");
                      }}
                    >
                      {t("aval.actions.cancel")}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </div>
      )}

      {aval.status === AvalState.SOLICITADO && !hasAvaldaoRoleOnChain && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-5">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-blue-900">{t("aval.actions.evaluation.title")}</p>
              <p className="text-sm text-blue-700 mt-0.5">
                {t("aval.actions.evaluation.description")}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Status 1: Rechazado ── */}
      {aval.status === AvalState.RECHAZADO && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-5">
          <div className="flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-red-900">{t("aval.actions.rejected.title")}</p>
              {aval.rejectReason && (
                <p className="text-sm text-red-700 mt-1">
                  {t("aval.actions.rejected.reason", { reason: aval.rejectReason })}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Status 2: Aceptado — fase de firmas ── */}
      {aval.status === AvalState.ACEPTADO && (
        <div className="rounded-xl border border-violet-200 bg-violet-50/70 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-white text-violet-600 ring-1 ring-violet-200 flex items-center justify-center shrink-0">
                <PenLine className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <CardTitle>{t("aval.actions.signatures.title")}</CardTitle>
                  <span className="text-sm font-mono text-primary-soft shrink-0">
                    {signatureCount} / 4
                  </span>
                </div>
                <p className="text-sm text-slate-600 mt-1.5">
                  {t("aval.actions.signatures.description")}
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Progreso: barra y estado por rol */}
            <div className="space-y-3">
              <div className="h-2 rounded-full bg-violet-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary-soft transition-all"
                  style={{ width: `${(signatureCount / 4) * 100}%` }}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {signatureRoles.map(({ role, signature }) => (
                  <span
                    key={role}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs ${
                      signature
                        ? "bg-white border-green-200 text-green-700"
                        : "bg-white/60 border-violet-200 text-slate-500"
                    }`}
                  >
                    {signature ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                    {roleLabel(role)}
                  </span>
                ))}
              </div>
            </div>

            {/* Firma del usuario conectado */}
            {pendingRoles.length > 0 && roleToSign && (
              <div className="rounded-lg bg-white/80 border border-violet-100 p-4 space-y-3">
                {pendingRoles.length > 1 ? (
                  <div className="space-y-2">
                    <label htmlFor="sign-role" className="block text-sm font-medium text-primary">
                      {t("aval.actions.sign.role-label")}
                    </label>
                    <select
                      id="sign-role"
                      value={roleToSign}
                      onChange={(e) => setSelectedRole(e.target.value as AvalRoleEnum)}
                      className="w-full sm:w-72 rounded-md border border-violet-200 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-400"
                    >
                      {pendingRoles.map((role) => (
                        <option key={role} value={role}>{roleLabel(role)}</option>
                      ))}
                    </select>
                    <p className="text-xs text-slate-500">{t("aval.actions.sign.multiple-roles")}</p>
                  </div>
                ) : (
                  <p className="text-sm text-slate-600">
                    {t("aval.actions.sign.single-role")}{" "}
                    <span className="font-semibold text-primary">{roleLabel(roleToSign)}</span>.
                  </p>
                )}
                <div className="flex items-start gap-2 rounded-md bg-violet-50 border border-violet-100 px-3 py-2 text-xs text-slate-600">
                  <Info className="w-4 h-4 text-violet-500 shrink-0 mt-px" />
                  <div className="space-y-1">
                    <p>{t("aval.actions.sign.terms-agreement")}</p>
                    <p>{t("aval.actions.sign.no-cost")}</p>
                  </div>
                </div>
                <Button
                  disabled={!aval.infoCid}
                  onClick={() => { setSigningRole(roleToSign); setShowSignModal(true); }}
                  className="bg-primary-soft hover:bg-primary shadow-sm shadow-violet-500/20"
                >
                  <PenLine className="w-4 h-4" />
                  {t("aval.actions.sign-as", { role: roleLabel(roleToSign) })}
                </Button>
              </div>
            )}

            {signedRoles.length > 0 && (
              <div className="flex flex-col gap-1.5">
                {signedRoles.map((role) => (
                  <div key={role} className="flex items-center gap-2 text-sm text-green-700">
                    <CheckCircle2 className="w-4 h-4" />
                    {t("aval.actions.already-signed", { role: roleLabel(role) })}
                  </div>
                ))}
              </div>
            )}

            {/* Iniciar aval — solo Avaldao, con todas las firmas */}
            {canStartAval && (
              <div className="pt-4 border-t border-violet-200/70">
                <p className="text-sm text-slate-600 mb-3">
                  {t("aval.actions.all-signed.description")}
                </p>
                <Button
                  onClick={startAval}
                  className="bg-primary-soft hover:bg-primary shadow-sm shadow-violet-500/20"
                >
                  <PlayCircle className="w-4 h-4" />
                  {t("aval.actions.start-aval")}
                </Button>
              </div>
            )}

            {allSigned && !canStartAval && (
              <div className="flex items-center gap-2 text-sm text-slate-600 pt-4 border-t border-violet-200/70">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                {t("aval.actions.waiting-avaldao")}
              </div>
            )}
          </CardContent>
        </div>
      )}

      {/* ── Status 3: Vigente ── */}
      {aval.status === AvalState.VIGENTE && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-green-900">{t("aval.actions.active.title")}</p>
              <p className="text-sm text-green-700 mt-0.5">
                {t("aval.actions.active.description")}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Status 4: Finalizado ── */}
      {aval.status === AvalState.FINALIZADO && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-slate-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-slate-700">{t("aval.actions.finalized.title")}</p>
              <p className="text-sm text-slate-500 mt-0.5">
                {t("aval.actions.finalized.description")}
              </p>
            </div>
          </div>
        </div>
      )}
      {showSignModal && signingRole && (
        <SignModal
          address={address}
          status={signStatus}
          onSign={handleSign}
          onClose={() => {
            setShowSignModal(false);
            setSignStatus("idle");
          }}
          t={t}
          badgeKey="aval.sign.badge"
          idleTitleKey="aval.sign.idle.title"
          idleDescKey="aval.sign.idle.description"
          terms={signTerms?.texto}
          termsWarning={signTerms?.warning}
          infoCid={aval.infoCid}
          testnet={aval.chainId === 31}
        />
      )}
    </>
  );
}
