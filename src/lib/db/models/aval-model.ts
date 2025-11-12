import mongoose from 'mongoose';
const { Schema } = mongoose;

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
    avaladoSignature: { type: String },
    status: { type: Number, required: true, default: 0 }
  },
  {
    timestamps: true,
    collection: 'avales'
  }
);



// Prevent model recompilation in development
export default mongoose.models.Aval || mongoose.model('Aval', avalSchema);
