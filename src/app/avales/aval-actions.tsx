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
import { PenLine, PlayCircle, CheckCircle2, Clock, XCircle, AlertCircle, ShieldCheck } from "lucide-react";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/context/LanguageContext";
import { ROOTSTOCK_NETWORKS } from "@/config";
import toast from "react-hot-toast";
import avalAbi from "@/blockchain/contracts/avaldao/aval.abi";
import { generateStructDataToSign, getTranchesTs } from "../entities/aval.entity";
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

export default function AvalActions({ aval }: { aval: Aval }) {
  const { data: session } = useSession();
  const { t } = useLanguage();
  const router = useRouter();
  const { walletProvider } = useAppKitProvider<Eip1193Provider>("eip155");
  const { address } = useAppKitAccount();
  const [showTxTracker, setShowTxTracker] = useState(false);
  const [balance, setBalance] = useState<string | null>(null);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejecting, setRejecting] = useState(false);
  const [showSignModal, setShowSignModal] = useState(false);
  const [signStatus, setSignStatus] = useState<SignStatus>("idle");
  const [signingRole, setSigningRole] = useState<AvalRoleEnum | null>(null);

  const provider = useMemo(() => {
    if (!walletProvider) return null;
    return new BrowserProvider(walletProvider);
  }, [walletProvider]);

  const { run, txState, clearTxState } = useBlockchainTransaction(provider);

  if (!session?.user) return null;

  const user = session.user;

  // Role checks
  const hasAvaldaoRoleOnChain =
    !!user.nroles?.[aval.chainId]?.includes("AVALDAO_ROLE");

  // Signing: collect all roles where the connected wallet matches (a wallet can be multiple participants)
  const myRoles: { role: AvalRoleEnum; signature: string | undefined }[] = address
    ? (
        [
          { role: "solicitante" as AvalRoleEnum, addr: aval.solicitanteAddress, signature: aval.solicitanteSignature },
          { role: "comerciante" as AvalRoleEnum, addr: aval.comercianteAddress, signature: aval.comercianteSignature },
          { role: "avalado"    as AvalRoleEnum, addr: aval.avaladoAddress,     signature: aval.avaladoSignature    },
          { role: "avaldao"    as AvalRoleEnum, addr: aval.avaldaoAddress,     signature: aval.avaldaoSignature    },
        ] as { role: AvalRoleEnum; addr: string; signature: string | undefined }[]
      )
        .filter(({ addr }) => addr && address.toLowerCase() === addr.toLowerCase())
        .map(({ role, signature }) => ({ role, signature }))
    : [];

  const signatureCount = [
    aval.solicitanteSignature,
    aval.comercianteSignature,
    aval.avaladoSignature,
    aval.avaldaoSignature,
  ].filter(Boolean).length;

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
    setShowTxTracker(true);
    await run(async () => {
      const { avaldao } = await getContracts(aval.chainId);
      const tx = await avaldao.saveAval(
        aval._id,
        aval.infoCid ?? "",
        [
          aval.avaldaoAddress,
          aval.solicitanteAddress,
          aval.comercianteAddress,
          aval.avaladoAddress,
        ],
        aval.montoFiat,
        getTranchesTs(aval).map((ts: number) => `0x${ts.toString(16)}`),
        { gasLimit: BigInt(5_000_000) }
      );
      return tx;
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

  async function signAval(role: AvalRoleEnum) {
    const { avaldaoAddress, avalAddress, signer } = await getContracts(aval.chainId);
    if (!avalAddress)
      throw new Error(t("aval.actions.aval-address-not-found", { id: aval._id ?? "" }));

    aval.infoCid = aval.infoCid ?? "";
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
      const { avalContract } = await getContracts(aval.chainId);
      if (!avalContract) throw new Error(t("aval.actions.contract-not-found"));
      const signatures = getSignatures(aval);
      if (!signatures) throw new Error(t("aval.actions.incomplete-signatures"));
      const [r, v, s] = signatures;
      return avalContract.sign(r, v, s, { gasLimit: BigInt(5_000_000) });
    });
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {showTxTracker && address && (
        <TransactionTracker
          balance={balance ? `${balance} tRBTC` : null}
          contract={{
            name: "Avaldao",
            address: contractsAddress[aval.chainId].avaldao,
          }}
          explorerUrl={contractsAddress[aval.chainId]?.explorerUrl}
          txState={txState}
          onClose={() => {
            clearTxState();
            setShowTxTracker(false);
          }}
        />
      )}

      {/* ── Status 0: Solicitado ── */}
      {aval.status === AvalState.SOLICITADO && hasAvaldaoRoleOnChain && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-5">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-amber-900">{t("aval.actions.pending-review.title")}</p>
              <p className="text-sm text-amber-700 mt-0.5">
                {t("aval.actions.pending-review.description")}
              </p>

              {!showRejectForm ? (
                <div className="flex gap-3 mt-4">
                  <Button onClick={acceptAval}>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    {t("aval.actions.accept")}
                  </Button>
                  <Button
                    variant="outline"
                    className="border-red-300 text-red-700 hover:bg-red-300"
                    onClick={() => setShowRejectForm(true)}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    {t("aval.actions.reject")}
                  </Button>
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  <textarea
                    className="w-full rounded-md border border-amber-300 bg-white p-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    rows={3}
                    placeholder={t("aval.actions.reject.reason.placeholder")}
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="destructive"
                      disabled={rejecting}
                      onClick={rejectAval}
                    >
                      {t("aval.actions.reject.confirm")}
                    </Button>
                    <Button
                      variant="ghost"
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
          </div>
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
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 space-y-4">
          {/* Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-slate-700">
                {t("aval.actions.signatures.title")}
              </span>
              <span className="text-sm font-mono text-slate-500">
                {signatureCount} / 4
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-2">
              {t("aval.actions.signatures.description")}
            </p>
            <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full rounded-full bg-green-500 transition-all"
                style={{ width: `${(signatureCount / 4) * 100}%` }}
              />
            </div>
          </div>

          {/* Sign buttons — one per unsigned matching role */}
          {myRoles.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-2">
              {myRoles.filter(({ signature }) => !signature).map(({ role }) => (
                <div key={role} className="flex items-center gap-3">
                  <Button onClick={() => { setSigningRole(role); setShowSignModal(true); }}>
                    <PenLine className="w-4 h-4 mr-2" />
                    {t("aval.actions.sign-as", { role })}
                  </Button>
                </div>
              ))}
              </div>
              <div className="flex flex-row gap-2">
              {myRoles.filter(({ signature }) => !!signature).map(({ role }) => (
                <div key={role} className="flex items-center gap-2 text-sm text-green-700">
                  <CheckCircle2 className="w-4 h-4" />
                  {t("aval.actions.already-signed", { role })}
                </div>
              ))}
              </div>
            </div>
          )}

          {/* Start aval — only avaldao once all signed */}
          {canStartAval && (
            <div className="pt-2 border-t border-slate-200">
              <p className="text-sm text-slate-600 mb-3">
                {t("aval.actions.all-signed.description")}
              </p>
              <Button onClick={startAval}>
                <PlayCircle className="w-4 h-4 mr-2" />
                {t("aval.actions.start-aval")}
              </Button>
            </div>
          )}

          {allSigned && !canStartAval && (
            <div className="flex items-center gap-2 text-sm text-slate-600 pt-2 border-t border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              {t("aval.actions.waiting-avaldao")}
            </div>
          )}
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
        />
      )}
    </>
  );
}
