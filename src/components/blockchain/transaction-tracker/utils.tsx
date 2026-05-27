"use client";

import { ContractTransactionResponse, TransactionReceipt } from "ethers";
import {
  Wallet,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";


// ─── Types ────────────────────────────────────────────────────────────────────

export type Step1Status = "waiting_approval" | "sent" | "expired" | "rejected";
export type Step2Status = "waiting_confirmation" | "confirmed" | "reverted";

export type TxState =
  | { step: 1; status: Step1Status; txHash?: string}
  | { step: 2; status: Step2Status; txHash: string; receipt?: TransactionReceipt, errReason?: string };

export interface ContractInfo {
  name: string;
  address: string;
}


// ─── Helpers ─────────────────────────────────────────────────────────────────

export function shortAddress(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function explorerTxUrl(base: string, hash: string) {
  return `${base.replace(/\/$/, "")}/tx/${hash}`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface StepBadgeProps {
  current: 1 | 2;
}
export function StepBadge({ current }: StepBadgeProps) {
  return (
    <div className="flex items-center gap-2 text-xs font-medium text-violet-500 bg-violet-50 dark:bg-violet-950 dark:text-violet-300 px-3 py-1 rounded-full w-fit mx-auto">
      Step {current} of 2
    </div>
  );
}

interface SpinnerRingProps {
  status: Step1Status | Step2Status;
}
export function SpinnerRing({ status }: SpinnerRingProps) {
  const isWaiting =
    status === "waiting_approval" || status === "waiting_confirmation";
  const isSuccess = status === "sent" || status === "confirmed";
  const isError = status === "expired" || status === "reverted" || status === "rejected";

  const ringColor = isError
    ? "text-red-400"
    : isSuccess
      ? "text-emerald-400"
      : "text-violet-400";

  const iconBg = isError
    ? "bg-red-50 dark:bg-red-950 text-red-500"
    : isSuccess
      ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-500"
      : "bg-violet-50 dark:bg-violet-950 text-violet-500";

  return (
    <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
      {isWaiting ? (
        <Loader2 className={`absolute inset-0 w-20 h-20 animate-spin ${ringColor}`} />
      ) : (
        <svg className="absolute inset-0 w-20 h-20" viewBox="0 0 80 80">
          <circle
            cx="40" cy="40" r="36"
            fill="none"
            strokeWidth="3"
            className={isSuccess ? "stroke-emerald-400" : "stroke-red-400"}
            strokeDasharray="226"
            strokeDashoffset="0"
            strokeLinecap="round"
          />
        </svg>
      )}
      <div className={`z-10 w-12 h-12 rounded-full flex items-center justify-center ${iconBg}`}>
        {isWaiting && <Wallet className="w-5 h-5" />}
        {isSuccess && <CheckCircle2 className="w-5 h-5" />}
        {isError && <XCircle className="w-5 h-5" />}
      </div>
    </div>
  );
}

// ─── Status copy ──────────────────────────────────────────────────────────────

export const STATUS_COPY: Record<Step1Status | Step2Status, { title: string; description: string }> = {
  waiting_approval: {
    title: "Waiting for approval",
    description: "Check your wallet and approve the transaction to proceed.",
  },
  sent: {
    title: "Transaction sent",
    description: "Your transaction has been broadcast to the network.",
  },
  rejected: {
    title: "Transaction rejected",
    description: "You rejected the transaction in your wallet.",
  },
  expired: {
    title: "Request expired",
    description: "The signing request timed out. You can try again.",
  },
  waiting_confirmation: {
    title: "Waiting for confirmation",
    description: "Your transaction is being processed by the network.",
  },
  confirmed: {
    title: "Transaction confirmed",
    description: "The transaction has been included in a block.",
  },
  reverted: {
    title: "Transaction reverted",
    description: "The transaction failed on-chain. No funds were moved.",
  },
};
