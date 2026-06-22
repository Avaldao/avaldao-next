import mongoose from 'mongoose';
const { Schema } = mongoose;

export interface AvalOnchainData {
  id: string;
  address: string;
  proyecto: string;
  solicitante: { name: string | null; address: string | null };
  onchainStatus: number; // 2 = aceptado, 3 = vigente, 4 = finalizado (raw from aval contract)
  montoFiat: number; // en centavos de USD
  cuotasCantidad: number;
  lastCuotaTimestamp: number; // unix timestamp of last cuota's desbloqueo
  unlockableCuotasCount: number;
  openReclamosCount: number; // reclamos with status === 0
}

export interface IAvaldaoPlatformStatus {
  chainId: number;
  fetchedAt: Date;
  stale: boolean;
  fundBalanceDOC: number; // stored in cents, same convention as montoFiat
  avales: AvalOnchainData[];
  totalUnlockableCuotas: number;
  totalVigentes: number;
  totalFinalizados: number;
}

const avalOnchainDataSchema = new Schema<AvalOnchainData>(
  {
    id: { type: String, required: true },
    proyecto: { type: String, required: false, default: "" },
    solicitante: {
      type: new Schema({ name: { type: String, default: null }, address: { type: String, default: null } }, { _id: false }),
      default: () => ({ name: null, address: null }),
    },
    address: { type: String, required: true },
    onchainStatus: { type: Number, required: true },
    montoFiat: { type: Number, required: true, default: 0 },
    cuotasCantidad: { type: Number, required: true },
    lastCuotaTimestamp: { type: Number, required: true, default: 0 },
    unlockableCuotasCount: { type: Number, required: true, default: 0 },
    openReclamosCount: { type: Number, required: true, default: 0 },
  },
  { _id: false }
);

const avaldaoPlatformStatusSchema = new Schema<IAvaldaoPlatformStatus>(
  {
    chainId: { type: Number, required: true },
    fetchedAt: { type: Date, required: true },
    stale: { type: Boolean, required: true, default: false },
    fundBalanceDOC: { type: Number, required: true },
    avales: [avalOnchainDataSchema],
    totalUnlockableCuotas: { type: Number, required: true, default: 0 },
    totalVigentes: { type: Number, required: true, default: 0 },
    totalFinalizados: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: false,
    collection: 'avaldao_platform_status',
  }
);

export default mongoose.models.AvaldaoPlatformStatus ||
  mongoose.model<IAvaldaoPlatformStatus>('AvaldaoPlatformStatus', avaldaoPlatformStatusSchema);
