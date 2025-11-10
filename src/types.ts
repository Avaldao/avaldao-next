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