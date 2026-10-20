import mongoose, { Document } from 'mongoose';
import { usersMongooseConnection } from '@/lib/mongodb';
import { STAFF_ROLES, StaffRole } from '@/lib/auth/staff-roles';
const { Schema } = mongoose;

type AuthMethod = "email" | "web3";
export type Role =
  | "ADMIN_ROLE"
  | "AVALDAO_ROLE"
  | "SOLICITANTE_ROLE"
  | "COMERCIANTE_ROLE"
  | "AVALADO_ROLE"
  | "INVERSOR_ROLE";

/**
 * `active` significa identidad verificada por un admin: el nombre que muestra la
 * plataforma corresponde a esa persona o empresa. `pending` es una cuenta cuyo
 * nombre es solo declarado.
 */
export type UserStatus = "pending" | "active" | "rejected" | "suspended";

/** Cambio de roles offchain de un usuario, para auditoría. */
export interface StaffRolesChange {
  byUserId: string;
  byAddress?: string;
  at: Date;
  added: StaffRole[];
  removed: StaffRole[];
}

/** Última decisión de un admin sobre el estado del usuario. */
export interface UserVerification {
  status: UserStatus;
  byUserId: string;
  byAddress?: string;
  at: Date;
  method: "manual";
  note?: string;
}

export interface IUser extends Document {
  address?: string;
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
  /** Roles offchain de backoffice (ver `@/lib/auth/staff-roles`). */
  staffRoles?: StaffRole[];
  staffRolesHistory?: StaffRolesChange[];
  acceptTyC?: boolean;
  acceptPrivacy?: boolean;
  status?: UserStatus;
  verification?: UserVerification;
  url?: string;
  infoCid?: string;
  avatar?: string;
  website?: string;
  updatedAt?: Date;
  createdAt?: Date;
  language?: string;
  emailVerified?: boolean;
  password?: string;
  activationToken?: string;
  activationTokenExpiry?: Date;
  passwordResetToken?: string;
  passwordResetTokenExpiry?: Date;
  authMethods: string[];
  roles: {
    [key: string]: {
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
      required: false,
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
    staffRoles: {
      type: [String],
      enum: STAFF_ROLES,
      default: [],
    },
    staffRolesHistory: {
      type: [
        new Schema(
          {
            byUserId: String,
            byAddress: String,
            at: Date,
            added: [String],
            removed: [String],
          },
          { _id: false }
        ),
      ],
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
    verification: {
      status: { type: String, enum: ["pending", "active", "rejected", "suspended"] },
      byUserId: String,
      byAddress: String,
      at: Date,
      method: { type: String, enum: ["manual"] },
      note: { type: String, trim: true },
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
    language: {
      type: String,
      trim: true,
      enum: ["en", "es"],
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      
    },
    activationToken: String,
    activationTokenExpiry: Date,
    passwordResetToken: String,
    passwordResetTokenExpiry: Date,

    authMethods: {
      type: [String],
      enum: ["email", "web3"],
      default: [],
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

// Unicidad de address sólo sobre valores no nulos (permite múltiples usuarios sin address)
userSchema.index(
  { address: 1 },
  {
    unique: true,
    partialFilterExpression: { address: { $type: "string" } },
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


