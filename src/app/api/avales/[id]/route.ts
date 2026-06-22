import { handleError, OkResponse } from "@/app/api/response-handler";
import AvalesService from "@/services/avales-service";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (body.action === "reject") {
      await new AvalesService().rejectAval(id, body.reason ?? "");
      return OkResponse({ success: true });
    }

    return new Response(JSON.stringify({ message: "Unknown action" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return handleError(err);
  }
}
