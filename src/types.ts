export interface Aval {
  _id: string;
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
}


export interface UserInfo {
  id: string;
  address: string;
  email: string;
  infoCid?: string;
  name: string;
  avatar: string;
  roles: string[];
  url?: string; //deprecated
  website?: string;
}

export interface UserUpsert {
  id: string,
  address: string,
  name: string,
  email :string,
  website?: string
  avatar?: File
}

export interface AvalRequest {
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
}


export enum AvalState {
  SOLICITADO = 0,
  RECHAZADO = 1,
  ACEPTADO = 2,
  VIGENTE = 3,
  FINALIZADO = 4
}
