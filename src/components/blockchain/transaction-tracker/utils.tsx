"use client";

import {TransactionReceipt } from "ethers";
import {
  Wallet,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";


// ─── Types ────────────────────────────────────────────────────────────────────

export type Step1Status = "waiting_approval" | "sent" | "expired" | "rejected" | "error";
export type Step2Status = "waiting_confirmation" | "confirmed" | "reverted" | "error";

export type TxState =
  | { step: 1; status: Step1Status; txHash?: string; errReason?: string }
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
  t: (key: string, params?: Record<string, string>) => string;
}
export function StepBadge({ current, t }: StepBadgeProps) {
  return (
    <div className="flex items-center gap-2 text-xs font-medium text-violet-500 bg-violet-50 dark:bg-violet-950 dark:text-violet-300 px-3 py-1 rounded-full w-fit mx-auto">
      {t("tx.step-badge", { step: String(current) })}
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
  const isError = status === "expired" || status === "reverted" || status === "rejected" || status === "error";

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

export function getStatusCopy(
  t: (key: string) => string
): Record<Step1Status | Step2Status, { title: string; description: string }> {
  return {
    waiting_approval: {
      title: t("tx.copy.waiting_approval.title"),
      description: t("tx.copy.waiting_approval.description"),
    },
    sent: {
      title: t("tx.copy.sent.title"),
      description: t("tx.copy.sent.description"),
    },
    rejected: {
      title: t("tx.copy.rejected.title"),
      description: t("tx.copy.rejected.description"),
    },
    expired: {
      title: t("tx.copy.expired.title"),
      description: t("tx.copy.expired.description"),
    },
    waiting_confirmation: {
      title: t("tx.copy.waiting_confirmation.title"),
      description: t("tx.copy.waiting_confirmation.description"),
    },
    confirmed: {
      title: t("tx.copy.confirmed.title"),
      description: t("tx.copy.confirmed.description"),
    },
    reverted: {
      title: t("tx.copy.reverted.title"),
      description: t("tx.copy.reverted.description"),
    },
    error: {
      title: t("tx.copy.error.title"),
      description: t("tx.copy.error.description"),
    },
  };
}

