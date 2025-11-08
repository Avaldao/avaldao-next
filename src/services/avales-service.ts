import getDb from "@/lib/mongodb";
import { Aval } from "@/types";
import { ObjectId } from "mongodb";

export default class AvalesService {
  constructor() {

  }

  async getDb() {
    const db = await getDb("avaldao-production");
    return db;
  }


  async getAval(id: string): Promise<Aval | null> {
    const db = await this.getDb();
    return db.collection<Aval>("avales").findOne({ "_id": new ObjectId(id) });
  }

  async getAll(): Promise<Aval[]> {
    const db = await this.getDb();
    const avales = await db.collection<Aval>("avales").find({}).sort({ createdAt: -1 }).toArray();
    return avales.map(a => ({ ...a, _id: a._id.toString(), }));
  }


}