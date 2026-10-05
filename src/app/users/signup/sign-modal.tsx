"use client";

import { Loader2, PenLine, CheckCircle2, XCircle, ShieldCheck, Wallet, X } from "lucide-react";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { shortAddress } from "@/components/blockchain/transaction-tracker/utils";
import { getAddress } from "ethers/address";

export type SignStatus = "idle" | "waiting" | "success" | "error";

interface SignModalProps {
  address?: string;
  message?: string;
  status: SignStatus;
  errorMessage?: string;
  onSign: () => void;
  onClose: () => void;
  t: (key: string) => string;
  canClose?: boolean;
  badgeKey?: string;
  idleTitleKey?: string;
  idleDescKey?: string;
  /** Texto completo de los términos que la firma compromete. Cuando se pasa, el
   *  botón de firmar queda bloqueado hasta que la persona lo acepta. */
  terms?: string;
  /** CID del JSON de IPFS que contiene esos términos y que viaja en el mensaje firmado. */
  infoCid?: string;
  /** Aviso a mostrar sobre los términos (por ejemplo, que no están incluidos en el CID). */
  termsWarning?: string;
}

function SpinnerRing({ status }: { status: SignStatus }) {
  const isWaiting = status === "waiting";
  const isSuccess = status === "success";
  const isError = status === "error";

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
            className={isSuccess ? "stroke-emerald-400" : isError ? "stroke-red-400" : "stroke-violet-400"}
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
        {status === "idle" && <PenLine className="w-5 h-5" />}
      </div>
    </div>
  );
}

export default function SignModal({ address, message, status, errorMessage, onSign, onClose, t, canClose: propCanClose, badgeKey = "signup.sign.badge", idleTitleKey = "signup.sign.idle.title", idleDescKey = "signup.sign.idle.description", terms, infoCid, termsWarning }: SignModalProps) {
  const [mounted, setMounted] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const canClose = propCanClose ?? (status === "idle" || status === "error" || status === "success");
  const canSign = !terms || termsAccepted;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className={`w-full ${terms ? "max-w-lg" : "max-w-sm"} max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-zinc-900 shadow-xl ring-1 ring-black/5 dark:ring-white/10`}>

        {/* Header */}
        <div className="px-6 pt-6 pb-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-medium text-violet-500 bg-violet-50 dark:bg-violet-950 dark:text-violet-300 px-3 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" />
              {t(badgeKey)}
            </div>
            {canClose && (
              <button
                onClick={onClose}
                className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <SpinnerRing status={status} />

          <div className="text-center space-y-1">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              {status === "waiting"
                ? t("signup.sign.waiting.title")
                : status === "success"
                  ? t("signup.sign.success.title")
                  : status === "error"
                    ? t("signup.sign.error.title")
                    : t(idleTitleKey)}
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {status === "waiting"
                ? t("signup.sign.waiting.description")
                : status === "success"
                  ? t("signup.sign.success.description")
                  : status === "error"
                    ? (errorMessage ?? t("signup.sign.error.description"))
                    : t(idleDescKey)}
            </p>
          </div>
        </div>

        {/* Info rows */}
        <div className="mx-6 mb-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 divide-y divide-zinc-100 dark:divide-zinc-700 ring-1 ring-zinc-100 dark:ring-zinc-700">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-xs text-zinc-400 dark:text-zinc-500">{t("signup.sign.info.wallet")}</span>
            <span className="text-xs font-medium text-zinc-700 dark:text-zinc-200 font-mono">
              {address ? shortAddress(getAddress(address)) : "—"}
            </span>
          </div>
          {message && (
            <div className="flex flex-col gap-1 px-4 py-3">
              <span className="text-xs text-zinc-400 dark:text-zinc-500">{t("signup.sign.info.message")}</span>
              <span className="text-xs font-mono text-zinc-600 dark:text-zinc-300 break-all bg-zinc-100 dark:bg-zinc-700 rounded-lg px-2 py-1.5">
                {message}
              </span>
            </div>
          )}
          {infoCid && (
            <div className="flex flex-col gap-1 px-4 py-3">
              <span className="text-xs text-zinc-400 dark:text-zinc-500">{t("sign.terms.cid")}</span>
              <span className="text-xs font-mono text-zinc-600 dark:text-zinc-300 break-all">
                {infoCid}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-xs text-zinc-400 dark:text-zinc-500">{t("signup.sign.info.cost")}</span>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              {t("signup.sign.info.cost.value")}
            </span>
          </div>
        </div>

        {/* Términos que la firma compromete */}
        {terms && (
          <div className="mx-6 mb-4 space-y-2">
            <span className="text-xs text-zinc-400 dark:text-zinc-500">{t("sign.terms.label")}</span>
            {termsWarning && (
              <p className="text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 rounded-lg px-3 py-2">
                {termsWarning}
              </p>
            )}
            <div className="max-h-64 overflow-y-auto rounded-xl bg-zinc-50 dark:bg-zinc-800 ring-1 ring-zinc-100 dark:ring-zinc-700 px-4 py-3">
              <pre className="whitespace-pre-wrap wrap-break-word font-sans text-xs leading-relaxed text-zinc-700 dark:text-zinc-200">
                {terms}
              </pre>
            </div>
            {status === "idle" && (
              <label className="flex items-start gap-2 text-xs text-zinc-600 dark:text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={e => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 accent-violet-500"
                />
                <span>{t("sign.terms.accept")}</span>
              </label>
            )}
          </div>
        )}

        {/* Action */}
        <div className="px-6 pb-6">
          {status === "idle" && (
            <button
              onClick={onSign}
              disabled={!canSign}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-violet-500 hover:bg-violet-600 active:bg-violet-700 disabled:bg-zinc-200 disabled:text-zinc-400 disabled:cursor-not-allowed dark:disabled:bg-zinc-800 dark:disabled:text-zinc-500 text-white text-sm font-medium py-2.5 transition-colors"
            >
              <PenLine className="w-4 h-4" />
              {t("signup.sign.button")}
            </button>
          )}
          {status === "waiting" && (
            <div className="w-full flex items-center justify-center gap-2 rounded-xl bg-violet-100 dark:bg-violet-950 text-violet-500 text-sm font-medium py-2.5 cursor-not-allowed select-none">
              <Loader2 className="w-4 h-4 animate-spin" />
              {t("signup.sign.waiting.button")}
            </div>
          )}
          {status === "error" && (
            <button
              onClick={onSign}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-violet-500 hover:bg-violet-600 active:bg-violet-700 text-white text-sm font-medium py-2.5 transition-colors"
            >
              <PenLine className="w-4 h-4" />
              {t("signup.sign.retry.button")}
            </button>
          )}
        </div>

      </div>
    </div>,
    document.body
  );
}
