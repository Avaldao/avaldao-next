"use client";

import { useEffect, useRef, useState } from "react";
import { useAppKitAccount, useAppKitNetwork, useWalletInfo } from "@reown/appkit/react";
import { AbiCoder, BrowserProvider, ContractTransactionReceipt, ContractTransactionResponse, EthersError, Provider, TransactionReceipt, isError } from "ethers";
import {
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  Copy,
} from "lucide-react";

import {
  StepBadge, SpinnerRing, TxState, ContractInfo, STATUS_COPY, Step1Status, Step2Status,
  shortAddress,
  explorerTxUrl
} from "./utils";


interface TransactionTrackerProps {
  balance: string | null;
  txState: TxState;
  contract: ContractInfo;
  explorerUrl?: string;
  onClose?: () => void;
}



export default function TransactionTracker({
  txState,
  contract,
  explorerUrl = "https://etherscan.io",
  balance,
  onClose,
}: TransactionTrackerProps) {
  const { address } = useAppKitAccount();
  const { caipNetwork } = useAppKitNetwork();
  const [copiedReason, setCopiedReason] = useState(false);
  const networkName = caipNetwork?.name ?? "Unknown network";


  const currentStatus = txState.status as Step1Status | Step2Status;
  const copy = STATUS_COPY[currentStatus];
  const isWaiting = currentStatus === "waiting_approval" || currentStatus === "waiting_confirmation";
  const hasError = currentStatus == "rejected" || currentStatus === "expired" || currentStatus === "reverted" || currentStatus === "error";
  const txHash = txState.step === 2 || txState.txHash ? txState.txHash : undefined;

  const handleCopyErrorReason = async () => {
    if (!txState.errReason) return;

    try {
      await navigator.clipboard.writeText(txState.errReason);
      setCopiedReason(true);
      setTimeout(() => setCopiedReason(false), 1500);
    } catch {
      setCopiedReason(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-zinc-900 shadow-xl ring-1 ring-black/5 dark:ring-white/10 overflow-hidden">

        {/* Header */}
        <div className="px-6 pt-6 pb-4 space-y-4">
          <StepBadge current={txState.step} />
          <SpinnerRing status={currentStatus} />

          <div className="text-center space-y-1">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              {copy.title}
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {copy.description}
            </p>
          </div>
        </div>

        {/* Info rows */}
        <div className="mx-6 mb-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 divide-y divide-zinc-100 dark:divide-zinc-700 ring-1 ring-zinc-100 dark:ring-zinc-700">

          {/* Network */}
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-xs text-zinc-400 dark:text-zinc-500">Network</span>
            <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
              {networkName}
            </span>
          </div>


          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-xs text-zinc-400 dark:text-zinc-500">Account</span>
            {address ? (
              <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-200 font-mono">
                {shortAddress(address)}
              </span>
            ) : (
              <span className="w-16 h-4 rounded bg-zinc-300 dark:bg-zinc-700 animate-pulse inline-block" />
            )}
          </div>

          {/* Your balance */}
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-xs text-zinc-400 dark:text-zinc-500">Balance</span>
            <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-200">
              {balance ?
                `${balance}` :
                <span className="w-12 h-4 rounded bg-zinc-300 dark:bg-zinc-700 animate-pulse inline-block" />}
            </span>
          </div>

          {/* Contract */}
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-xs text-zinc-400 dark:text-zinc-500">Contract</span>
            <div className="text-right">
              <p className="text-xs font-medium text-zinc-700 dark:text-zinc-200">{contract.name}</p>
              <p className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
                {shortAddress(contract.address)}
              </p>
            </div>
          </div>

          {/* Tx hash (once available) */}
          {txHash && (
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-xs text-zinc-400 dark:text-zinc-500">Tx hash</span>
              <a
                href={explorerTxUrl(explorerUrl, txHash)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[11px] font-mono text-violet-500 hover:underline"
              >
                {shortAddress(txHash)}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {/* Block number on confirmation */}
          {txState.step === 2 &&
            txState.status === "confirmed" &&
            txState.receipt?.blockNumber && (
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-xs text-zinc-400 dark:text-zinc-500">Block</span>
                <span className="text-xs font-medium text-zinc-700 dark:text-zinc-200">
                  #{txState.receipt.blockNumber.toString()}
                </span>
              </div>
            )}
        </div>

        {/* Status pill / action row */}
        <div className="px-6 pb-6 space-y-3">
          {isWaiting && (
            <div className="flex items-center justify-between rounded-lg bg-zinc-50 dark:bg-zinc-800 ring-1 ring-zinc-100 dark:ring-zinc-700 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {currentStatus === "waiting_approval" ? "Awaiting signature…" : "Pending on-chain…"}
                </span>
              </div>
              {currentStatus === "waiting_approval" && onClose && (
                <button
                  onClick={onClose}
                  className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          )}

          {hasError && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-950/40 ring-1 ring-red-100 dark:ring-red-900 px-4 py-2.5 max-h-40 overflow-auto">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <div className="text-xs text-red-600 dark:text-red-400 w-full">
                {txState.errReason && (
                  <button
                    type="button"
                    onClick={handleCopyErrorReason}
                    className="mb-2 inline-flex items-center gap-1 rounded-md border border-red-200 dark:border-red-800 px-2 py-1 text-[11px] font-medium text-red-700 dark:text-red-300 hover:bg-red-100/70 dark:hover:bg-red-900/40 transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                    {copiedReason ? "Copied" : "Copy reason"}
                  </button>
                )}

                {currentStatus === "expired"
                  ? "Signing request timed out" :
                  currentStatus === "rejected" ? "Transaction rejected by user"
                    : "Transaction was reverted on-chain"}
                <div className="w-full overflow-hidden break-all mt-1">
                  {txState.errReason && `${txState.errReason}`}
                </div>
              </div>
            </div>
          )}

          {currentStatus === "confirmed" && (
            <div className="flex items-center gap-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 ring-1 ring-emerald-100 dark:ring-emerald-900 px-4 py-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="text-xs text-emerald-700 dark:text-emerald-400">
                Transaction confirmed successfully
              </span>
            </div>
          )}

          {(currentStatus === "confirmed" || hasError) && onClose && (
            <button
              onClick={onClose}
              className="w-full rounded-xl py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              Close
            </button>
          )}

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            Secure blockchain transaction
          </div>
        </div>

      </div>
    </div>
  );
}


