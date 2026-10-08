import 'server-only';
import { Contract, getAddress, ZeroAddress } from "ethers";
import { Types } from "mongoose";
import AvalModel from "@/lib/db/models/aval-model";
import ReclamoModel, { ReclamoAutorRol, ReclamoStatus } from "@/lib/db/models/reclamo-model";
import { getCurrentUser } from "@/lib/auth/authorization";
import { NotAuthorizedError } from "@/errors";
import ContractsFactory, { contractsAddress } from "@/blockchain/contracts";
import avaldaoAbi from "@/blockchain/contracts/avaldao/avaldao.abi";
import avalAbi from "@/blockchain/contracts/avaldao/aval.abi";
import { ReclamoView } from "@/types";

export const MENSAJE_MAX_LENGTH = 2000;

interface OnchainReclamo {
  numero: number;
  status: number;
  timestampCreacion: number;
}

/** En el contexto de un reclamo, si una address ocupa varios roles del aval,
 *  se la identifica por el más relevante para la conversación. */
const ROL_PRIORITY: ReclamoAutorRol[] = ["comerciante", "solicitante", "avaldao", "avalado"];

export default class ReclamosService {

  private async _getAvalContract(aval: { _id: unknown; chainId: number; address?: string }): Promise<Contract> {
    const provider = ContractsFactory.getProvider(aval.chainId);
    let address = aval.address;
    if (!address) {
      const avaldao = new Contract(contractsAddress[aval.chainId as 30 | 31].avaldao, avaldaoAbi, provider);
      const raw: string = await avaldao.getAvalAddress(String(aval._id));
      if (raw === ZeroAddress) throw new Error("El aval no está registrado onchain");
      address = getAddress(raw);
    }
    return new Contract(address, avalAbi, provider);
  }

  private async _readOnchainReclamos(avalContract: Contract): Promise<OnchainReclamo[]> {
    const length = Number(await avalContract.getReclamosLength());
    return Promise.all(
      Array.from({ length }, (_, i) =>
        avalContract.reclamos(i).then((r: { numero: bigint; status: bigint; timestampCreacion: bigint }) => ({
          numero: Number(r.numero),
          status: Number(r.status),
          timestampCreacion: Number(r.timestampCreacion),
        }))
      )
    );
  }

  /**
   * Rol con el que el usuario actual participa de los reclamos del aval. Las
   * addresses del aval mandan; si no es participante pero tiene AVALDAO_ROLE en
   * la red del aval, participa como Avaldao.
   */
  private async _getViewerRol(aval: {
    chainId: number;
    avaldaoAddress: string;
    solicitanteAddress: string;
    comercianteAddress: string;
    avaladoAddress: string;
  }): Promise<{ address: string; rol: ReclamoAutorRol } | null> {
    const user = await getCurrentUser();
    if (!user.address) return null;

    const addr = user.address.toLowerCase();
    const rol = ROL_PRIORITY.find(r => aval[`${r}Address`]?.toLowerCase() === addr);
    if (rol) return { address: getAddress(addr), rol };

    if (user.nroles?.[aval.chainId]?.includes("AVALDAO_ROLE")) {
      return { address: getAddress(addr), rol: "avaldao" };
    }
    return null;
  }

  /**
   * Reclamos del aval: los datos onchain combinados con los mensajes offchain.
   * Sincroniza la colección con la blockchain (crea los documentos que falten y
   * actualiza estados). Los mensajes solo se devuelven a participantes del aval
   * y a quienes tienen AVALDAO_ROLE en su red.
   */
  async getReclamos(avalId: string): Promise<{ reclamos: ReclamoView[]; viewerRol: ReclamoAutorRol | null }> {
    const aval = await AvalModel.findById(avalId).lean();
    if (!aval) throw new Error("Aval not found");

    const avalContract = await this._getAvalContract(aval);
    const onchain = await this._readOnchainReclamos(avalContract);
    const avalAddress = await avalContract.getAddress();

    if (onchain.length > 0) {
      await ReclamoModel.bulkWrite(onchain.map(r => ({
        updateOne: {
          filter: { avalId: aval._id, numero: r.numero },
          update: {
            $set: { status: r.status, syncOnChain: new Date() },
            $setOnInsert: {
              chainId: aval.chainId,
              avalAddress,
              fechaApertura: new Date(r.timestampCreacion * 1000),
              mensajes: [],
            },
          },
          upsert: true,
        },
      })));
    }

    const viewer = await this._getViewerRol(aval).catch(() => null);

    const docs = viewer
      ? await ReclamoModel.find({ avalId: aval._id }).lean()
      : [];
    const mensajesByNumero = new Map(docs.map(d => [d.numero, d.mensajes]));

    return {
      viewerRol: viewer?.rol ?? null,
      reclamos: onchain.map(r => ({
        ...r,
        mensajes: (mensajesByNumero.get(r.numero) ?? []).map(m => ({
          id: String((m as { _id?: Types.ObjectId })._id),
          autorAddress: m.autorAddress,
          autorRol: m.autorRol,
          texto: m.texto,
          fecha: new Date(m.fecha).toISOString(),
        })),
      })),
    };
  }

  /**
   * Agrega un mensaje a un reclamo vigente. Lo usa el comerciante para dejar el
   * motivo justo después de abrir el reclamo onchain, y cualquier participante
   * para continuar la conversación.
   */
  async addMensaje(avalId: string, numero: number, texto: string): Promise<void> {
    const contenido = texto?.trim() ?? "";
    if (!contenido) throw new Error("El mensaje no puede estar vacío.");
    if (contenido.length > MENSAJE_MAX_LENGTH) {
      throw new Error(`El mensaje no puede superar los ${MENSAJE_MAX_LENGTH} caracteres.`);
    }
    if (!Number.isInteger(numero) || numero < 1) throw new Error("Número de reclamo inválido.");

    const aval = await AvalModel.findById(avalId).lean();
    if (!aval) throw new Error("Aval not found");

    const viewer = await this._getViewerRol(aval);
    if (!viewer) throw new NotAuthorizedError("Solo los participantes del aval pueden escribir en sus reclamos.");

    const avalContract = await this._getAvalContract(aval);
    const reclamo = await this._readOnchainReclamoWithRetry(avalContract, numero);
    if (!reclamo) throw new Error(`El reclamo #${numero} no existe onchain.`);
    if (reclamo.status !== ReclamoStatus.Vigente) throw new Error("El reclamo está cerrado.");

    await ReclamoModel.updateOne(
      { avalId: aval._id, numero },
      {
        $set: { status: reclamo.status, syncOnChain: new Date() },
        $setOnInsert: {
          chainId: aval.chainId,
          avalAddress: await avalContract.getAddress(),
          fechaApertura: new Date(reclamo.timestampCreacion * 1000),
        },
        $push: {
          mensajes: {
            autorAddress: viewer.address,
            autorRol: viewer.rol,
            texto: contenido,
            fecha: new Date(),
          },
        },
      },
      { upsert: true }
    );
  }

  /** El motivo se envía apenas se confirma `openReclamo`; el nodo RPC del
   *  servidor puede todavía no ver ese bloque, así que se reintenta. */
  private async _readOnchainReclamoWithRetry(avalContract: Contract, numero: number): Promise<OnchainReclamo | null> {
    for (let attempt = 0; attempt < 4; attempt++) {
      const reclamos = await this._readOnchainReclamos(avalContract);
      const reclamo = reclamos.find(r => r.numero === numero);
      if (reclamo) return reclamo;
      await new Promise(r => setTimeout(r, 2000));
    }
    return null;
  }
}
