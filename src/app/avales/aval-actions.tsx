"use client";

import avaldaoAbi from "@/blockchain/contracts/avaldao/avaldao.abi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Aval, AvalState } from "@/types";
import { useAppKitAccount, useAppKitNetwork, useAppKitProvider, useWalletInfo } from "@reown/appkit/react";
import { BrowserProvider, Contract, Eip1193Provider, getAddress, hexlify, isError, JsonRpcSigner } from "ethers";
import { rootstock, AppKitNetwork } from "@reown/appkit/networks";

import { Wrench, PenLine, PlayCircle, Banknote } from "lucide-react";
import { useSession } from "next-auth/react";
import { ROOTSTOCK_NETWORKS } from "@/config";
import toast from "react-hot-toast";
import avalAbi from "@/blockchain/contracts/avaldao/aval.abi";
import { generateStructDataToSign, getTranchesTs } from "../entities/aval.entity";
import adminAbi from "@/blockchain/contracts/avaldao/admin.abi";
import { ADMIN_ROLE, AVALDAO_ROLE } from "@/roles";
import { AvalRoleEnum } from "@/services/avales-service";
import { useRouter } from "next/navigation";
import vaultAbi from "@/blockchain/contracts/avaldao/vault.abi";
import { getSignatures } from "@/blockchain/utils/signatures";

const avalStatuses = [
  "Solicitado",
  "Rechazado",
  "Aceptado",
  "Vigente",
  "Finalizado"
]

const contractsAddress: {
  [key: number]: {
    avaldao: string;
    permissions: string;
    tokens?: {
      doc: string;
    };
  }
} = {
  30: {
    avaldao: "0x6DC9BCDD6fe5822D7E52Ac06E3ae740faa5d57a5",
    permissions: "0x7D64C1532Efa7bd0d1554b4876d01e8c273fA129",
    tokens: {
      doc: ""
    }
  },
  31: {
    avaldao: "0x0185e73DaaC1FBF56f71448477026A6A3Dd39aFE",
    permissions: "0x35e08235457394A1C50dF3C1641BD4996F2EBB5F",
    tokens: {
      doc: "0xCB46c0ddc60D18eFEB0E586C17Af6ea36452Dae0"
    },
  }
}


interface GetContractsOptions {
  permissions?: boolean;
}

interface ContractsResult {
  avaldao: Contract,
  vault: Contract,
  avalContract?: Contract,
  avaldaoAddress: string,
  vaultAddress: string,
  avalAddress?: string,
  signer: JsonRpcSigner,
  permissions?: {
    address: string,
    contract?: Contract,
  }
}



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




  async function getContracts({ permissions = false }: GetContractsOptions = {}): Promise<ContractsResult> {
    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();
    const chainId = signer.provider._network.chainId;
    console.log(`Network: ${signer.provider._network.chainId}`)

    const avaldaoAddress = contractsAddress[Number(chainId)].avaldao;
    const avaldao = new Contract(avaldaoAddress, avaldaoAbi, signer);

    const vaultAddress = await avaldao.vault();
    const vault = new Contract(vaultAddress, vaultAbi, signer);

    let avalAddress;
    let avalContract;

    if (aval._id) {
      const avalAddress = await avaldao.getAvalAddress(aval._id);
      avalContract = new Contract(avalAddress, avalAbi, signer);
    }

    let permissionsContract;
    let permissionsAddress;

    if (permissions) {
      const permissionsAddress = contractsAddress[Number(chainId)].permissions;
      console.log(`Permissions contract address: ${permissionsAddress}`)
      permissionsContract = new Contract(permissionsAddress, adminAbi, signer);

    }

    const result: ContractsResult = {
      avaldao,
      vault,
      avalContract,
      avaldaoAddress,
      avalAddress,
      vaultAddress,
      signer
    };

    if (permissionsContract) {
      result.permissions = {
        address: permissionsAddress!,
        contract: permissionsContract
      }
    }


    return result;

  }

  async function getAval(avalId: string) {
    const { avalContract } = await getContracts();
    console.log(`Get aval:  ${avalId}`)
    if (!avalContract) {
      console.log("Aval contract not found");
      return;
    }

    try {
      const cuotas = await avalContract.cuotasCantidad();
      const montoFiat = await avalContract.montoFiat();
      const status = await avalContract.status();
      console.log(`Aval: ${avalId} Cuotas: ${cuotas} - Monto fiat: ${Number(montoFiat) / 100} USD - status: ${avalStatuses[status]}`)

    } catch (err) {
      console.log(err);
    }
  }

  async function signAval(aval: Aval, role: AvalRoleEnum) {
    const { avaldaoAddress, avalAddress, signer } = await getContracts();

    aval.infoCid = "/ipfs/QmQZiVUdK7t5N8teghjQ3khcQ32W6bpFvuUpsU7p1wcBun"; //TODO: READ FROM BACKEND OR GENERATE
    aval.address = avalAddress!;

    const data = JSON.stringify(generateStructDataToSign(aval, avaldaoAddress));

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

    //Can I get the permissions /admin from avaldao contract directly?
    const { permissions } = await getContracts({ permissions: true });
    const permissionsContract = permissions?.contract;
    if (!permissionsContract) {
      console.log("Permissions contract not found");
      return;
    }


    try {

      const app = "0x0185e73DaaC1FBF56f71448477026A6A3Dd39aFE"; //avaldao tesnet

      const check1 = await permissionsContract.hasUserRole(
        signer.address, //who
        app, //avaldao 
        AVALDAO_ROLE.hash
      )

      /* const check2 = await permissionsContract.hasUserRole(
        signer.address, //who
        permissions.address, //avaldao 
        ADMIN_ROLE.hash
      ) */

      console.log(`Has ${signer.address} AVALDAO_ROLE role? ${check1}`)
      /*       console.log(`Has ${signer.address} ADMIN role? ${check2}`)
      
            const tx = await permissionsContract.setUserRoles(user, [AVALDAO_ROLE.hash], [app], [], []);
            console.log(tx);
            const receipt = await tx.wait();
            console.log(receipt) */

    } catch (err) {
      console.log(err);
    }
  }




  async function startAval() {
    const { avalContract } = await getContracts();
    if (!avalContract) {
      console.log("Aval contract not found");
      return;
    }

    const signatures = getSignatures(aval);
    if (!signatures) return;
    const [r, v, s] = signatures;

    const tx = await avalContract.sign(r, v, s, {
      gasLimit: BigInt(5_000_000)
    });
    const receipt = await tx.wait();
    console.log(receipt);  //if receipt.status == 1 show "aval confirmado";

  }


  async function acceptAval() {
    try {
      const { avaldao } = await getContracts();

      const tx = await avaldao.saveAval(
        aval._id,
        "/ipfs/QmQZiVUdK7t5N8teghjQ3khcQ32W6bpFvuUpsU7p1wcBun",
        [
          aval.avaldaoAddress,
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


  async function getTokenBalance() {
    try {
      console.log(`get token balances`);
      const { vault } = await getContracts();

      const amt = await vault.getTokensBalanceFiat();
      console.log(amt);

      const docBalance = await vault.getTokenBalance("0xCB46c0ddc60D18eFEB0E586C17Af6ea36452Dae0") //DOC
      console.log(docBalance)
    } catch (err) {

      console.log(err)
    }



  }

  async function getCuotas() {
    const { avalContract } = await getContracts();
    if (!avalContract) {
      console.log("Aval contract not found");
      return;
    }

    const cuotas = [];
    const cuotasC = await avalContract.cuotasCantidad();
    for (let i = 0; i < cuotasC; i++) {
      const cuota = await avalContract.cuotas(i);
      cuotas.push(cuota);
    }

    console.log(cuotas);
    /*   uint8 numero; // Número de cuota.
         uint256 montoFiat; // Monto de la cuota en moneda fiat;
         uint32 timestampVencimiento; // Timestamp con la fecha de vencimiento de la cuota. 4 bytes.
         uint32 timestampDesbloqueo; // Timestamp con la fecha de desbloqueo de la cuota. 4 bytes.
         CuotaStatus status; //
     */

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

        
          Connected account: {address}
        
        <div>Current Chain Id: {chainId} </div>
        <div>Target Chain ID: {aval.chainId}</div>



        <div className="mt-5 space-x-2 5 space-y-2">

          {/* Botones dependiendo del estado del aval */}

          <Button onClick={acceptAval}>
            Aceptar aval testnet
          </Button>

          <Button onClick={getRoles}>
            Get roles
          </Button>


          <Button onClick={() => getAval("6914d31a8925c19898133dfb")}>
            Get aval 6914d31a8925c19898133dfb
          </Button>




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


          <div className="mt-4"> {/* Only if aval is aceptado - after creation on chain, the status should be updated offchain
            we should keep a copy of the aval address
             */}
            <Button onClick={getCuotas}>
              Get cuotas
            </Button>
          </div>

          <div className="mt-4"> {/* Only if aval is aceptado - after creation on chain, the status should be updated offchain
            we should keep a copy of the aval address
             */}
            <Button onClick={() => getTokenBalance()}>
              <Banknote className="mr-2 h-4 w-4" />
              Get avaldao balance
            </Button>
          </div>


          <div className="mt-4"> {/* Only if aval is aceptado - after creation on chain, the status should be updated offchain
            we should keep a copy of the aval address
             */}
            <Button onClick={startAval}>
              <PlayCircle className="mr-2 h-4 w-4" />
              Iniciar aval
            </Button>
          </div>



        </div>


      </CardContent>
    </Card>

  )
}