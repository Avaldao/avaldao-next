import { getAddress } from "ethers";
import AvalFormWrapper from "./aval-form-wrapper";
import { defaultAvaldaoAddress } from "@/blockchain/contracts";

export const dynamic = 'force-dynamic';

export default async function AvalesPage() {

  return (
    <>
      <div className="text-2xl text-slate-800 text-heading mt-1  mb-6 flex space-between">
        Nuevo Aval
      </div>
      <AvalFormWrapper avaldaoAddress={getAddress(defaultAvaldaoAddress[Number(process.env.DEFAULT_CHAIN_ID!)].toLowerCase())} />

    </>
  );
}