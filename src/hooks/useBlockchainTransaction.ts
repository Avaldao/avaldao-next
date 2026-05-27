import { TxState } from "@/components/blockchain/transaction-tracker/utils";
import { AbiCoder, ContractTransactionReceipt, ContractTransactionResponse, EthersError, isError, Provider } from "ethers";
import { useState } from "react";

export default function useBlockchainTransaction(provider: Provider | null) {
  const [txState, setTxState] = useState<TxState>({
    step: 1,
    status: "waiting_approval",
  });


  function _handleSendingError(err: unknown) {
    console.error(err);
    const message = err instanceof Error ? err.message.toLowerCase() : "";

    if (err instanceof Error && "code" in err && err.code === "ACTION_REJECTED") {
      setTxState({ step: 1, status: "rejected" });
    } else if (message.includes("expired") || message.includes("timeout")) {
      setTxState({ step: 1, status: "expired" });
    } else {
      setTxState({ step: 1, status: "error", errReason: err instanceof Error ? err.message : "Unknown error" });
    }
    return;
  }

  async function _handleConfirmationError(err: unknown, txResponse: ContractTransactionResponse, receipt: ContractTransactionReceipt | null) {
    let errReason: string | undefined = undefined;

    if(!provider) {
      setTxState({ step: 2, status: "error", txHash: txResponse.hash, errReason: "Unknown error. Unable to get provider to check reason" });
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


  async function run(sendTransaction: () => Promise<ContractTransactionResponse>) {

    let txResponse: ContractTransactionResponse;
    let receipt: ContractTransactionReceipt | null = null;


    try {
      txResponse = await sendTransaction();
      setTxState({ step: 1, status: "sent", txHash: txResponse.hash });
    } catch (err) {
      _handleSendingError(err);
      return;
    }

    await new Promise((r) => setTimeout(r, 800));

    const hash = txResponse.hash;

    setTxState({ step: 2, status: "waiting_confirmation", txHash: hash });
    try {
      receipt = await txResponse.wait();

      if (!receipt || receipt.status === 0) {
        setTxState({ step: 2, status: "reverted", txHash: hash, receipt: receipt ?? undefined });
      } else {
        setTxState({ step: 2, status: "confirmed", txHash: hash, receipt });
      }
    } catch (err) {
      await _handleConfirmationError(err, txResponse, receipt);
      return;
    }
  }

  return {
    txState,
    run
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
