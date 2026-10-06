import { CONTRACTS_VERSION } from "@/config";
import { Aval } from "@/types";

// Ventana de desbloqueo por defecto (10 días, contada desde el vencimiento de cada cuota).
// El formulario no la envía, así que el aval la toma del default de aval-model.ts: mantener ambos valores en sync.
export const DEFAULT_DESBLOQUEO_SECONDS = 864000;

export interface Tranche {
  index: number;
  startDateSeconds: number;
  maturityDateSeconds: number;
  unlockDateSeconds: number;
}

export function getTranchesTs(aval: Aval) {
  return generateTranchesFromAval(aval).map(t => [t.maturityDateSeconds, t.unlockDateSeconds]).flat()
}
export function generateTranchesFromAval(aval: Aval) {
  return generateTranches(
    aval.fechaInicio,
    aval.duracionCuotaSeconds,
    aval.desbloqueoSeconds,
    aval.cuotasCantidad
  );
}
export function generateTranches(avalFechaInicio: Date, duracionCuotaSeconds: number, desbloqueoSeconds: number, cuotasCantidad: number): Tranche[] {
  const start = Math.floor(avalFechaInicio.getTime() / 1000);
  return Array.from({ length: cuotasCantidad }, (_, index) => index)
    .map(index => {
      const startTs = (start + index * duracionCuotaSeconds);
      const vtoTs = (start + (index + 1) * duracionCuotaSeconds);

      return {
        index: index + 1,
        startDateSeconds: startTs,
        maturityDateSeconds: vtoTs,
        unlockDateSeconds: vtoTs + desbloqueoSeconds
      }
    })
}

//config.version>
//config.avaldaoContractAddress
export function generateStructDataToSign(aval: Aval, verifyingContract: string) {

  const typedData = {
    types: {
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'verifyingContract', type: 'address' }
      ],
      AvalSignable: [
        { name: 'aval', type: 'address' },
        { name: 'infoCid', type: 'string' },
        { name: 'avaldao', type: 'address' },
        { name: 'solicitante', type: 'address' },
        { name: 'comerciante', type: 'address' },
        { name: 'avalado', type: 'address' }
      ]
    },
    primaryType: 'AvalSignable',
    domain: {
      name: 'Avaldao',
      version: CONTRACTS_VERSION,
      chainId: aval.chainId,
      verifyingContract: verifyingContract,
    },
    message: {
      aval: aval.address,
      infoCid: aval.infoCid,
      avaldao: aval.avaldaoAddress,
      solicitante: aval.solicitanteAddress,
      comerciante: aval.comercianteAddress,
      avalado: aval.avaladoAddress
    }
  };

  return typedData;

}
