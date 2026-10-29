import { handleError, OkResponse } from "@/app/api/response-handler";
import { defaultAvaldaoAddress, getAvalChainIds } from "@/blockchain/contracts";
import { MissingRoleError, NotAuthenticatedError, NotAuthorizedError } from "@/errors";
import { authOptions } from "@/lib/auth";
import { requirePermission } from "@/lib/auth/authorization";
import AvalesService from "@/services/avales-service";
import UsersService from "@/services/users-service";
import { AvalRequest } from "@/types";
import { getAddress } from "ethers";
import { getServerSession } from "next-auth";

const avalesService = new AvalesService();

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.id) throw new NotAuthenticatedError();
    await requirePermission("avales:create");
    
    //if (!session.user.roles.includes("SOLICITANTE_ROLE")) throw new MissingRoleError("SOLICITANTE_ROLE");

    const { walletProof, ...avalData }: AvalRequest & { walletProof?: { message: string; signature: string } } = await request.json();

    if (!getAvalChainIds().includes(Number(avalData.chainId))) {
      throw new Error(`Unsupported chainId: ${avalData.chainId}`);
    }

    const avaldaoUserAddress = getAddress(defaultAvaldaoAddress[Number(avalData.chainId)].toLowerCase())

    // Si el usuario todavía no tiene wallet, la firma del challenge demuestra que controla la
    // address y se vincula a su cuenta antes de crear el aval.
    let solicitanteAddress = session.user.address;
    if (!solicitanteAddress) {
      if (!walletProof?.message || !walletProof?.signature) {
        throw new Error("You must link a wallet to your account before creating a guarantee");
      }
      solicitanteAddress = await new UsersService().linkWallet(session.user.id, walletProof.message, walletProof.signature);
    }

    avalData.solicitanteAddress = solicitanteAddress; //Overwrite
    avalData.avaldaoAddress = avaldaoUserAddress; //Overwrite

    const result = await avalesService.saveAval(avalData);

    return OkResponse(result);

  } catch (err) {
    console.error(err);
    return handleError(err);
  }
}