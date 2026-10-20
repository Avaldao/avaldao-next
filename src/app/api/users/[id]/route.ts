import { OkResponse, handleError } from "@/app/api/response-handler";
import UsersService from "@/services/users-service";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    // La autorización (users:delete) la resuelve el servicio.
    return OkResponse(await new UsersService().deleteUser(id));
  } catch (err) {
    return handleError(err);
  }
}
