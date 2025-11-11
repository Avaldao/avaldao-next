import { handleError, OkResponse } from "@/app/api/response-handler";
import { NotAuthenticatedError, NotAuthorizedError } from "@/errors";
import { authOptions } from "@/lib/auth";
import AvalesService from "@/services/avales-service";
import { AvalRequest } from "@/types";
import { getServerSession } from "next-auth";

const avalesService = new AvalesService();

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.id) throw new NotAuthenticatedError();
    if (!session.user.roles.includes("SOLICITANTE_ROLE")) throw new NotAuthorizedError();

    const avalData: AvalRequest = await request.json();

    avalData.solicitanteAddress = session.user.address; //Overwrite
    avalData.avaldaoAddress = process.env.USER_AVALDAO_ADDRESS!; //Overwrite

    const result = await avalesService.saveAval(avalData);

    return OkResponse(result);

  } catch (err) {
    console.error(err);
    return handleError(err);
  }
}