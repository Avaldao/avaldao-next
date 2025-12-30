import { handleError, OkResponse } from "@/app/api/response-handler";
import { NotAuthenticatedError, NotAuthorizedError } from "@/errors";
import { authOptions } from "@/lib/auth";
import AvalesService, { AvalRoleEnum } from "@/services/avales-service";

import { getServerSession } from "next-auth";

const avalesService = new AvalesService();


interface SignatureRequest {
  signature: string;
  data: string;
  role?: string;
}


export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const avalId = (await context.params).id;
    const session = await getServerSession(authOptions);
    if (!session || !session.user.id) throw new NotAuthenticatedError();

    const { signature, data, role }: SignatureRequest = await request.json();

    const result = await avalesService.registerSignature(
      avalId,
      signature,
      data,
      role as AvalRoleEnum | undefined,
    );

   
    return OkResponse(result);

  } catch (err) {
    console.error(err);
    return handleError(err);
  }
}