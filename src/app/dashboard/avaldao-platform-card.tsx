"use client";

import { useState, useEffect, useMemo } from "react";
import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import { BrowserProvider, Contract, Eip1193Provider, formatEther, formatUnits } from "ethers";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, Unlock, RefreshCw, ExternalLink, Link as LinkIcon, ChevronUp, ChevronDown, ChevronsUpDown, ArrowDownLeft, ArrowUpRight, HardHat } from "lucide-react";

import { contractsAddress } from "@/blockchain/contracts";
import avalAbi from "@/blockchain/contracts/avaldao/aval.abi";
import { ROOTSTOCK_NETWORKS } from "@/config";
import TransactionTracker from "@/components/blockchain/transaction-tracker/transaction-tracker";
import useBlockchainTransaction from "@/hooks/useBlockchainTransaction";
import { Language, translations } from "@/translations";
import type { AvalOnchainData, IAvaldaoPlatformStatus } from "@/lib/db/models/avaldao-platform-status-model";
import type { Role } from "@/roles";
import Link from "next/link";

const ONCHAIN_ACEPTADO = 2;
const ONCHAIN_VIGENTE = 3;
const ONCHAIN_FINALIZADO = 4;


interface DocTransfer {
  txHash: string;
  blockNumber: number;
  from: string;
  to: string;
  amount: bigint;
  direction: "in" | "out";
}

interface PlatformStatusResponse extends IAvaldaoPlatformStatus {
  _id: string;
  cached: boolean;
}

interface Props {
  language: Language;
  nroles: { [chainId: number]: Role[] };
}

export default function AvaldaoPlatformCard({ language, nroles }: Props) {
  const t = (key: string) => translations[key]?.[language] ?? key;
  const { walletProvider } = useAppKitProvider<Eip1193Provider>("eip155");
  const { address: currentAddress } = useAppKitAccount();

  const [chainId, setChainId] = useState<30 | 31>(30);
  const [data, setData] = useState<PlatformStatusResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTxTracker, setShowTxTracker] = useState(false);
  const [transactionCost, setTransactionCost] = useState<string | null>(null);
  const [activeUnlockAval, setActiveUnlockAval] = useState<AvalOnchainData | null>(null);
  const [statusFilter, setStatusFilter] = useState<number | null>(null);
  const [sortConfig, setSortConfig] = useState<{ field: "status" | "endDate"; dir: "asc" | "desc" }>({ field: "status", dir: "asc" });
  const [transfers, setTransfers] = useState<DocTransfer[]>([]);
  const [transfersLoading, setTransfersLoading] = useState(false);
  const [transfersError, setTransfersError] = useState<string | null>(null);

  const provider = useMemo(() => walletProvider ? new BrowserProvider(walletProvider) : null, [walletProvider]);
  const { run, txState, clearTxState } = useBlockchainTransaction(provider);

  const networkInfo = contractsAddress[chainId];
  const isAvaldaoRole = nroles[chainId]?.includes("AVALDAO_ROLE") ?? false;

  async function fetchStatus(cid: 30 | 31, invalidate = false) {
    setLoading(true);
    setError(null);
    try {
      if (invalidate) {
        await fetch(`/api/platform-status?chainId=${cid}`, { method: "PATCH" });
      }
      const res = await fetch(`/api/platform-status?chainId=${cid}`);
      if (!res.ok) throw new Error(await res.text());
      setData(await res.json());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchDocTransfers(cid: 30 | 31) {
    setTransfersLoading(true);
    setTransfersError(null);
    try {
      const res = await fetch(`/api/doc-transfers?chainId=${cid}`);
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setTransfers(
        (json.transfers as Array<Omit<DocTransfer, "amount"> & { amount: string }>).map((tx) => ({
          ...tx,
          amount: BigInt(tx.amount),
        }))
      );
    } catch (e: any) {
      setTransfersError(e.message);
    } finally {
      setTransfersLoading(false);
    }
  }

  useEffect(() => {
    fetchStatus(chainId);
    fetchDocTransfers(chainId);
  }, [chainId]);

  async function switchToChain(targetChainId: 30 | 31) {
    if (!walletProvider) return;
    const networkKey = targetChainId === 30 ? "mainnet" : "testnet";
    const networkConfig = ROOTSTOCK_NETWORKS[networkKey];
    if (!networkConfig) return;
    try {
      await (walletProvider as Eip1193Provider).request({ method: "wallet_switchEthereumChain", params: [{ chainId: networkConfig.chainId }] });
    } catch (err: any) {
      if (err.code === 4902) {
        await (walletProvider as Eip1193Provider).request({ method: "wallet_addEthereumChain", params: [networkConfig] });
      }
    }
  }

  async function handleUnlockManual(aval: AvalOnchainData) {
    setActiveUnlockAval(aval);
    setShowTxTracker(true);
    await run(async () => {
      if (!walletProvider) throw new Error("No wallet connected");
      let ethersProvider = new BrowserProvider(walletProvider as Eip1193Provider);
      const connectedChainId = Number((await ethersProvider.getNetwork()).chainId);
      if (connectedChainId !== chainId) {
        await switchToChain(chainId);
        ethersProvider = new BrowserProvider(walletProvider as Eip1193Provider);
      }
      const signer = await ethersProvider.getSigner();
      const avalContract = new Contract(aval.address, avalAbi, signer);

      const [estimatedGas, feeData] = await Promise.all([
        avalContract.unlockFundManual.estimateGas(),
        ethersProvider.getFeeData(),
      ]);
      const gasPrice = feeData.gasPrice ?? feeData.maxFeePerGas ?? BigInt(0);
      const costWei = estimatedGas * gasPrice;
      const costNum = parseFloat(formatEther(costWei));
      const symbol = chainId === 31 ? "tRBTC" : "RBTC";
      setTransactionCost(`~${costNum.toFixed(8).replace(/0+$/, "").replace(/\.$/, "")} ${symbol}`);

      return avalContract.unlockFundManual();
    });
  }

  async function handleTxClose() {
    clearTxState();
    setShowTxTracker(false);
    setActiveUnlockAval(null);
    setTransactionCost(null);
    await fetch(`/api/platform-status?chainId=${chainId}`, { method: "PATCH" });
    fetchStatus(chainId);
  }

  const activeAvales = (data?.avales ?? []).filter((a) =>
    a.onchainStatus === ONCHAIN_ACEPTADO ||
    a.onchainStatus === ONCHAIN_VIGENTE ||
    a.onchainStatus === ONCHAIN_FINALIZADO
  );
  const filteredAvales = statusFilter === null
    ? activeAvales
    : activeAvales.filter((a) => a.onchainStatus === statusFilter);

  const handleSort = (field: "status" | "endDate") => {
    setSortConfig((prev) =>
      prev.field === field
        ? { field, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { field, dir: "asc" }
    );
  };

  const SortIcon = ({ field }: { field: "status" | "endDate" }) => {
    if (sortConfig.field !== field) return <ChevronsUpDown className="w-3 h-3 opacity-40" />;
    return sortConfig.dir === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />;
  };

  const sortedAvales = [...filteredAvales].sort((a, b) => {
    if (sortConfig.field === "status") {
      return sortConfig.dir === "asc"
        ? a.onchainStatus - b.onchainStatus
        : b.onchainStatus - a.onchainStatus;
    }
    const at = a.lastCuotaTimestamp;
    const bt = b.lastCuotaTimestamp;
    if (at === 0 && bt === 0) return 0;
    if (at === 0) return 1;
    if (bt === 0) return -1;
    return sortConfig.dir === "asc" ? at - bt : bt - at;
  });

  const totalUnlockableMonto = (data?.avales ?? []).reduce((sum, a) => {
    if (a.onchainStatus == ONCHAIN_VIGENTE && a.cuotasCantidad > 0 && a.unlockableCuotasCount > 0) {
      return sum + (a.montoFiat / a.cuotasCantidad) * a.unlockableCuotasCount;
    }
    return sum;
  }, 0);

  return (
    <div className="space-y-4">
      {/* Network switch */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-sm text-slate-500">{t("dashboard.platform.network")}:</span>
        <div className="flex rounded-lg border border-slate-200 overflow-hidden">
          <button
            className={`px-4 py-1.5 text-sm font-medium transition-colors ${chainId === 30
              ? "bg-violet-600 text-white"
              : "bg-white text-slate-600 hover:bg-slate-50"
              }`}
            onClick={() => setChainId(30)}
          >
            Mainnet
          </button>
          <button
            className={`px-4 py-1.5 text-sm font-medium transition-colors ${chainId === 31
              ? "bg-violet-600 text-white"
              : "bg-white text-slate-600 hover:bg-slate-50"
              }`}
            onClick={() => setChainId(31)}
          >
            Testnet
          </button>
        </div>
        <button
          onClick={() => fetchStatus(chainId, true)}
          disabled={loading}
          className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
          title={t("dashboard.platform.refresh")}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
        {data && (
          <span className="text-xs text-slate-400">
            {data.cached ? t("dashboard.platform.cached") : t("dashboard.platform.live")}
            {" · "}
            {format(new Date(data.fetchedAt), "HH:mm:ss")}
          </span>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {t("dashboard.platform.error")}: {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && !data && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      )}

      {data && (
        <>
          {/* Contract address */}
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>{t("dashboard.platform.contract")}:</span>
            <a
              href={`${networkInfo.explorerUrl}/address/${networkInfo.avaldao}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-violet-600 hover:underline flex items-center gap-1"
            >
              {networkInfo.avaldao.slice(0, 10)}…{networkInfo.avaldao.slice(-8)}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-5 pb-4">
                <p className="text-xs text-slate-500 mb-1">{t("dashboard.platform.fund-balance")}</p>
                <p className="text-xl font-bold text-green-600">
                  $ {(data.fundBalanceDOC / 100).toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">USD (DOC)</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 pb-4">
                <p className="text-xs text-slate-500 mb-1">{t("dashboard.platform.vigentes")}</p>
                <p className="text-xl font-bold text-violet-600">
                  {activeAvales.filter((a) => a.onchainStatus === ONCHAIN_VIGENTE).length}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{t("dashboard.platform.avales")}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 pb-4">
                <p className="text-xs text-slate-500 mb-1">{t("dashboard.platform.finalizados")}</p>
                <p className="text-xl font-bold text-slate-600">
                  {activeAvales.filter((a) => a.onchainStatus === ONCHAIN_FINALIZADO).length}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{t("dashboard.platform.avales")}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 pb-4">
                <p className="text-xs text-slate-500 mb-1">{t("dashboard.platform.unlockable")}</p>
                <p
                  className={`text-xl font-bold ${data.totalUnlockableCuotas > 0 ? "text-orange-500" : "text-slate-600"
                    }`}
                >
                  {data.totalUnlockableCuotas}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{t("dashboard.platform.cuotas")}</p>
                {totalUnlockableMonto > 0 && (
                  <p className="text-xs text-orange-400 mt-1 font-medium">
                    $ {totalUnlockableMonto.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Unlock alert for AVALDAO_ROLE */}
          {isAvaldaoRole && data.totalUnlockableCuotas > 0 && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-start gap-3">
                <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-900 text-sm">
                    {data.totalUnlockableCuotas}{" "}
                    {data.totalUnlockableCuotas === 1
                      ? t("dashboard.platform.cuota-singular")
                      : t("dashboard.platform.cuotas-plural")}{" "}
                    {t("dashboard.platform.ready-to-unlock")}
                  </p>
                  <p className="text-xs text-amber-700 mt-1">
                    {t("dashboard.platform.unlock-description")}
                  </p>
                  <p className="text-xs text-amber-700 mt-1">
                    {t("dashboard.platform.unlock-solicitante-hint")}
                  </p>
                </div>
              </div>
            </div>
          )}

          {showTxTracker && activeUnlockAval && (
            <TransactionTracker
              balance={null}
              contract={{ name: "Aval", address: activeUnlockAval.address }}
              explorerUrl={networkInfo.explorerUrl}
              txState={txState}
              hint={t("dashboard.platform.unlock-manual-hint")}
              transactionCost={transactionCost ?? undefined}
              onClose={handleTxClose}
            />
          )}

          {/* Avales on-chain */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                {t("dashboard.platform.avales-onchain")}
                <Badge variant="outline" className="text-xs font-normal">
                  {networkInfo.networkName}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Status filter */}
              <div className="flex gap-1 flex-wrap mb-4">
                {([
                  { label: t("dashboard.platform.filter-all"), value: null },
                  { label: t("dashboard.platform.status-aceptado"), value: ONCHAIN_ACEPTADO },
                  { label: t("dashboard.platform.status-vigente"), value: ONCHAIN_VIGENTE },
                  { label: t("dashboard.platform.status-finalizado"), value: ONCHAIN_FINALIZADO },
                ] as { label: string; value: number | null }[]).map(({ label, value }) => (
                  <button
                    key={String(value)}
                    onClick={() => setStatusFilter(value)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${statusFilter === value
                      ? "bg-slate-800 text-white border-slate-800"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                      }`}
                  >
                    {label}
                    <span className="ml-1.5 opacity-60">
                      {value === null
                        ? activeAvales.length
                        : activeAvales.filter((a) => a.onchainStatus === value).length}
                    </span>
                  </button>
                ))}
              </div>
              {filteredAvales.length === 0 ? (
                <p className="text-sm text-slate-400">{t("dashboard.platform.no-vigentes")}</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-slate-500 border-b">
                        <th className="pb-2 pr-6 font-medium">ID</th>
                        <th className="pb-2 pr-6 font-medium">{t("dashboard.platform.col-address")}</th>
                        <th className="pb-2 pr-6 font-medium">{t("dashboard.platform.col-solicitante")}</th>
                        <th className="pb-2 pr-6 font-medium text-right">{t("dashboard.platform.col-monto")}</th>
                        <th className="pb-2 pr-6 font-medium text-right">{t("dashboard.platform.col-cuotas")}</th>
                        <th className="pb-2 pr-6 font-medium text-right">{t("dashboard.platform.col-unlockable-cuotas")}</th>
                        <th className="pb-2 pr-6 font-medium text-right">{t("dashboard.platform.col-reclamos")}</th>
                        <th className="pb-2 pr-6 font-medium">
                          <button onClick={() => handleSort("status")} className="flex items-center gap-1 hover:text-slate-800">
                            {t("dashboard.platform.col-status")}
                            <SortIcon field="status" />
                          </button>
                        </th>
                        <th className="pb-2 pr-6 font-medium">
                          <button onClick={() => handleSort("endDate")} className="flex items-center gap-1 hover:text-slate-800">
                            {t("dashboard.platform.col-end-date")}
                            <SortIcon field="endDate" />
                          </button>
                        </th>
                        <th className="pb-2 font-medium" />
                      </tr>
                    </thead>
                    <tbody>
                      {sortedAvales.map((aval) => (
                        <tr key={aval.address} className="font-mono border-b border-slate-50 hover:bg-slate-50 transition-colors">
                          <td className="py-2 pr-6">
                            <a href={`/avales/${aval.id}`} className="text-xs text-slate-500 hover:text-violet-600 flex items-center gap-1">
                              {aval.id.slice(0, 10)}…
                              <LinkIcon className="w-3 h-3 shrink-0" />
                            </a>
                          </td>
                          <td className="py-2 pr-6">
                            <Link
                              href={`${networkInfo.explorerUrl}/address/${aval.address}`}
                              className="text-violet-600 hover:underline flex items-center gap-1 text-xs"
                            >
                              {aval.address.slice(0, 8)}…{aval.address.slice(-6)}
                              <ExternalLink className="w-3 h-3 shrink-0" />
                            </Link>
                          </td>
                          <td className="py-2 pr-6 font-sans text-xs text-slate-600">
                            {(() => {
                              const { name, address: addr } = aval.solicitante ?? {};
                              const shortAddr = addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : null;
                              const addrLink = addr ? (
                                <a
                                  href={`${networkInfo.explorerUrl}/address/${addr}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-mono text-violet-500 hover:underline"
                                >
                                  {shortAddr}
                                </a>
                              ) : null;
                              if (name && addrLink) return <span>{name} ({addrLink})</span>;
                              if (name) return <span>{name}</span>;
                              if (addrLink) return addrLink;
                              return <span className="text-slate-400">—</span>;
                            })()}
                          </td>
                          <td className="py-2 pr-6 text-right font-sans text-xs">
                            $ {(aval.montoFiat ?? 0).toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-2 pr-6 text-right font-sans">{aval.cuotasCantidad}</td>
                          <td className="py-2 pr-6 text-right font-sans">
                            {aval.unlockableCuotasCount > 0 ? (
                              <>
                                <span className="text-orange-500 font-medium">{aval.unlockableCuotasCount}</span>
                                <span className="text-orange-500 text-xs font-medium ml-2">(${(aval.unlockableCuotasCount * (aval.montoFiat / aval.cuotasCantidad)).toLocaleString("es-AR", { minimumFractionDigits: 2 })})</span>
                              </>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                          <td className="py-2 pr-6 text-right font-sans">
                            {aval.openReclamosCount > 0 ? (
                              <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                                {aval.openReclamosCount}
                              </span>
                            ) : (
                              <span className="text-xs text-slate-400">—</span>
                            )}
                          </td>
                          <td className="py-2 pr-6">
                            <OnchainStatusBadge status={aval.onchainStatus} t={t} />
                          </td>
                          <td className="py-2 pr-6 text-xs text-slate-600">
                            {aval.lastCuotaTimestamp > 0
                              ? format(new Date(aval.lastCuotaTimestamp * 1000), "dd/MM/yyyy")
                              : "—"}
                          </td>
                          <td className="py-2">
                            {aval.unlockableCuotasCount > 0 &&
                              aval.solicitante?.address?.toLowerCase() === currentAddress?.toLowerCase() && (
                              <button
                                onClick={() => handleUnlockManual(aval)}
                                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium text-violet-600 bg-violet-50 hover:bg-violet-100 ring-1 ring-violet-200 hover:ring-violet-300 transition-colors whitespace-nowrap"
                              >
                                <Unlock className="w-3 h-3" />
                                {t("dashboard.platform.unlock-btn")}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent activity */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{t("dashboard.platform.recent-activity")}</CardTitle>
            </CardHeader>
            <CardContent>
              {transfersLoading && (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-8 rounded-lg bg-slate-100 animate-pulse" />
                  ))}
                </div>
              )}
              {!transfersLoading && transfersError && (
                <p className="text-sm text-red-500">{t("dashboard.platform.transfers-error")}</p>
              )}
              {!transfersLoading && !transfersError && transfers.length === 0 && (
                <div className="flex flex-col items-center py-4 text-slate-400">
                  <HardHat className="mb-2 h-6 w-6 text-yellow-400" />
                  <p className="text-sm font-medium">{t("dashboard.platform.under-construction")}</p>
                  <p className="text-xs">{t("dashboard.platform.coming-soon")}</p>
                </div>
              )}
              {!transfersLoading && !transfersError && transfers.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-slate-500 border-b">
                        <th className="pb-2 pr-4 font-medium">{t("dashboard.platform.col-direction")}</th>
                        <th className="pb-2 pr-4 font-medium text-right">{t("dashboard.platform.col-amount-doc")}</th>
                        <th className="pb-2 pr-4 font-medium">{t("dashboard.platform.col-counterpart")}</th>
                        <th className="pb-2 font-medium">{t("dashboard.platform.col-tx")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transfers.map((tx) => {
                        const counterpart = tx.direction === "out" ? tx.to : tx.from;
                        const amountDoc = Number(formatUnits(tx.amount, 18));
                        return (
                          <tr key={tx.txHash + tx.blockNumber} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                            <td className="py-2 pr-4">
                              {tx.direction === "in" ? (
                                <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700">
                                  <ArrowDownLeft className="w-3.5 h-3.5" />
                                  {t("dashboard.platform.transfer-in")}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-xs font-medium text-orange-600">
                                  <ArrowUpRight className="w-3.5 h-3.5" />
                                  {t("dashboard.platform.transfer-out")}
                                </span>
                              )}
                            </td>
                            <td className="py-2 pr-4 text-right font-mono text-xs font-medium">
                              {amountDoc.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                            <td className="py-2 pr-4 font-mono text-xs">
                              <a
                                href={`${networkInfo.explorerUrl}/address/${counterpart}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-violet-600 hover:underline flex items-center gap-1"
                              >
                                {counterpart.slice(0, 8)}…{counterpart.slice(-6)}
                                <ExternalLink className="w-3 h-3 shrink-0" />
                              </a>
                            </td>
                            <td className="py-2 font-mono text-xs">
                              <a
                                href={`${networkInfo.explorerUrl}/tx/${tx.txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-violet-600 hover:underline flex items-center gap-1"
                              >
                                {tx.txHash.slice(0, 8)}…
                                <ExternalLink className="w-3 h-3 shrink-0" />
                              </a>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

function OnchainStatusBadge({ status, t }: { status: number; t: (key: string) => string }) {
  if (status === ONCHAIN_ACEPTADO) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-yellow-700">
        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 shrink-0" />
        {t("dashboard.platform.status-aceptado")}
      </span>
    );
  }
  if (status === ONCHAIN_VIGENTE) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-violet-700">
        <span className="w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" />
        {t("dashboard.platform.status-vigente")}
      </span>
    );
  }
  if (status === ONCHAIN_FINALIZADO) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
        {t("dashboard.platform.status-finalizado")}
      </span>
    );
  }
  return <span className="text-xs text-slate-400">{status}</span>;
}
