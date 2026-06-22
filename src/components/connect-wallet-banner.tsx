"use client";

import { useState } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import { useAppKit, useAppKitAccount, useAppKitProvider, useDisconnect } from "@reown/appkit/react";
import { BrowserProvider, Eip1193Provider } from "ethers";
import { Wallet, Loader2, CheckCircle2, X } from "lucide-react";
import AppkitContextProvider from "@/context/appkit-context";
import { useLanguage } from "@/context/LanguageContext";

type Step = "idle" | "connecting" | "signing" | "saving" | "done" | "error";

export default function ConnectWalletBanner() {
  const { data: session, update } = useSession();
  const { open } = useAppKit();
  const { disconnect } = useDisconnect();
  const { isConnected, address } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider<Eip1193Provider>("eip155");
  const { t } = useLanguage();

  const [step, setStep] = useState<Step>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);

  // Hide if address is already set in session or user dismissed
  if (session?.user?.address || dismissed) return null;

  const getChallenge = async (addr: string) => {
    const res = await fetch(`/api/challenges?address=${addr}`);
    const data = await res.json();
    return data.message as string;
  };

  const handleConnect = async () => {
    setErrorMsg(null);
    try {
      if (!isConnected || !address) {
        setStep("connecting");
        await open({ view: "Connect" });
        return;
      }
      await sign(address);
    } catch {
      setStep("error");
      setErrorMsg(t("wallet.banner.error.connect"));
    }
  };

  const sign = async (addr: string) => {
    try {
      setStep("signing");
      const message = await getChallenge(addr);
      const ethersProvider = new BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();
      const signature = await signer.signMessage(message);

      setStep("saving");
      const res = await fetch("/api/users/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, signature }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message ?? t("wallet.banner.error.save"));
      }

      setStep("done");
      await update();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t("wallet.banner.error.generic");
      if (msg === "Esta billetera ya está asociada a otra cuenta") {
        await disconnect();
      }
      setStep("error");
      setErrorMsg(msg);
    }
  };

  // If wallet just connected but we haven't signed yet, trigger signing
  if (isConnected && address && step === "connecting") {
    sign(address);
  }

  const isLoading = step === "connecting" || step === "signing" || step === "saving";

  const stepLabel: Record<Step, string> = {
    idle: t("wallet.banner.step.idle"),
    connecting: t("wallet.banner.step.connecting"),
    signing: t("wallet.banner.step.signing"),
    saving: t("wallet.banner.step.saving"),
    done: t("wallet.banner.step.done"),
    error: t("wallet.banner.step.error"),
  };

  return (
    <div className="relative rounded-xl border border-violet-200 bg-linear-to-br from-violet-50 to-fuchsia-50 p-5 pr-8">
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
        aria-label={t("wallet.banner.close")}
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex items-center gap-4 ">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
          {step === "done" ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          ) : (
            <Wallet className="h-5 w-5" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800">
            {step === "done" ? t("wallet.banner.title.done") : t("wallet.banner.title.idle")}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">
            {step === "done"
              ? t("wallet.banner.description.done")
              : t("wallet.banner.description.idle")}
          </p>
          {errorMsg && (
            <p className="mt-1 text-xs font-medium text-red-600">{errorMsg}</p>
          )}
        </div>

        {step !== "done" && (
          <button
            onClick={handleConnect}
            disabled={isLoading}
            className="flex shrink-0 items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {stepLabel[step]}
          </button>
        )}
      </div>
    </div>
  );
}

export function ConnectWalletBannerWrapper() {
  return (
    <AppkitContextProvider>
      <SessionProvider>
        <ConnectWalletBanner />
      </SessionProvider>
    </AppkitContextProvider>
  );
}
