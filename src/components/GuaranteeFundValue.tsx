import { Contract, JsonRpcProvider } from "ethers";
import AnimatedCounter from "./animated-counter";
import vaultAbi from "@/blockchain/contracts/avaldao/vault.abi";

export const dynamic = 'force-dynamic';

export default async function GuaranteeFundValue() {
  const vaultAddress = process.env.NEXT_PUBLIC_VAULT_CONTRACT_ADDRESS!;
  const docAddress = process.env.DOC_CONTRACT_ADDRESS!;
  const vault = new Contract(vaultAddress, vaultAbi, new JsonRpcProvider(process.env.RPC_URL!));

  const response = await vault.getTokenBalance(docAddress); 
  const vaultBalance = Number(response.amountFiat)/100;  

  return (
    <div className="min-w-32">
      <AnimatedCounter from={0} to={vaultBalance} />
    </div>

  )
}