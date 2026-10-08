import mongoose from 'mongoose';
const { Schema } = mongoose;

/** Mismo orden que `Aval.ReclamoStatus` onchain. */
export enum ReclamoStatus {
  Vigente = 0,
  Cerrado = 1,
}

export type ReclamoAutorRol = "avaldao" | "solicitante" | "comerciante" | "avalado";

export interface IReclamoMensaje {
  autorAddress: string;
  autorRol: ReclamoAutorRol;
  texto: string;
  fecha: Date;
}

export interface IReclamo {
  avalId: mongoose.Types.ObjectId;
  chainId: number;
  avalAddress: string;
  /** Número del reclamo en el contrato del Aval (empieza en 1). */
  numero: number;
  /** Copia del estado onchain, actualizada en cada lectura. */
  status: ReclamoStatus;
  /** `timestampCreacion` del reclamo onchain. */
  fechaApertura: Date;
  /** Mensajes del reclamo. El primero, del comerciante, es el motivo de apertura. */
  mensajes: IReclamoMensaje[];
  syncOnChain?: Date;
}

const mensajeSchema = new Schema<IReclamoMensaje>(
  {
    autorAddress: { type: String, required: true },
    autorRol: {
      type: String,
      required: true,
      enum: ["avaldao", "solicitante", "comerciante", "avalado"],
    },
    texto: { type: String, required: true },
    fecha: { type: Date, required: true, default: Date.now },
  },
  { _id: true }
);

/**
 * Información offchain de los reclamos. El contrato solo guarda número, estado
 * y fecha de creación; acá se agregan los mensajes (motivo incluido). Cada
 * documento se corresponde con un reclamo onchain identificado por
 * (avalId, numero), y su estado se sincroniza desde la blockchain.
 */
export const reclamoSchema = new Schema<IReclamo>(
  {
    avalId: { type: Schema.Types.ObjectId, ref: 'Aval', required: true },
    chainId: { type: Number, required: true },
    avalAddress: { type: String, required: true },
    numero: { type: Number, required: true },
    status: {
      type: Number,
      required: true,
      default: ReclamoStatus.Vigente,
      enum: Object.values(ReclamoStatus).filter(v => typeof v === 'number'),
    },
    fechaApertura: { type: Date, required: true },
    mensajes: { type: [mensajeSchema], default: [] },
    syncOnChain: { type: Date },
  },
  {
    timestamps: true,
    collection: 'reclamos'
  }
);

reclamoSchema.index({ avalId: 1, numero: 1 }, { unique: true });

// Prevent model recompilation in development
export default (mongoose.models.Reclamo ||
  mongoose.model('Reclamo', reclamoSchema)) as mongoose.Model<IReclamo>;
