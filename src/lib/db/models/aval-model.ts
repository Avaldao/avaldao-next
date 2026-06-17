import mongoose from 'mongoose';
const { Schema } = mongoose;

export enum Status {
  Solicitado = 0,
  Rechazado = 1,
  Aceptado = 2,
  Vigente = 3,
  Finalizado = 4,
}

export const avalSchema = new Schema(
  {
    proyecto: { type: String, required: true },
    objetivo: { type: String, required: true },
    adquisicion: { type: String, required: true },
    beneficiarios: { type: String, required: true },
    montoFiat: { type: Number, required: true },
    cuotasCantidad: { type: Number, required: true },
    fechaInicio: { type: Date, default: Date.now },
    duracionCuotaSeconds: { type: Number, default: 2592000 }, //30 dias
    desbloqueoSeconds: { type: Number, default: 864000 }, // 10 días
    avaldaoAddress: { type: String, required: true },
    solicitanteAddress: { type: String, required: true },
    comercianteAddress: { type: String, required: true },
    avaladoAddress: { type: String, required: true },
    avaldaoSignature: { type: String },
    solicitanteSignature: { type: String },
    comercianteSignature: { type: String },
    address: { type: String, required: false },
    avaladoSignature: { type: String },
    status: {
      type: Number,
      required: true,
      default: Status.Solicitado,
      enum: Object.values(Status).filter(v => typeof v === 'number'),
    },
    onChainStatus: { type: Number, required: false, default: 0 },
    syncOnChain: {
      type: Date,
    },
    chainId: { type: Number, required: true },
    infoCid: { type: String },
    rejectReason: { type: String },
  },
  {
    timestamps: true,
    collection: 'avales'
  }
);



// Prevent model recompilation in development
export default mongoose.models.Aval || mongoose.model('Aval', avalSchema);
