"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppKit, useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import { BrowserProvider, Eip1193Provider } from "ethers";
import { SessionProvider } from "next-auth/react";
import { Pencil, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import TransactionTracker from "@/components/blockchain/transaction-tracker/transaction-tracker";
import useBlockchainTransaction from "@/hooks/useBlockchainTransaction";
import { contractsAddress } from "@/blockchain/contracts";
import { setUserRoles } from "@/blockchain/roles-admin";
import { ROOTSTOCK_NETWORKS } from "@/config";
import { LanguageProvider } from "@/context/LanguageContext";
import { Language, createT } from "@/translations";

export interface RoleOption {
  value: string;
  label: string;
  hash: string;
  app: string;
}

interface Props {
  userAddress: string;
  /** Roles asignables por red. */
  roleOptions: Record<number, RoleOption[]>;
  /** Roles actuales del usuario por red. */
  currentRoles: Record<number, string[]>;
  networks: { id: 30 | 31; name: string }[];
  language: Language;
}

export default function UserRolesEditor(props: Props) {
  return (
    <LanguageProvider initialLanguage={props.language}>
      <SessionProvider>
        <Editor {...props} />
      </SessionProvider>
    </LanguageProvider>
  );
}

function Editor({ userAddress, roleOptions, currentRoles, networks, language }: Props) {
  const t = createT(language);
  const router = useRouter();
  const { open } = useAppKit();
  const { isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider<Eip1193Provider>("eip155");

  const [chainId, setChainId] = useState<30 | 31>(networks[0].id);
  const [selected, setSelected] = useState<Record<number, string[]>>(currentRoles);
  const [showTxTracker, setShowTxTracker] = useState(false);

  const provider = useMemo(() => (walletProvider ? new BrowserProvider(walletProvider) : null), [walletProvider]);
  const { run, txState, clearTxState } = useBlockchainTransaction(provider);

  const options = roleOptions[chainId] ?? [];
  const current = currentRoles[chainId] ?? [];
  const chosen = selected[chainId] ?? [];
  const toAdd = options.filter(r => chosen.includes(r.value) && !current.includes(r.value));
  const toRemove = options.filter(r => !chosen.includes(r.value) && current.includes(r.value));
  const hasChanges = toAdd.length + toRemove.length > 0;

  function toggle(role: string) {
    setSelected(prev => {
      const list = prev[chainId] ?? [];
      return { ...prev, [chainId]: list.includes(role) ? list.filter(r => r !== role) : [...list, role] };
    });
  }

  async function switchNet() {
    const networkConfig = chainId === 30 ? ROOTSTOCK_NETWORKS["mainnet"] : ROOTSTOCK_NETWORKS["testnet"];
    if (!networkConfig || !walletProvider) return false;
    try {
      await walletProvider.request({ method: "wallet_switchEthereumChain", params: [{ chainId: networkConfig.chainId }] });
      return true;
    } catch (err: any) {
      if (err.code === 4902) {
        try {
          await walletProvider.request({ method: "wallet_addEthereumChain", params: [networkConfig] });
          return true;
        } catch {
          return false;
        }
      }
      return false;
    }
  }

  async function handleSave() {
    setShowTxTracker(true);
    await run(async () => {
      if (!walletProvider) throw new Error(t("tx.error.no-wallet"));
      let ethersProvider = new BrowserProvider(walletProvider);
      const connectedChainId = Number((await ethersProvider.getNetwork()).chainId);
      if (connectedChainId !== chainId) {
        const switched = await switchNet();
        if (!switched) throw new Error(t("tx.error.wrong-network"));
        ethersProvider = new BrowserProvider(walletProvider);
      }
      const signer = await ethersProvider.getSigner();
      return setUserRoles(signer, contractsAddress[chainId].permissions, userAddress, toAdd, toRemove);
    });
  }

  function handleClose() {
    clearTxState();
    setShowTxTracker(false);
    router.refresh();
  }

  return (
    <>
      {showTxTracker && (
        <TransactionTracker
          balance={null}
          contract={{ name: "Admin", address: contractsAddress[chainId].permissions }}
          explorerUrl={contractsAddress[chainId]?.explorerUrl}
          txState={txState}
          hint={t("staff.roles.tx-hint")}
          language={language}
          onClose={handleClose}
        />
      )}
      <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4">
        <p className="flex items-center gap-2 text-sm font-semibold text-gray-800">
          <Pencil className="h-4 w-4" /> {t("staff.roles.manage")}
        </p>

        <div className="mt-3 flex gap-2">
          {networks.map(n => (
            <button
              key={n.id}
              type="button"
              onClick={() => setChainId(n.id)}
              className={`rounded-md border px-3 py-1 text-sm ${chainId === n.id ? "border-gray-800 bg-gray-800 text-white" : "border-gray-300 text-gray-700"}`}
            >
              {n.name}
            </button>
          ))}
        </div>

        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {options.map(role => (
            <label key={role.value} className="flex cursor-pointer items-center gap-2 text-sm text-gray-800">
              <input type="checkbox" checked={chosen.includes(role.value)} onChange={() => toggle(role.value)} />
              {role.label}
            </label>
          ))}
        </div>

        <div className="mt-4">
          {isConnected ? (
            <Button size="sm" disabled={!hasChanges} onClick={handleSave}>
              {t("staff.roles.save", { add: String(toAdd.length), remove: String(toRemove.length) })}
            </Button>
          ) : (
            <Button size="sm" variant="outline" onClick={() => open()}>
              <Wallet className="mr-2 h-4 w-4" /> {t("staff.roles.connect-wallet")}
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
