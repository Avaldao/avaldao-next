import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { OkResponse, handleError } from "@/app/api/response-handler";
import UsersService from "@/services/users-service";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ message: "Not authenticated" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { message, signature } = await request.json();
    if (!message || !signature) {
      return new Response(JSON.stringify({ message: "message and signature are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const address = await new UsersService().linkWallet(session.user.id, message, signature);
    return OkResponse({ address });
  } catch (err) {
    return handleError(err);
  }
}
