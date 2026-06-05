import mongoose, { Document } from 'mongoose';
import { usersMongooseConnection } from '@/lib/mongodb';
const { Schema } = mongoose;

export type Role =
  | "ADMIN_ROLE"
  | "AVALDAO_ROLE"
  | "SOLICITANTE_ROLE"
  | "COMERCIANTE_ROLE"
  | "AVALADO_ROLE"
  | "INVERSOR_ROLE";

export type UserStatus = "pending" | "active" | "rejected" | "suspended";

export interface IUser extends Document {
  address: string;
  accountType?: "personal" | "business";
  name: string;
  email: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  cuit?: string;
  country?: string;
  location?: string;
  platformRoles?: string[];
  acceptTyC?: boolean;
  acceptPrivacy?: boolean;
  status?: UserStatus;
  url?: string;
  infoCid?: string;
  avatar?: string;
  website?: string;
  updatedAt?: Date;
  createdAt?: Date;
  roles:{
    [key:string]: {
      roles: Role[]
      lastSyncedAt: Date
    }
  }
}



export const userSchema = new Schema<IUser>(
  {
    address: {
      type: String,
      match: /^0x[a-fA-F0-9]{40}$/,
      required: true,
      unique: true,
      trim: true,
    },
    accountType: {
      type: String,
      enum: ["personal", "business"],
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    companyName: {
      type: String,
      trim: true,
    },
    cuit: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    platformRoles: {
      type: [String],
      default: [],
    },
    acceptTyC: {
      type: Boolean,
      default: false,
    },
    acceptPrivacy: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["pending", "active", "rejected", "suspended"],
      default: "pending",
    },
    url: {
      type: String,
      trim: true,
    },
    infoCid: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    roles: {
      type: Map,
      of: new Schema({
        roles: {
          type: [String],
          enum: ["ADMIN_ROLE", "AVALDAO_ROLE", "SOLICITANTE_ROLE", "COMERCIANTE_ROLE", "AVALADO_ROLE", "INVERSOR_ROLE"],
        },
        lastSyncedAt: {
          type: Date,
        },
      }),
    },
  },
  {
    timestamps: true, // crea createdAt y updatedAt
  }
);

userSchema.methods.hasRole = function (networkId: string, role: Role): boolean {
  const networkRoles = this.roles?.get(networkId);
  return networkRoles?.roles?.includes(role) ?? false;
};

userSchema.methods.getRolesForNetwork = function (networkId: string): Role[] {
  return this.roles?.get(networkId)?.roles ?? [];
};

export default usersMongooseConnection.models.User || usersMongooseConnection.model('User', userSchema);


