import UsersService from "@/services/users-service";
import { OkResponse } from "../response-handler";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
      return new Response(JSON.stringify({ error: 'Address parameter is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validar que sea una dirección Ethereum válida
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return new Response(JSON.stringify({ error: 'Invalid Ethereum address' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }


    const user = await (new UsersService()).getUserByAddress(address);

    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return OkResponse(user); 

  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}