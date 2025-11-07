// lib/mongodb.ts
import { MongoClient, W } from 'mongodb';

const uri = process.env.MONGO_DB_USERS!;

const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // Usar type assertion
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}


const getDb = async (db?: string) => {
  const client = await clientPromise;
  return client.db(db);
}

export default getDb;