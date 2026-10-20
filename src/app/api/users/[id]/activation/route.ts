import { OkResponse, handleError } from "@/app/api/response-handler";
import UsersService from "@/services/users-service";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    // La autorización (ADMIN_ROLE) la resuelve el servicio.
    return OkResponse(await new UsersService().resendActivation(id));
  } catch (err) {
    return handleError(err);
  }
}
