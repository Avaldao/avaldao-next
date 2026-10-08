import { handleError, OkResponse } from "@/app/api/response-handler";
import ReclamosService from "@/services/reclamos-service";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await new ReclamosService().getReclamos(id);
    return OkResponse(result);
  } catch (err) {
    return handleError(err);
  }
}
