
import { handleError, OkResponse } from "@/app/api/response-handler";
import { NotAuthenticatedError } from "@/errors";
import { authOptions } from "@/lib/auth";

import UserService from "@/services/users-service";
import { getServerSession } from "next-auth";

const usersService = new UserService();

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.id) throw new NotAuthenticatedError();

    const body = await request.json();

    const result = await usersService.registerProfile({
      ...body,
      address: session.user.address
    });

    return OkResponse(result);

  } catch (err) {
    console.error(err);
    return handleError(err);
  }
}