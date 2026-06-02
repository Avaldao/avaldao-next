"use client";

import { useEffect, useMemo, useState } from "react";
import avaldaoAbi from "@/blockchain/contracts/avaldao/avaldao.abi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Aval, AvalState } from "@/types";
import { useAppKitAccount, useAppKitNetwork, useAppKitProvider } from "@reown/appkit/react";
import { BrowserProvider, Contract, Eip1193Provider, getAddress, JsonRpcProvider, JsonRpcSigner } from "ethers";


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
import { contractsAddress } from "@/blockchain/contracts";
import { TxModal, TxStep } from "@/components/tx-modal";
import TransactionTracker from "@/components/blockchain/transaction-tracker/transaction-tracker";

import useBlockchainTransaction from "@/hooks/useBlockchainTransaction";


const avalStatuses = [
  "Solicitado",
  "Rechazado",
  "Aceptado",
  "Vigente",
  "Finalizado"
]



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
  const [showTxTracker, setShowTxTracker] = useState(false);
  const [balance, setBalance] = useState<string | null>(null);

  const provider = useMemo(() => {
    if (!walletProvider) return null;
    return new BrowserProvider(walletProvider);
  }, [walletProvider]);

  const { run, txState, clearTxState } = useBlockchainTransaction(provider);

  useEffect(() => {
    async function fetchUserBalance() {
      if (address && provider) {
        const balance = await provider.getBalance(address);
        setBalance((parseFloat(balance.toString()) / 1e18).toFixed(6));
      }
    }

    fetchUserBalance();
  }, [address]);

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




  async function getContracts(chainId: 30 | 31 = aval.chainId, { permissions = false }: GetContractsOptions = {}): Promise<ContractsResult> {
    let ethersProvider = new BrowserProvider(walletProvider);
    let signer = await ethersProvider.getSigner();
    const provider = new JsonRpcProvider(contractsAddress[Number(chainId)].rpcUrl);
    const connectedChainId = signer.provider._network.chainId;

    if (Number(connectedChainId) !== chainId) {
      const switched = await switchNet(chainId);
      if (!switched) {
        throw new Error(`Please switch to the correct network to interact with this aval. Target network chain id: ${chainId}`);
      }

      // Re-create provider and signer after network switch
      ethersProvider = new BrowserProvider(walletProvider);
      signer = await ethersProvider.getSigner();
    }

    const avaldaoAddress = contractsAddress[Number(chainId)].avaldao;
    const avaldao = new Contract(avaldaoAddress, avaldaoAbi, provider);

    const vaultAddress = await avaldao.vault();
    const vault = new Contract(vaultAddress, vaultAbi, provider);

    let avalAddress;
    let avalContract;

    if (aval._id) {
      avalAddress = await avaldao.getAvalAddress(aval._id);
      avalContract = new Contract(avalAddress, avalAbi, signer);
    }

    let permissionsContract;
    let permissionsAddress;

    if (permissions) {
      const permissionsAddress = contractsAddress[Number(chainId)].permissions;
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

    const { avalContract } = await getContracts(aval.chainId);
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
    const { avaldaoAddress, avalAddress, signer } = await getContracts(aval.chainId);
    
    aval.infoCid = aval.infoCid ?? ""; 
    aval.address = avalAddress!;
    
    if (!avalAddress) {
      throw new Error("Aval address not found for aval " + aval._id);
    }
    
    const data = JSON.stringify(generateStructDataToSign(aval, avaldaoAddress));
    console.log("Sign aval with role:", role, data);

    //Comprobar que walletProvider este bien conectado a la red que esperamos o pderile que cambie

    /*     let ethersProvider = new BrowserProvider(walletProvider);
        let signer = await ethersProvider.getSigner();
        const connectedChainId = signer.provider._network.chainId; */


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
      toast.success(`Firma de ${role} registrada exitosamente`);
      router.refresh();
    }
  }


  async function getRoles() {

    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();

    //Check network before continue
    console.log(`Network: ${signer.provider._network.chainId} - ${signer.address}`)

    //Can I get the permissions /admin from avaldao contract directly?
    const { permissions } = await getContracts(aval.chainId, { permissions: true });
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


aval


  async function startAval() {

    setShowTxTracker(true);

    const sendTransaction = async () => {
      const { avalContract } = await getContracts(aval.chainId);
      if (!avalContract) {
        console.log("Aval contract not found");
        clearTxState();
        setShowTxTracker(false);
        return;
      }
      const signatures = getSignatures(aval);
      if (!signatures) {
        clearTxState();
        setShowTxTracker(false);
        return;
      }
      const [r, v, s] = signatures;

      console.log(r,v,s)

      const tx = await avalContract.sign(r, v, s, {
        gasLimit: BigInt(5_000_000)
      });


      return tx;

    };

    await run(sendTransaction);


/* 
    try {
      const { avalContract } = await getContracts(aval.chainId);
      if (!avalContract) {
        console.log("Aval contract not found");
        setTxModalOpen(false);
        return;
      }
      const signatures = getSignatures(aval);
      if (!signatures) {
        setTxModalOpen(false);
        return;
      }
      const [r, v, s] = signatures;

      const tx = await avalContract.sign(r, v, s, {
        gasLimit: BigInt(5_000_000)
      });

      setTxHash(tx.hash);
      setTxStep('waiting_confirmation');

      const receipt = await tx.wait();
      console.log(receipt);

      if (receipt?.status === 1) {
        setTxStep('confirmed');
        toast.success('Transacción confirmada exitosamente.');
        router.refresh();
      } else {
        setTxStep('error');
        setTxError('La transacción falló en la blockchain.');
      }
    } catch (err: any) {
      console.log(err);
      if (isUserRejection(err)) {
        setTxModalOpen(false);
        toast('Cancelaste la transacción.', { icon: '⚠️' });
      } else {
        setTxStep('error');
        setTxError(err?.message ?? 'Error desconocido.');
      }
    } */
  }


  async function getTokenBalance() {
    try {
      console.log(`get token balances`);
      const { vault } = await getContracts(aval.chainId);

      const amt = await vault.getTokensBalanceFiat();
      console.log(amt);

      const docBalance = await vault.getTokenBalance("0xCB46c0ddc60D18eFEB0E586C17Af6ea36452Dae0") //DOC
      console.log(docBalance)
    } catch (err) {

      console.log(err)
    }



  }

  async function getCuotas() {
    const { avalContract } = await getContracts(aval.chainId);
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

  function isUserRejection(err: any): boolean {
    return (
      err?.code === 4001 ||
      err?.code === 'ACTION_REJECTED' ||
      err?.message?.toLowerCase().includes('user denied') ||
      err?.message?.toLowerCase().includes('user rejected')
    );
  }


  async function acceptAval() {
    setShowTxTracker(true);

    const sendTransaction = async () => {
      const { avaldao } = await getContracts(aval.chainId);
      console.log(`Sending transaction to accept aval ${aval._id} on chain ${aval.chainId}..., with infocid: ${aval.infoCid ?? ""}`);
      const tx = await avaldao.saveAval(
        aval._id,
        aval.infoCid ?? "",
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

      return tx;

    };

    await run(sendTransaction);
  }




  return (
    <>
      {/*       <TxModal
        isOpen={txModalOpen}
        onClose={() => setTxModalOpen(false)}
        step={txStep}
        txHash={txHash}
        errorMessage={txError}
        explorerUrl={explorerUrl}
        networkName={networkName}
      /> */}

      {showTxTracker && address && (

        <TransactionTracker
          balance={balance ? `${balance} tRBTC` : null}
          contract={{
            name: "Avaldao",
            address: contractsAddress[aval.chainId].avaldao,
          }}
          explorerUrl={contractsAddress[aval.chainId]?.explorerUrl}
          txState={txState}
          onClose={() => {
            clearTxState();
            setShowTxTracker(false);
          }}
        />
      )}

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
              Aceptar aval testnet(new interface)
            </Button>

            <Button onClick={startAval}>
              <PlayCircle className="mr-2 h-4 w-4" />
              Iniciar aval
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
                  onClick={async () => {
                    try {
                      await signAval(aval, "avaldao")
                    } catch (err) {
                      console.log(err);
                      toast.error(`Error signing aval: ${err}`);
                    }
                  }}>
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






          </div>


        </CardContent>
      </Card >
    </>
  )
}