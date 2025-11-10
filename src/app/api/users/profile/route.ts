
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

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const website = formData.get("website") as string;
    const avatar = formData.get("avatar") as File;

    const result = await usersService.updateProfile({
      id: session.user.id,
      address: session.user.address,
      name,
      email,
      website,
      avatar
    });

    return OkResponse(result);

  } catch (err) {
    console.error(err);
    return handleError(err);
  }
}