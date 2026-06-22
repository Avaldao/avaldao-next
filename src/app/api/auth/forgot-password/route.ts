import UsersService from "@/services/users-service";
import { handleError, OkResponse } from "../../response-handler";

export async function POST(request: Request) {
  try {
    const { email, language } = await request.json();

    if (!email || typeof email !== "string") {
      return new Response(JSON.stringify({ message: "Email is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const usersService = new UsersService();
    const result = await usersService.forgotPassword(email, language ?? "es");

    if (result.reason === "admin") {
      return new Response(JSON.stringify({ error: "cannot_process" }), {
        status: 422,
        headers: { "Content-Type": "application/json" },
      });
    }

    return OkResponse({ success: true });
  } catch (err) {
    return handleError(err);
  }
}
