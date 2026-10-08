import { TxState } from "@/components/blockchain/transaction-tracker/utils";
import { AbiCoder, ContractTransactionReceipt, ContractTransactionResponse, EthersError, Provider, Signer, TransactionRequest } from "ethers";
import { useRef, useState } from "react";

export default function useBlockchainTransaction(provider: Provider | null) {
  const [txState, setTxState] = useState<TxState>({
    step: 1,
    status: "waiting_approval",
  });
  /** Costo estimado (gas × precio del gas) en wei de la transacción en curso. */
  const [estimatedCost, setEstimatedCost] = useState<bigint | undefined>();
  // Identifica la ejecución de `run` en curso, para descartar estimaciones que llegan tarde.
  const runId = useRef(0);

  function clearTxState() {
    runId.current++;
    setEstimatedCost(undefined);
    setTxState({
      step: 1,
      status: "waiting_approval",
    });
  };

  /**
   * Estima el costo de `tx` para mostrarlo en el tracker mientras el usuario aprueba.
   * No hace falta esperarla: corre en paralelo al envío. Si falla no bloquea nada,
   * ya que algunos métodos se envían con un gasLimit fijo porque el nodo no los estima bien.
   */
  async function estimateCost(signer: Signer, tx: TransactionRequest | Promise<TransactionRequest>) {
    const id = runId.current;
    try {
      const request = await tx;
      const [gas, feeData] = await Promise.all([
        signer.estimateGas({ ...request, gasLimit: undefined }),
        signer.provider!.getFeeData(),
      ]);
      const gasPrice = feeData.gasPrice ?? feeData.maxFeePerGas;
      if (gasPrice != null && id === runId.current) setEstimatedCost(gas * gasPrice);
    } catch (err) {
      console.warn("No se pudo estimar el costo de la transacción", err);
    }
  }

  function _handleSendingError(err: unknown) {
    console.error(err);
    const message = err instanceof Error ? err.message.toLowerCase() : "";

    if (err instanceof Error && "code" in err && err.code === "ACTION_REJECTED") {
      setTxState({ step: 1, status: "rejected" });
    } else if (message.includes("expired") || message.includes("timeout")) {
      setTxState({ step: 1, status: "expired" });
    } else {
      setTxState({ step: 1, status: "error", errReason: err instanceof Error ? err.message : undefined });
    }
    return;
  }

  async function _handleConfirmationError(err: unknown, txResponse: ContractTransactionResponse, receipt: ContractTransactionReceipt | null) {
    let errReason: string | undefined = undefined;

    if(!provider) {
      setTxState({ step: 2, status: "error", txHash: txResponse.hash });
      return;
    }

    if (txResponse.to) {
      errReason = await getRevertReason({
        to: txResponse.to,
        from: txResponse.from ?? "",
        data: txResponse.data,
        value: txResponse.value,
        blockNumber: receipt?.blockNumber ?? undefined,
      }, provider);
    }

    setTxState({ step: 2, status: "reverted", txHash: txResponse.hash, errReason: errReason });
  }


  /** Devuelve true si la transacción se confirmó. */
  async function run(sendTransaction: () => Promise<ContractTransactionResponse>): Promise<boolean> {

    let txResponse: ContractTransactionResponse;
    let receipt: ContractTransactionReceipt | null = null;

    runId.current++;
    setEstimatedCost(undefined);

    try {
      txResponse = await sendTransaction();
      setTxState({ step: 1, status: "sent", txHash: txResponse.hash });
    } catch (err) {
      _handleSendingError(err);
      return false;
    }

    await new Promise((r) => setTimeout(r, 800));

    const hash = txResponse.hash;

    setTxState({ step: 2, status: "waiting_confirmation", txHash: hash });
    try {
      receipt = await txResponse.wait();

      if (!receipt || receipt.status === 0) {
        setTxState({ step: 2, status: "reverted", txHash: hash, receipt: receipt ?? undefined });
        return false;
      }
      setTxState({ step: 2, status: "confirmed", txHash: hash, receipt });
      return true;
    } catch (err) {
      await _handleConfirmationError(err, txResponse, receipt);
      return false;
    }
  }

  return {
    txState,
    estimatedCost,
    run,
    estimateCost,
    clearTxState
  };
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
