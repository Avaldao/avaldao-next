import { OkResponse, handleError } from "@/app/api/response-handler";
import UsersService from "@/services/users-service";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { roles } = await request.json();
    // La autorización (users:roles) la resuelve el servicio.
    return OkResponse(await new UsersService().setStaffRoles(id, roles));
  } catch (err) {
    return handleError(err);
  }
}
