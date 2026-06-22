import { Contract, JsonRpcProvider } from "ethers";
import AnimatedCounter from "./animated-counter";
import vaultAbi from "@/blockchain/contracts/avaldao/vault.abi";
import ContractsFactory from "@/blockchain/contracts";

export const dynamic = 'force-dynamic';

interface GuaranteeFundValueProps {
  chainId: number;
  docAddress: string;
}

export default async function GuaranteeFundValue({chainId, docAddress}: GuaranteeFundValueProps) {
  const vault = ContractsFactory.getVaultContract(chainId);
  const response = await vault.getTokenBalance(docAddress); 
  const vaultBalance = Number(response.amountFiat)/100;  

  return (
    <div className="min-w-32">
      <AnimatedCounter from={0} to={vaultBalance} />
    </div>
  )
}