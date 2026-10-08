"use client";

import { useState, useMemo, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import { BrowserProvider, Contract, Eip1193Provider } from "ethers";
import { Button } from "@/components/ui/button";
import avalAbi from "@/blockchain/contracts/avaldao/aval.abi";
import { contractsAddress } from "@/blockchain/contracts";
import { ROOTSTOCK_NETWORKS } from "@/config";
import TransactionTracker from "@/components/blockchain/transaction-tracker/transaction-tracker";
import useBlockchainTransaction from "@/hooks/useBlockchainTransaction";
import { Language } from "@/translations";

/** Métodos del contrato Aval que se envían desde la wallet de un participante. */
export type AvalTxMethod = "unlockFundManual" | "openReclamo" | "ejecutarGarantia";

const GAS_LIMITS: Record<AvalTxMethod, bigint> = {
  unlockFundManual: BigInt(500_000),
  openReclamo: BigInt(300_000),
  // Transfiere los tokens de todas las cuotas vencidas: puede mover varias a la vez.
  ejecutarGarantia: BigInt(1_500_000),
};

export const TONES = {
  blue: { box: "border-blue-200 bg-blue-50", title: "text-blue-900", text: "text-blue-700", button: "" },
  amber: { box: "border-amber-200 bg-amber-50", title: "text-amber-900", text: "text-amber-800", button: "bg-amber-600 hover:bg-amber-700 text-white" },
  red: { box: "border-red-200 bg-red-50", title: "text-red-900", text: "text-red-700", button: "bg-red-600 hover:bg-red-700 text-white" },
} as const;

interface UseAvalTxOptions {
  avalAddress: string;
  /** Única address que el contrato acepta como sender del método. */
  actorAddress: string;
  chainId: 30 | 31;
  language: Language;
  hint?: string;
  wrongNetworkMessage: string;
}

/**
 * Envía un método del contrato del Aval desde la wallet conectada, cambiando
 * de red si hace falta. `tracker` es el modal de seguimiento; al cerrarlo tras
 * una confirmación refresca la página, que vuelve a leer el estado onchain.
 */
export function useAvalTx({ avalAddress, actorAddress, chainId, language, hint, wrongNetworkMessage }: UseAvalTxOptions) {
  const router = useRouter();
  const { address } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider<Eip1193Provider>("eip155");
  const [showTxTracker, setShowTxTracker] = useState(false);

  const provider = useMemo(() => {
    if (!walletProvider) return null;
    return new BrowserProvider(walletProvider);
  }, [walletProvider]);

  const { run, estimateCost, estimatedCost, txState, clearTxState } = useBlockchainTransaction(provider);

  const isActor = !!address && address.toLowerCase() === actorAddress.toLowerCase();

  async function switchNet() {
    const networkConfig =
      chainId === 30 ? ROOTSTOCK_NETWORKS["mainnet"] : ROOTSTOCK_NETWORKS["testnet"];
    if (!networkConfig) return false;
    try {
      await (walletProvider as Eip1193Provider).request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: networkConfig.chainId }],
      });
      return true;
    } catch (err) {
      if ((err as { code?: number }).code === 4902) {
        try {
          await (walletProvider as Eip1193Provider).request({
            method: "wallet_addEthereumChain",
            params: [networkConfig],
          });
          return true;
        } catch {
          return false;
        }
      }
      return false;
    }
  }

  /** Devuelve true si la transacción se confirmó. */
  async function send(method: AvalTxMethod): Promise<boolean> {
    setShowTxTracker(true);
    return run(async () => {
      let ethersProvider = new BrowserProvider(walletProvider as Eip1193Provider);
      const connectedChainId = Number((await ethersProvider.getNetwork()).chainId);
      if (connectedChainId !== chainId) {
        const switched = await switchNet();
        if (!switched) throw new Error(wrongNetworkMessage);
        ethersProvider = new BrowserProvider(walletProvider as Eip1193Provider);
      }
      const signer = await ethersProvider.getSigner();
      const avalContract = new Contract(avalAddress, avalAbi, signer);
      estimateCost(signer, avalContract[method].populateTransaction());
      return avalContract[method]({ gasLimit: GAS_LIMITS[method] });
    });
  }

  const tracker = showTxTracker ? (
    <TransactionTracker
      contract={{ name: "Aval", address: avalAddress }}
      explorerUrl={contractsAddress[chainId]?.explorerUrl}
      txState={txState}
      hint={hint}
      estimatedCost={estimatedCost}
      testnet={chainId === 31}
      language={language}
      onClose={() => {
        const confirmed = txState.status === "confirmed";
        clearTxState();
        setShowTxTracker(false);
        if (confirmed) router.refresh();
      }}
    />
  ) : null;

  return { isActor, send, tracker };
}

interface Props extends UseAvalTxOptions {
  method: AvalTxMethod;
  title: string;
  description: ReactNode;
  buttonLabel: string;
  icon: ReactNode;
  tone?: keyof typeof TONES;
}

/**
 * Tarjeta con una acción sobre el contrato del Aval. Solo se muestra si la
 * wallet conectada es la que el contrato exige como sender.
 */
export default function AvalTxAction({ method, title, description, buttonLabel, icon, tone = "blue", ...txOptions }: Props) {
  const { isActor, send, tracker } = useAvalTx(txOptions);

  if (!isActor) return null;

  const styles = TONES[tone];

  return (
    <>
      {tracker}
      <div className={`rounded-lg border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${styles.box}`}>
        <div>
          <p className={`font-semibold text-sm ${styles.title}`}>{title}</p>
          <div className={`text-xs mt-0.5 ${styles.text}`}>{description}</div>
        </div>
        <Button onClick={() => send(method)} size="sm" className={`shrink-0 ${styles.button}`}>
          {icon}
          {buttonLabel}
        </Button>
      </div>
    </>
  );
}
