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
import NotificationsService from "@/services/notifications-service";
import { AvalTerminos, generateTerminos } from "@/app/entities/aval-terms.entity";

export type AvalRoleEnum = "avaldao" | "solicitante" | "comerciante" | "avalado";

/**
 * Campos del aval que integran el JSON pineado en IPFS. Modificar cualquiera de
 * ellos cambia el CID y, por lo tanto, invalida las firmas EIP-712 ya
 * registradas (el infoCid es uno de los campos firmados). Toda escritura que
 * los toque tiene que pasar por `_updateAval`, que re-pinea y bloquea el cambio
 * si el aval ya tiene firmas.
 */
const IPFS_JSON_FIELDS = [
  "proyecto",
  "objetivo",
  "adquisicion",
  "beneficiarios",
  "montoFiat",
  "cuotasCantidad",
  "fechaInicio",
  "duracionCuotaSeconds",
  "desbloqueoSeconds",
  "chainId",
  "terminos",
] as const;

/** Identificador de formato del JSON pineado, para poder evolucionarlo sin
 *  ambigüedad al leer CIDs viejos. */
const IPFS_JSON_FORMAT = "avaldao.aval-info.v1";

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

  /**
   * Arma el JSON que se publica en IPFS. La proyección es explícita (whitelist)
   * y con orden de claves fijo: el JSON tiene que ser función determinista de
   * los términos del aval. Si incluyera campos volátiles (firmas, estado, fechas
   * de sincronización) cada re-pin daría un CID distinto y las firmas ya
   * registradas quedarían inválidas.
   */
  private _buildIpfsPayload(aval: any, terminos: AvalTerminos) {
    return {
      formato: IPFS_JSON_FORMAT,
      _id: aval._id.toString(),
      proyecto: aval.proyecto,
      objetivo: aval.objetivo,
      adquisicion: aval.adquisicion,
      beneficiarios: aval.beneficiarios,
      montoFiat: aval.montoFiat,
      cuotasCantidad: aval.cuotasCantidad,
      fechaInicio: new Date(aval.fechaInicio).toISOString(),
      duracionCuotaSeconds: aval.duracionCuotaSeconds,
      desbloqueoSeconds: aval.desbloqueoSeconds,
      chainId: aval.chainId,
      terminos,
    };
  }

  /**
   * Regenera los términos, pinea el JSON del aval y guarda el CID resultante.
   * Es idempotente: IPFS es content-addressed, así que re-pinear un contenido
   * idéntico devuelve el mismo CID y no se toca la base.
   *
   * Un fallo de Pinata se propaga: sin infoCid el aval no puede aceptarse ni
   * firmarse, y el llamador tiene que enterarse.
   */
  async _storeIpfs(avalId: string): Promise<{ cid: string; changed: boolean }> {
    const aval = await AvalModel.findById(avalId).lean();
    if (!aval) throw new Error("Aval not found");

    const terminos = generateTerminos(aval as any);
    const payload = this._buildIpfsPayload(aval, terminos);

    let upload;
    try {
      upload = await pinata.pinJSONToIPFS(payload, {
        pinataMetadata: {
          name: `aval-${aval._id.toString()}`,
        },
      });
    } catch (error) {
      console.error("Error uploading to IPFS", error);
      throw new Error(
        `No se pudo publicar la información del aval en IPFS: ${(error as Error)?.message ?? error}`
      );
    }

    const cid = upload.IpfsHash;
    const changed = aval.infoCid !== cid;

    await AvalModel.findByIdAndUpdate(avalId, {
      $set: {
        terminos,
        infoCid: cid,
      },
    });

    return { cid, changed };
  }

  /**
   * Punto único de escritura sobre el aval. Si el cambio toca algún campo que
   * forma parte del JSON de IPFS, re-pinea para que el infoCid siga
   * describiendo el estado real del aval; y lo rechaza si ya hay firmas, porque
   * en ese caso el CID nuevo dejaría inválidas las firmas registradas.
   */
  private async _updateAval(avalId: string, set: Record<string, unknown>) {
    const touchesIpfsJson = Object.keys(set).some(key =>
      (IPFS_JSON_FIELDS as readonly string[]).includes(key)
    );

    if (touchesIpfsJson) {
      const current = await AvalModel.findById(avalId).lean();
      if (!current) throw new Error("Aval not found");

      const hasSignatures = [
        current.avaldaoSignature,
        current.solicitanteSignature,
        current.comercianteSignature,
        current.avaladoSignature,
      ].some(Boolean);

      if (hasSignatures) {
        throw new Error(
          "No se pueden modificar los términos de un aval que ya tiene firmas registradas: cambiaría el infoCid y las invalidaría."
        );
      }
    }

    await AvalModel.findByIdAndUpdate(avalId, { $set: set });

    if (touchesIpfsJson) {
      await this._storeIpfs(avalId);
    }
  }

  /**
   * Re-genera términos y CID de un aval. Sirve para reintentar cuando el pin
   * falló durante la creación.
   */
  async repinAval(avalId: string): Promise<{ cid: string; changed: boolean }> {
    const user = await getCurrentUser();
    if (!user.roles.includes("AVALDAO_ROLE")) {
      throw new Error("Unauthorized: missing AVALDAO_ROLE");
    }

    const aval = await AvalModel.findById(avalId).lean();
    if (!aval) throw new Error("Aval not found");

    const hasSignatures = [
      aval.avaldaoSignature,
      aval.solicitanteSignature,
      aval.comercianteSignature,
      aval.avaladoSignature,
    ].some(Boolean);

    if (hasSignatures) {
      // Un aval firmado ya tiene infoCid (sin él no se puede firmar). Re-pinearlo
      // solo podría reemplazar el CID que las firmas comprometen.
      throw new Error(
        "No se puede re-publicar en IPFS un aval que ya tiene firmas registradas."
      );
    }

    return this._storeIpfs(avalId);
  }

  async saveAval(avalData: AvalRequest): Promise<Aval> {
    avalData.fechaInicio = new Date(avalData.fechaInicio);
    avalData.duracionCuotaSeconds = avalData.duracionCuotaDias * 24 * 60 * 60;
    avalData.montoFiat = avalData.montoFiat * 100; //lo guarda con 2 decimales

    const aval = new AvalModel({
      ...avalData
    });

    const result = await aval.save();

    // Se pinea en todas las redes: un aval de testnet sin términos commiteados
    // tampoco se puede firmar de forma informada.
    await this._storeIpfs(result._id.toString());

    // Recargado para devolver el aval con infoCid y términos ya persistidos.
    const stored = await AvalModel.findById(result._id);
    if (!stored) throw new Error("Aval not found");

    // Avisa al Avaldao que hay un aval para evaluar (no lanza ante fallas de email).
    await new NotificationsService().notifyNewAval(stored);

    return stored;
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

    await this._updateAval(avalId, {
      [`${role}Signature`]: signature,
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

    await this._updateAval(avalId, { status: 1, rejectReason: reason });
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

    await this._updateAval(avalId, {
      ...(local.address == undefined ? { address: onChainAddress } : {}),
      onChainStatus: onChainStatus,
      status: onChainStatus,
      syncOnChain: new Date()
    });
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


