"use client";

import { useEffect, useRef, useState } from "react";
import { useAppKitAccount, useAppKitNetwork, useWalletInfo } from "@reown/appkit/react";
import { AbiCoder, BrowserProvider, ContractTransactionReceipt, ContractTransactionResponse, EthersError, Provider, TransactionReceipt, isError } from "ethers";
import {
  Wallet,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

import {
  StepBadge, SpinnerRing, TxState, ContractInfo, STATUS_COPY, Step1Status, Step2Status,
  shortAddress,
  explorerTxUrl
} from "./utils";


interface TransactionTrackerProps {
  provider: BrowserProvider,
  onSend: () => Promise<ContractTransactionResponse>;
  contract: ContractInfo;
  explorerUrl?: string;
  onClose?: () => void;
}



export default function TransactionTracker({
  provider,
  onSend,
  contract,
  explorerUrl = "https://etherscan.io",
  onClose,
}: TransactionTrackerProps) {
  const hasRun = useRef(false);

  const { address } = useAppKitAccount();
  const [balance, setBalance] = useState<string | null>(null);
  const [txResponse, setTxResponse] = useState<ContractTransactionResponse | null>(null);
  const [txReceipt, setTxReceipt] = useState<ContractTransactionReceipt | null>(null);

  const { caipNetwork } = useAppKitNetwork();
  const networkName = caipNetwork?.name ?? "Unknown network";

  const [txState, setTxState] = useState<TxState>({
    step: 1,
    status: "waiting_approval",
  });

  useEffect(() => {
    async function fetchUserBalance() {
      if (address && provider) {
        const balance = await provider.getBalance(address);
        setBalance((parseFloat(balance.toString()) / 1e18).toFixed(6));
      }
    }

    fetchUserBalance();
  }, [address]);


  // Kick off the flow on mount
  useEffect(() => {
    if (hasRun.current) return; // segunda ejecución de StrictMode → ignorar
    hasRun.current = true;

    let txResponse: ContractTransactionResponse;
    let receipt: ContractTransactionReceipt | null = null;
    let errReason: string | undefined = undefined;

    let cancelled = false;

    async function run() {
      let hash: string;

      try {
        txResponse = await onSend();
        setTxResponse(txResponse);
        hash = txResponse.hash;
      } catch (err) {
        console.log(err);
        if (err instanceof Error && "code" in err && err.code === "ACTION_REJECTED") {
          setTxState({ step: 1, status: "rejected" });
        }

        if (!cancelled) {
          setTxState({ step: 1, status: "expired" });
        }
        return;
      }

      setTxState({ step: 1, status: "sent", txHash: hash });

      await new Promise((r) => setTimeout(r, 800));


      setTxState({ step: 2, status: "waiting_confirmation", txHash: hash });
      try {
        receipt = await txResponse.wait();
        setTxReceipt(receipt);

        if (cancelled) return;

        if (!receipt || receipt.status === 0) {
          setTxState({ step: 2, status: "reverted", txHash: hash, receipt: receipt ?? undefined });
        } else {
          setTxState({ step: 2, status: "confirmed", txHash: hash, receipt });
        }
      } catch (err) {

        if (txResponse.to) {
          errReason = await getRevertReason({
            to: txResponse.to,
            from: txResponse.from ?? "",
            data: txResponse.data,
            value: txResponse.value,
            blockNumber: receipt?.blockNumber ?? undefined,
          }, provider);
        }

        if (isError(err, "CALL_EXCEPTION")) {
          console.log("errdata:", (err as any).data);
          setTxState({ step: 2, status: "reverted", txHash: hash, errReason: errReason });

        }
        setTxState({ step: 2, status: "reverted", txHash: hash, errReason: errReason });
      }
    }

    run();
    return () => {
      console.log("TransactionTracker unmounted, cancelling state updates");
      cancelled = true;

    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  const currentStatus = txState.status as Step1Status | Step2Status;
  const copy = STATUS_COPY[currentStatus];
  const isWaiting = currentStatus === "waiting_approval" || currentStatus === "waiting_confirmation";
  const hasError = currentStatus == "rejected" || currentStatus === "expired" || currentStatus === "reverted";
  const txHash = txState.step === 2 || txState.txHash ? txState.txHash : undefined;

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
                `${balance} tRBTC` :
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
            <div className="flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-950/40 ring-1 ring-red-100 dark:ring-red-900 px-4 py-2.5">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span className="text-xs text-red-600 dark:text-red-400">
                {currentStatus === "expired"
                  ? "Signing request timed out":
                  currentStatus === "rejected" ? "Transaction rejected by user"
                  : "Transaction was reverted on-chain"}
                {txState.step === 2 && txState.errReason && `: ${txState.errReason}`}
              </span>
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


interface TxParams {
  to: string;
  from: string;
  data: string;
  value?: bigint | string;
  blockNumber?: number;
}

async function getRevertReason(
  tx: TxParams,
  provider: Provider
): Promise<string> {
  try {
    await provider.call(
      {
        to: tx.to,
        from: tx.from,
        data: tx.data,
        value: tx.value,
        blockTag: tx.blockNumber ? tx.blockNumber - 1 : "latest",
      }
    );
    return 'No revert detected';
  } catch (err) {
    if (err instanceof Error) {
      const ethersErr = err as EthersError & { data?: string };
      if (ethersErr.data) {
        return decodeRevertReason(ethersErr.data);
      }
      if ('reason' in ethersErr && typeof ethersErr.reason === 'string') {
        return ethersErr.reason;
      }
      return err.message;
    }
    return 'Unknown error';
  }
}

function decodeRevertReason(data: string): string {
  // 0x08c379a0 = selector de Error(string)
  if (data?.startsWith('0x08c379a0')) {
    const abiCoder = AbiCoder.defaultAbiCoder();
    const decoded = abiCoder.decode(['string'], '0x' + data.slice(10));
    return decoded[0] as string;
  }

  // 0x4e487b71 = Panic(uint256)
  if (data?.startsWith('0x4e487b71')) {
    const abiCoder = AbiCoder.defaultAbiCoder();
    const [code] = abiCoder.decode(['uint256'], '0x' + data.slice(10));
    return `Panic: ${(code as bigint).toString()}`;
  }

  return `Unknown revert: ${data}`;
}
