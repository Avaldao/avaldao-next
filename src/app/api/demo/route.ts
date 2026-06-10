import UsersService from "@/services/users-service";
import { OkResponse } from "../response-handler";

export async function GET(request: Request) {
  try {
    const usersService = new UsersService();
   /*   await usersService.sendActivationEmail("jonatanduttweiler@gmail.com","en");
      await usersService.sendActivationEmail("jonatanduttweiler@gmail.com","es"); */

    
    return OkResponse({});

  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}