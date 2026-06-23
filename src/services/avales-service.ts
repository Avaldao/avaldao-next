import 'server-only';
import getDb from "@/lib/mongodb";
import { Aval, AvalRequest } from "@/types";
import AvalModel from "@/lib/db/models/aval-model";
import UserModel from "@/lib/db/models/user-model";
import { Contract, getAddress, id, JsonRpcProvider, SignatureLike, verifyTypedData } from "ethers";
import { getCurrentUser } from "@/lib/auth/authorization";
import { use } from "react";
import { pinata } from "@/lib/pinata";
import avaldaoAbi from "@/blockchain/contracts/avaldao/avaldao.abi";
import { contractsAddress } from "@/blockchain/contracts";
import avalAbi from "@/blockchain/contracts/avaldao/aval.abi";

export type AvalRoleEnum = "avaldao" | "solicitante" | "comerciante" | "avalado";

export default class AvalesService {
  constructor() {

  }

  async getDb() {
    const db = await getDb("avaldao-production");
    return db;
  }

  async getAvales() {
    const user = await getCurrentUser();

    const isAdmin = user.roles.includes("AVALDAO_ROLE") ||
      user.roles.includes("ADMIN_ROLE");

    const filter = isAdmin
      ? {}
      : user.address ? {
        $or: [
          { avaldaoAddress: user.address },
          { solicitanteAddress: user.address },
          { comercianteAddress: user.address },
          { avaladoAddress: user.address },
        ],
      } : { _id: null }; //algun filtro que no devuelva nada

    const avales = await AvalModel.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return avales.map(aval => ({
      ...aval,
      _id: aval._id.toString(),
    }));
  }



  async getAvalesByAddress(address: string) {
    const user = await getCurrentUser();

    const isAdmin = user.roles.includes("AVALDAO_ROLE") ||
      user.roles.includes("ADMIN_ROLE");

    const isOwner = user.address.toLowerCase() === address.toLowerCase();

    if (!isAdmin && !isOwner) {
      throw new Error("Unauthorized");
    }

    const avales = await AvalModel.find({
      $or: [
        { avaldaoAddress: address },
        { solicitanteAddress: address },
        { comercianteAddress: address },
        { avaladoAddress: address },
      ],
    })
      .sort({ createdAt: -1 })
      .lean();

    return avales.map(aval => ({
      ...aval,
      _id: aval._id.toString(),
    }));
  }

  async _storeIpfs(avalId: string) {
    let upload;

    const aval = await AvalModel.findById(avalId)
      .select("-__v -avaladoAddress -comercianteAddress -solicitanteAddress -avaldaoAddress -createdAt -updatedAt -status")
      .lean();
    if (!aval) throw new Error("Aval not found");
    try {
      upload = await pinata.pinJSONToIPFS(aval, {
        pinataMetadata: {
          name: `aval-${aval._id.toString()}`,
        },
      })

      await AvalModel.findByIdAndUpdate(avalId, {
        $set: {
          infoCid: upload.IpfsHash,
        }
      });

    } catch (error) {
      console.error("Error uploading to IPFS", error);
    }

    return upload;

  }

  async saveAval(avalData: AvalRequest): Promise<Aval> {
    avalData.fechaInicio = new Date(avalData.fechaInicio);
    avalData.duracionCuotaSeconds = avalData.duracionCuotaDias * 24 * 60 * 60;
    avalData.montoFiat = avalData.montoFiat * 100; //lo guarda con 2 decimales

    const aval = new AvalModel({
      ...avalData
    });

    const result = await aval.save();

    if (aval.chainId === 30) { //solo subimos a ipfs los avales de mainnet, los de testnet no
      await this._storeIpfs(result._id.toString());
    } else {
      console.log("Aval created on testnet, skipping IPFS upload");

    }

    return result;
  }



  async registerSignature(avalId: string, signature: String, data: string, role: AvalRoleEnum | undefined): Promise<boolean> {

    const { domain, types, primaryType, message } = JSON.parse(data);
    const signer = verifyTypedData(domain, { [`${primaryType}`]: types[primaryType] }, message, signature as SignatureLike);

    //Si no nos pasan un role, signfica que las address dentro de un aval son unicas
    if (!role) {
      role = await this.getAvalRoleByAddress(avalId, signer);
      if (!role) {
        throw new Error("Invalid request. Signer not found on aval");
      }
    }

    const storedAddress = getAddress((await AvalModel.findById(avalId))[`${role}Address`].toLowerCase());
    if (storedAddress.toLowerCase() != signer.toLowerCase()) {
      throw new Error(`Invalid request. Signer and role doesn't match. Stored ${role}: ${storedAddress} - signer: ${signer}`)
    }

    const update = await AvalModel.findByIdAndUpdate(avalId, {
      $set: {
        [`${role}Signature`]: signature
      }
    }, {
      new: true
    });

    return true;
  }


  async getAvalRoleByAddress(avalId: string, address: string): Promise<AvalRoleEnum | undefined> {
    const aval = await AvalModel.findById(avalId);
    if (!aval) throw new Error("Aval not found");

    const addr = address.toLowerCase();
    if (aval.avaldaoAddress?.toLowerCase() === addr) {
      return "avaldao";
    } else if (aval.solicitanteAddress?.toLowerCase() === addr) {
      return "solicitante";
    } else if (aval.avaladoAddress?.toLowerCase() === addr) {
      return "avalado";
    } else if (aval.comercianteAddress?.toLowerCase() === addr) {
      return "comerciante";
    }
    return;

  }

  /* Just basic data */
  async getAvalSummary(avalId: string, solicitanteAddress?: string): Promise<{ proyecto: string; solicitante: { name: string | null; address: string | null } } | null> {
    const aval = await AvalModel.findOne({ _id: avalId });


    let solicitante;
    if (solicitanteAddress) {
      const validatedAddress = getAddress(solicitanteAddress.toLowerCase()); // throws if not a valid Ethereum address
      solicitante = await UserModel.findOne({ address: new RegExp(`^${validatedAddress}$`, "i") }).select("name")
    }

    return {
      proyecto: aval?.proyecto ?? "", //No encontrado localmente
      solicitante: {
        name: solicitante?.name ?? null,
        address: solicitanteAddress ?? null,
      },
    };
  }



  async getAval(id: string, forceSync: boolean): Promise<Aval | null> {
    if (forceSync) {
      try {
        await this.syncAvalOnChain(id);
      } catch (err) {
        console.log(err); //do nothing
      }
    }


    const aval = await AvalModel.findOne({ _id: id });
    const serializedAval = {
      ...aval.toObject(), // Convert Mongoose document to plain object
      _id: aval._id.toString(),
      createdAt: aval.createdAt.toISOString(),
      updatedAt: aval.updatedAt.toISOString(),
    };

    return serializedAval;
  }

  async getAll(): Promise<Aval[]> {
    const db = await this.getDb();
    const avales = await db.collection<Aval>("avales").find({}).sort({ createdAt: -1 }).toArray();
    return avales.map(a => ({
      ...a,
      _id: a._id.toString(),
      montoFiat: a.montoFiat / 100 //se guarda con 2 decimales
    }));
  }

  private async _getAvaldao(chainId: Number): Promise<Contract> {
    const rpcUrl = chainId === 30 ? process.env.MAINNET_RPC_URL : chainId === 31 ? process.env.TESTNET_RPC_URL : null;
    if (!rpcUrl) throw new Error("Unsupported chainId");

    const provider = new JsonRpcProvider(rpcUrl);
    const address = contractsAddress[chainId as 30 | 31].avaldao;
    return new Contract(address, avaldaoAbi, provider);
  }


  private async _getAval(chainId: Number, address: string): Promise<Contract> {
    const rpcUrl = chainId === 30 ? process.env.MAINNET_RPC_URL : chainId === 31 ? process.env.TESTNET_RPC_URL : null;
    if (!rpcUrl) throw new Error("Unsupported chainId");

    const provider = new JsonRpcProvider(rpcUrl);
    return new Contract(address, avalAbi, provider);
  }



  async rejectAval(avalId: string, reason: string): Promise<void> {
    const user = await getCurrentUser();
    if (!user.roles.includes("AVALDAO_ROLE")) {
      throw new Error("Unauthorized: missing AVALDAO_ROLE");
    }

    const aval = await AvalModel.findById(avalId);
    if (!aval) throw new Error("Aval not found");
    if (aval.status !== 0) throw new Error("Solo se pueden rechazar avales en estado Solicitado");

    await AvalModel.findByIdAndUpdate(avalId, {
      $set: { status: 1, rejectReason: reason },
    });
  }

  async syncAvalOnChain(avalId: string): Promise<void> {
    const local = await AvalModel.findById(avalId);
    if (!local) throw new Error("Aval not found");

    const avaldao = await this._getAvaldao(local.chainId);

    const onChainAvalIds: string[] = await avaldao.getAvalIds();

    if (!onChainAvalIds.includes(avalId)) {
      throw new Error("Aval not found on chain");
    }

    const onChainAddress = await avaldao.getAvalAddress(avalId);
    const aval = await this._getAval(local.chainId, onChainAddress);

    const onChainStatus = Number(await aval.status());

    if (local.address == undefined) {
      await AvalModel.findByIdAndUpdate(avalId, {
        $set: {
          address: onChainAddress,
          onChainStatus: onChainStatus,
          status: onChainStatus,
          syncOnChain: new Date()
        }
      });
    } else if (local.address != undefined) {
      await AvalModel.findByIdAndUpdate(avalId, {
        $set: {
          onChainStatus: onChainStatus,
          status: onChainStatus,
          syncOnChain: new Date()
        }
      });
    }
  }


}


/* 
//also we can try of validate signature, but again, we need the original message

new AvalesService().registerSignature(
  "6914d31a8925c19898133dfb",
  "0x9deC90af27E95299D56Cef85eE1aD7E77353dDBB",
  "comerciante",
  "0x2573cf2ee6845a5de33c82959936bff488c5bd2c113cd6131257fd516e62df333aa4b6d897512ef19aa42b838e30b2d4de5b7f88f82cfb4e5d75a65e83930d321c"
) */


