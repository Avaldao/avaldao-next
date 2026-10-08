import { OkResponse, handleError } from "@/app/api/response-handler";
import UsersService, { VerificationAction } from "@/services/users-service";

const ACTIONS: VerificationAction[] = ["verify", "reject", "suspend"];

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { action, note } = await request.json();

    if (!ACTIONS.includes(action)) {
      return new Response(JSON.stringify({ message: "Invalid action" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // La autorización (ADMIN_ROLE) la resuelve el servicio.
    const result = await new UsersService().setVerification(id, action, typeof note === "string" ? note : undefined);
    return OkResponse(result);
  } catch (err) {
    return handleError(err);
  }
}
