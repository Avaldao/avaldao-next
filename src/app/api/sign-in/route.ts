import UsersService from "@/services/users-service";
import { verifyMessage } from "ethers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, signature } = body;
    console.log("Received body:", body); //In this point you should have message and signature


    //how can get the signer from signature
    const address = verifyMessage(message, signature);
    console.log("address:"+ address )

    //get user by address and return JWT
    const user = await new UsersService().getUserByAddress(address);

    return new Response(JSON.stringify({ message: "Login successful", user }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
