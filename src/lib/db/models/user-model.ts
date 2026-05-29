import mongoose from 'mongoose';
const { Schema } = mongoose;

export type Role =
  | "ADMIN_ROLE"
  | "AVALDAO_ROLE"
  | "SOLICITANTE_ROLE"
  | "COMERCIANTE_ROLE"
  | "AVALADO_ROLE";

export interface IUser extends Document {
  address: string;
  name: string;
  email: string;
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
          enum: ["ADMIN_ROLE", "AVALDAO_ROLE", "SOLICITANTE_ROLE", "COMERCIANTE_ROLE", "AVALADO_ROLE"],
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

export default mongoose.models.User || mongoose.model('User', userSchema);


