import getDb from "@/lib/mongodb";
import { Aval, AvalRequest, AvalState } from "@/types";
import { ObjectId } from "mongodb";
import AvalModel from "@/lib/db/models/aval-model";



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