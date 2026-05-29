
import { handleError, OkResponse } from "@/app/api/response-handler";
import { NotAuthenticatedError } from "@/errors";
import { authOptions } from "@/lib/auth";

import UserService from "@/services/users-service";
import { getServerSession } from "next-auth";

const usersService = new UserService();

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = await usersService.signup(body);
    return OkResponse(result);

  } catch (err) {
    console.error(err);
    return handleError(err);
  }
}