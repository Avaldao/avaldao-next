import type { UserStatus, UserVerification } from "./lib/db/models/user-model";
import { Role } from "./roles";

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface Aval {
  _id: string;
  address?: string;
  infoCid?: string;
  proyecto: string;
  objetivo: string;
  adquisicion: string;
  beneficiarios: string;
  montoFiat: number;
  cuotasCantidad: number;
  fechaInicio: Date;
  duracionCuotaSeconds: number;
  desbloqueoSeconds: number;
  avaldaoAddress: string;
  solicitanteAddress: string;
  comercianteAddress: string;
  avaladoAddress: string;
  status: number;
  createdAt: Date;
  updatedAt: Date;
  solicitanteSignature?: string;
  avaladoSignature?: string;
  comercianteSignature?: string;
  avaldaoSignature?: string;
  chainId: 30 | 31;
  rejectReason?: string;
  terminos?: {
    version: string;
    textos: { es: string; en: string };
  };
}


/** Reclamo onchain combinado con sus mensajes offchain, serializado para el cliente. */
export interface ReclamoView {
  numero: number;
  /** 0: Vigente, 1: Cerrado. */
  status: number;
  /** Segundos. */
  timestampCreacion: number;
  mensajes: {
    id: string;
    autorAddress: string;
    autorRol: "avaldao" | "solicitante" | "comerciante" | "avalado";
    texto: string;
    fecha: string;
  }[];
}

export interface UserInfo {
  id: string;
  address: string;
  email: string;
  infoCid?: string;
  name: string;
  avatar: string;
  status?: UserStatus;
  verification?: UserVerification;
  accountType?: "personal" | "business";
  firstName?: string;
  lastName?: string;
  companyName?: string;
  cuit?: string;
  country?: string;
  roles: Role[];
  nroles: {
    [chainId: number]: Role[];
  }
  url?: string; //deprecated
  website?: string;
  platformRoles: string[];
  password?: string;
}

export interface UserUpsert {
  id: string,
  address: string,
  name: string,
  email: string,
  website?: string
  avatar?: File
}

export interface AvalRequest {
  chainId: string;
  proyecto: string,
  objetivo: string,
  adquisicion: string,
  beneficiarios: string,
  montoFiat: number,
  cuotasCantidad: number,
  fechaInicio: string | Date,
  duracionCuotaDias: number,
  solicitanteAddress: string,
  avaldaoAddress: string,
  comercianteAddress: string,
  avaladoAddress: string,
  status?: number
  duracionCuotaSeconds?: number;
  desbloqueoDias?: number;
  desbloqueoSeconds?: number;
}


export enum AvalState {
  SOLICITADO = 0,
  RECHAZADO = 1,
  ACEPTADO = 2,
  VIGENTE = 3,
  FINALIZADO = 4
}
