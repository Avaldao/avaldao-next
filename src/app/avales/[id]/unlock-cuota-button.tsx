"use client";

import { useState, useMemo } from "react";
import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import { BrowserProvider, Contract, Eip1193Provider } from "ethers";
import { Button } from "@/components/ui/button";
import { Unlock } from "lucide-react";
import avalAbi from "@/blockchain/contracts/avaldao/aval.abi";
import { contractsAddress } from "@/blockchain/contracts";
import { ROOTSTOCK_NETWORKS } from "@/config";
import TransactionTracker from "@/components/blockchain/transaction-tracker/transaction-tracker";
import useBlockchainTransaction from "@/hooks/useBlockchainTransaction";
import { Language, translations } from "@/translations";

interface Props {
  avalAddress: string;
  solicitanteAddress: string;
  chainId: 30 | 31;
  language: Language;
}

export default function UnlockCuotaButton({ avalAddress, solicitanteAddress, chainId, language }: Props) {
  const t = (key: string) => translations[key]?.[language] ?? key;
  const { address } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider<Eip1193Provider>("eip155");
  const [showTxTracker, setShowTxTracker] = useState(false);

  const provider = useMemo(() => {
    if (!walletProvider) return null;
    return new BrowserProvider(walletProvider);
  }, [walletProvider]);

  const { run, txState, clearTxState } = useBlockchainTransaction(provider);

  const isSolicitante = 
    !!address && address.toLowerCase() === solicitanteAddress.toLowerCase();

  if (!isSolicitante) return null;

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
    } catch (err: any) {
      if (err.code === 4902) {
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

  async function handleUnlock() {
    setShowTxTracker(true);
    await run(async () => {
      let ethersProvider = new BrowserProvider(walletProvider as Eip1193Provider);
      const connectedChainId = Number((await ethersProvider.getNetwork()).chainId);
      if (connectedChainId !== chainId) {
        const switched = await switchNet();
        if (!switched) throw new Error("Wrong network");
        ethersProvider = new BrowserProvider(walletProvider as Eip1193Provider);
      }
      const signer = await ethersProvider.getSigner();
      const avalContract = new Contract(avalAddress, avalAbi, signer);
      return avalContract.unlockFundManual({ gasLimit: BigInt(500_000) });
    });
  }

  return (
    <>
      {showTxTracker && (
        <TransactionTracker
          balance={null}
          contract={{ name: "Aval", address: avalAddress }}
          explorerUrl={contractsAddress[chainId]?.explorerUrl}
          txState={txState}
          hint={t("aval.details.unlock-cuota.hint")}
          onClose={() => {
            clearTxState();
            setShowTxTracker(false);
          }}
        />
      )}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 flex items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-blue-900 text-sm">{t("aval.details.unlock-cuota.title")}</p>
          <p className="text-xs text-blue-700 mt-0.5">{t("aval.details.unlock-cuota.description")}</p>
        </div>
        <Button onClick={handleUnlock} size="sm">
          <Unlock className="w-4 h-4 mr-2" />
          {t("aval.details.unlock-cuota.button")}
        </Button>
      </div>
    </>
  );
}
