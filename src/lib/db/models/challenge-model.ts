import 'server-only';
import mongoose from 'mongoose';
import { usersMongooseConnection } from '@/lib/mongodb';

const { Schema } = mongoose;

export interface IChallenge {
  address: string;
  message: string;
  expirationDate: Date;
}

const challengeSchema = new Schema<IChallenge>(
  {
    address: { type: String, required: true, unique: true, index: true },
    message: { type: String, required: true },
    expirationDate: { type: Date, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Auto-delete expired documents (MongoDB TTL, runs ~every 60s)
challengeSchema.index({ expirationDate: 1 }, { expireAfterSeconds: 0 });

export default (usersMongooseConnection.models.Challenge ||
  usersMongooseConnection.model('Challenge', challengeSchema)) as mongoose.Model<IChallenge>;
