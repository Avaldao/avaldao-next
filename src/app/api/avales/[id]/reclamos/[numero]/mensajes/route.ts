import { handleError, OkResponse } from "@/app/api/response-handler";
import ReclamosService from "@/services/reclamos-service";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; numero: string }> }
) {
  try {
    const { id, numero } = await params;
    const { texto } = await request.json();

    await new ReclamosService().addMensaje(id, Number(numero), texto);
    return OkResponse({ success: true }, 201);
  } catch (err) {
    return handleError(err);
  }
}
