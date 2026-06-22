import UsersService from "@/services/users-service";
import { handleError, OkResponse } from "../../response-handler";

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || typeof token !== "string") {
      return new Response(JSON.stringify({ message: "Token is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!password || typeof password !== "string") {
      return new Response(JSON.stringify({ message: "Password is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const usersService = new UsersService();
    const result = await usersService.resetPassword(token, password);

    return OkResponse(result);
  } catch (err) {
    if (err instanceof Error && err.message === "invalid_token") {
      return new Response(JSON.stringify({ error: "invalid_token" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    return handleError(err);
  }
}
