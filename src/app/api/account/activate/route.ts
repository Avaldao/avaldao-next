import UsersService from "@/services/users-service";
import { handleError, OkResponse } from "../../response-handler";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const userService = new UsersService();
    const response = await userService.activateAccount(data);

    return OkResponse(response);
  } catch (err) {
    console.log(err);
    return handleError(err);
  }


}