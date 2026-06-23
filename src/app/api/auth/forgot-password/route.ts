import UsersService from "@/services/users-service";
import { handleError, OkResponse } from "../../response-handler";
import { getIP, rateLimit, TOO_MANY } from "@/lib/rate-limit";

export async function POST(request: Request) {
  if (!rateLimit(`forgot-pwd:${getIP(request)}`, 5, 60 * 60 * 1000)) {
    return TOO_MANY;
  }

  try {
    const { email, language } = await request.json();

    if (email && typeof email === "string") {
      if (!rateLimit(`forgot-pwd-email:${email.toLowerCase()}`, 3, 60 * 60 * 1000)) {
        return TOO_MANY;
      }
    }

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
