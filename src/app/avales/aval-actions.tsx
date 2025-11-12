"use client";

import avaldaoAbi from "@/blockchain/contracts/avaldao/avaldao.abi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Aval, AvalState } from "@/types";
import { useAppKitNetwork, useAppKitProvider } from "@reown/appkit/react";
import { BrowserProvider, Contract, Eip1193Provider, isError } from "ethers";
import { rootstock, AppKitNetwork } from "@reown/appkit/networks";

import { Wrench } from "lucide-react";
import { useSession } from "next-auth/react";
import { ROOTSTOCK_NETWORKS } from "@/config";

const targetChainId = process.env.NEXT_PUBLIC_CHAIN_ID!;

export default function AvalActions({ aval }: { aval: Aval }) {
  const { data: session } = useSession();
  const { walletProvider } = useAppKitProvider<Eip1193Provider>("eip155");
  const { chainId } = useAppKitNetwork();



  if (!session?.user) {
    //redirect
    return <></>
  }
  const user = session.user;
  const roles = session.user.roles ?? [];

  const canApprove = aval.status == AvalState.SOLICITADO
    && roles?.includes("SOLICITANTE_ROLE")
    && user.address == aval.solicitanteAddress;

  async function switchNet(targetChainId: number) {
    const networkConfig = targetChainId == 30 ? ROOTSTOCK_NETWORKS["mainnet"] : targetChainId == 31 ? ROOTSTOCK_NETWORKS["testnet"] : null;

    if (!networkConfig) return;

    try {
      await walletProvider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: networkConfig.chainId }],
      });
      return true;

    } catch (err: any) {
      if (err.code === 4902) {
        try {
          await walletProvider.request({
            method: "wallet_addEthereumChain",
            params: [networkConfig],
          });
          console.log(`Rootstock mainnet agregada correctamente`);
          //Una vez que lo agrega tiene que hacer el switch? creo que no
          return true;
        } catch (addError: any) {
          console.error(`Error agregando Rootstock mainnet:`, addError.message);
          return false;
        }
      }

    }

  }




  async function handleApprove() {
    if (targetChainId != chainId) {
      await switchNet(Number(targetChainId!));
    }

    const currentChainId = await walletProvider.request({ method: 'eth_chainId' });
    const wrongNetwork = currentChainId != targetChainId;
    if (wrongNetwork) {
      console.log(`Wrong network. Current: ${currentChainId}. Expected: ${targetChainId}`)
    }

    try {
      const ethersProvider = new BrowserProvider(walletProvider); //Este se llego a actualizar? puedo saber a que red esta conectaod este provider

      const signer = await ethersProvider.getSigner();
      const avaldao = new Contract(process.env.NEXT_PUBLIC_AVALDAO_CONTRACT_ADDRESS!, avaldaoAbi, signer);
      //Open modal to confirm transaction. specify details:
      //Contract. Method

      //Open modal and ask for confirm transaction
      const tx = await avaldao.saveAval(
        aval._id,
        "infoCid",
        [],
        aval.montoFiat,
        []
      );

      //Tx se envio y se espera la aprobación? o la tx ya se acepto en la wallet?

      console.log(`tx sent. tx:${tx.hash}`)

      const receipt = await tx.wait();

      console.log(receipt)
    } catch (err) {
      console.log(err)
      if (isError(err, "CALL_EXCEPTION")) {
       console.log("Error is call exception")
        console.log(err.action);
        console.log(err.cause);
        console.log(err.error);
        console.log(err.reason);
        return;
      }
    }



  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="w-5 h-5 text-orange-600" />
          Actions
        </CardTitle>
      </CardHeader>
      <CardContent>


        <div>Chain Id: {chainId} </div>
        <div>Target Chain ID: RSK Mainnet (30)</div>



        <div className="mt-5 space-x-2">

          {/* Botones dependiendo del estado del aval */}
          {canApprove
            && (
              /* Comprobar usuario actual - lo particular de esto es que va a invocar una funcion sobre el contrado de avaldao */
              <Button onClick={handleApprove}>
                Aceptar
              </Button>
            )}

        </div>


      </CardContent>
    </Card>

  )
}