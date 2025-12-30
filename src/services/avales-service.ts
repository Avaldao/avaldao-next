import getDb from "@/lib/mongodb";
import { Aval, AvalRequest, AvalState } from "@/types";
import { ObjectId } from "mongodb";
import AvalModel from "@/lib/db/models/aval-model";
import { getAddress, SignatureLike, verifyTypedData } from "ethers";

export type AvalRoleEnum = "avaldao" | "solicitante" | "comerciante" | "avalado";

export default class AvalesService {
  constructor() {

  }

  async getDb() {
    const db = await getDb("avaldao-production");
    return db;
  }

  async getAvales() {
    return AvalModel.find({})
  }


  async saveAval(avalData: AvalRequest) {
    avalData.fechaInicio = new Date(avalData.fechaInicio);
    avalData.duracionCuotaSeconds = avalData.duracionCuotaDias * 24 * 60 * 60;
    avalData.montoFiat = avalData.montoFiat * 100; //lo guarda con 2 decimales

    const aval = new AvalModel({
      ...avalData
    });

    const result = await aval.save();
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

    const storedAddress = getAddress((await AvalModel.findById(avalId))[`${role}Address`]);
    if (storedAddress != signer) {
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

    if (getAddress(aval.avaldaoAddress) == address) {
      return "avaldao";
    } else if (getAddress(aval.solicitanteAddress) == address) {
      return "solicitante";
    } else if (getAddress(aval.avaladoAddress) == address) {
      return "avalado";
    } else if (getAddress(aval.comercianteAddress) == address) {
      return "comerciante";
    }
    return;

  }

  async getAval(id: string): Promise<Aval | null> {
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


}


/* 
//also we can try of validate signature, but again, we need the original message

new AvalesService().registerSignature(
  "6914d31a8925c19898133dfb",
  "0x9deC90af27E95299D56Cef85eE1aD7E77353dDBB",
  "comerciante",
  "0x2573cf2ee6845a5de33c82959936bff488c5bd2c113cd6131257fd516e62df333aa4b6d897512ef19aa42b838e30b2d4de5b7f88f82cfb4e5d75a65e83930d321c"
) */


