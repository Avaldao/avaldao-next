"use client";

import avaldaoAbi from "@/blockchain/contracts/avaldao/avaldao.abi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Aval, AvalState } from "@/types";
import { useAppKitAccount, useAppKitNetwork, useAppKitProvider, useWalletInfo } from "@reown/appkit/react";
import { BrowserProvider, Contract, Eip1193Provider, getAddress, hexlify, isError } from "ethers";
import { rootstock, AppKitNetwork } from "@reown/appkit/networks";

import { Wrench, PenLine } from "lucide-react";
import { useSession } from "next-auth/react";
import { ROOTSTOCK_NETWORKS } from "@/config";
import toast from "react-hot-toast";
import avalAbi from "@/blockchain/contracts/avaldao/aval.abi";
import { generateStructDataToSign, getTranchesTs } from "../entities/aval.entity";
import adminAbi from "@/blockchain/contracts/avaldao/admin.abi";
import { ADMIN_ROLE, AVALDAO_ROLE } from "@/roles";
import { AvalRoleEnum } from "@/services/avales-service";
import { useRouter } from "next/navigation";

const targetChainId = process.env.NEXT_PUBLIC_CHAIN_ID!;

export default function AvalActions({ aval }: { aval: Aval }) {
  const { data: session } = useSession();
  const router = useRouter();
  const { walletProvider } = useAppKitProvider<Eip1193Provider>("eip155");
  const { chainId } = useAppKitNetwork();

  const { address } = useAppKitAccount();

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

  async function getAval(avalId: string) {
    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();
    const address = "0x0185e73DaaC1FBF56f71448477026A6A3Dd39aFE";
    const avaldao = new Contract(address, avaldaoAbi, signer);

    console.log(`Get aval:  ${avalId}`)
    try {
      const addr = await avaldao.getAvalAddress(avalId);
      const aval = new Contract(addr, avalAbi, signer);

      const cuotas = await aval.cuotasCantidad();
      const montoFiat = await aval.montoFiat();
      const status = await aval.status();
      console.log(`Aval: ${avalId} Cuotas: ${cuotas} - Monto fiat: ${Number(montoFiat) / 100} USD - status: ${status}`)

      //las firmas se almacenan en el contrato de aval. se invoca al metodo sign, con los arrays de firmas
      //v,r,s
    } catch (err) {
      console.log(err);
    }

  }

  async function signAval(aval: Aval, role: AvalRoleEnum) {
    console.log(`sign aval`);
    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();
    const avaldaoAddr = "0x0185e73DaaC1FBF56f71448477026A6A3Dd39aFE";
    const avaldao = new Contract(avaldaoAddr, avaldaoAbi, signer);

    aval.infoCid = "/ipfs/QmQZiVUdK7t5N8teghjQ3khcQ32W6bpFvuUpsU7p1wcBun"; //TODO: READ FROM BACKEND OR GENERATE
    aval.address = await avaldao.getAvalAddress(aval._id);

    const data = JSON.stringify(generateStructDataToSign(aval, avaldaoAddr));

    const signature = await walletProvider.request({
      method: "eth_signTypedData_v4",
      params: [signer.address, data],
    });

    const response = await fetch(`/api/avales/${aval._id}/signatures`,
      {
        method: "POST",
        body: JSON.stringify({
          signature,
          data,
          role
        })
      }
    );
    if (response.ok) {
      router.refresh();
    }
  }


  async function getRoles() {

    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();

    //Check network before continue
    console.log(`Network: ${signer.provider._network.chainId} - ${signer.address}`)

    try {

      const app = "0x0185e73DaaC1FBF56f71448477026A6A3Dd39aFE"; //avaldao tesnet
      const permissionsAddress = "0x35e08235457394A1C50dF3C1641BD4996F2EBB5F"; //Permissions contract

      const permissions = new Contract(permissionsAddress, adminAbi, signer);

      const check1 = await permissions.hasUserRole(
        signer.address, //who
        app, //avaldao 
        AVALDAO_ROLE.hash
      )

      /* const check2 = await permissions.hasUserRole(
        signer.address, //who
        permissionsAddress, //avaldao 
        ADMIN_ROLE.hash
      ) */

      console.log(`Has ${signer.address} AVALDAO_ROLE role? ${check1}`)
      /*       console.log(`Has ${signer.address} ADMIN role? ${check2}`)
      
            const tx = await permissions.setUserRoles(user, [AVALDAO_ROLE.hash], [app], [], []);
            console.log(tx);
            const receipt = await tx.wait();
            console.log(receipt) */

    } catch (err) {
      console.log(err);
    }
  }


  async function acceptAval() {
    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();

    //Check network before continue
    console.log(`Network: ${signer.provider._network.chainId}`)

    try {
      //Interact with smart contract of testnet network
      //create a config object based on the context
      const address = "0x0185e73DaaC1FBF56f71448477026A6A3Dd39aFE";
      const avaldao = new Contract(address, avaldaoAbi, signer);
      console.log(getTranchesTs(aval).map((ts: number) => `0x${ts.toString(16)}`))
      const tx = await avaldao.saveAval(
        aval._id,
        "/ipfs/QmQZiVUdK7t5N8teghjQ3khcQ32W6bpFvuUpsU7p1wcBun",
        [
          aval.avaldaoAddress, //Esto deberia ser x plataforma o x sender
          aval.solicitanteAddress,
          aval.comercianteAddress,
          aval.avaladoAddress,
        ],
        aval.montoFiat,
        getTranchesTs(aval).map((ts: number) => `0x${ts.toString(16)}`),
        {
          gasLimit: BigInt(5_000_000)
        }
      );

      const receipt = await tx.wait();
      console.log(receipt);

    } catch (err) {
      console.log(err);
    }
  }

  async function getAvales() {
    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();

    //Check network before continue
    console.log(signer.provider._network.chainId)


    try {

      //Interact with smart contract of testnet network
      const address = "0x0185e73DaaC1FBF56f71448477026A6A3Dd39aFE";

      const avaldao = new Contract(address, avaldaoAbi, signer);
      console.log(`Avaldao vault address: ${await avaldao.vault()}`) //Podemos inicializar DOC y obtener el balance
      console.log(`Getting avales ids`)
      const avalids = await avaldao.getAvalIds();
      console.log(`Avales found: ${avalids.length}`);
      return;
      console.log(avalids);
      for (const avalId of avalids) {
        const addr = await avaldao.getAvalAddress(avalId);
        const aval = new Contract(addr, avalAbi, signer); //can I get the infocid?
        /* 
        a esto lo podemos generar en el backend igual, consiste en subir los datos del aval
        a ipfs, habria que hacerlo antes de aceptar el aval
      {"id":"650c9ec0264e700012995698",
       "proyecto":"Aval 1",
       "objetivo":"Objetive 1",
       "adquisicion":"Acquisition 1",
       "beneficiarios":"Beneficiaries",
       "montoFiat":"100000",
       "cuotasCantidad":6

       por ahora usemos este /ipfs/QmQZiVUdK7t5N8teghjQ3khcQ32W6bpFvuUpsU7p1wcBun
      } */

        console.log(`Aval ${avalId} at ${addr} - infocid: ${await aval.infoCid()}`);
      }
    } catch (err) {
      console.log(err);
    }
  }


  async function handleApprove() {
    if (targetChainId != chainId) { //Aca estamos contemplando un chain a nivel de plataforma, y en realidad vamos a tener uno a nivel de aval
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
        if (err.reason == "APP_AUTH_FAILED") {
          toast.error("Permisos insuficientes para enviar la transacción")
        }

        return;
      } else {
        toast.error("Error enviando transaccion");

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



        <div className="mt-5 space-x-2 5 space-y-2">

          {/* Botones dependiendo del estado del aval */}
          {canApprove
            && (
              /* Comprobar usuario actual - lo particular de esto es que va a invocar una funcion sobre el contrado de avaldao */
              <Button onClick={handleApprove}>
                Aceptar
              </Button>
            )}



          <Button onClick={acceptAval}>
            Aceptar aval testnet
          </Button>

          <Button onClick={getRoles}>
            Get roles
          </Button>
          <Button onClick={getAvales}>
            Get avales testnet 31
          </Button>

          <Button onClick={() => getAval("6914d31a8925c19898133dfb")}>
            Get aval 6914d31a8925c19898133dfb
          </Button>



          <div className="mt-5">
            Connected account: {address}
          </div>
          <div className=" flex gap-x-2">
            {address && getAddress(address) == aval.avaldaoAddress && (
              <Button
                className="bg-yellow-300 hover:bg-yellow-400 text-slate-500"
                disabled={aval.avaldaoSignature != undefined}
                onClick={() => signAval(aval, "avaldao")}>
                <PenLine />
                signAval avaldao
              </Button>
            )}
            {address && getAddress(address) == aval.solicitanteAddress && (
              <Button className="bg-yellow-300 hover:bg-yellow-400 text-slate-500"
                disabled={aval.solicitanteSignature != undefined}
                onClick={() => signAval(aval, "solicitante")}>
                <PenLine />
                signAval solicitante
              </Button>
            )}
            {address && getAddress(address) == aval.comercianteAddress && (
              <Button className="bg-yellow-300 hover:bg-yellow-400 text-slate-500"
                disabled={aval.comercianteSignature != undefined}
                onClick={() => signAval(aval, "comerciante")}>
                <PenLine />
                signAval comerciante
              </Button>
            )}

            {address && getAddress(address) == aval.avaladoAddress && (
              <Button className="bg-yellow-300 hover:bg-yellow-400 text-slate-500"
                disabled={aval.avaladoSignature != undefined}
                onClick={() => signAval(aval, "avalado")}>
                <PenLine />
                signAval avalado
              </Button>
            )}


          </div>



        </div>


      </CardContent>
    </Card>

  )
}