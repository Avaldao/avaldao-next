
import { handleError, OkResponse } from "@/app/api/response-handler";
import UserService from "@/services/users-service";
import { NextResponse } from "next/server";


const usersService = new UserService();

async function verifyRecaptcha(token: string): Promise<boolean> {
  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret: process.env.RECAPTCHA_SECRET_KEY!,
      response: token,
    }),
  });
  const data = await res.json();
  return data.success && data.score >= 0.5;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { recaptchaToken, ...payload } = body;

    if (process.env.NEXT_PUBLIC_SKIP_RECAPTCHA !== "true") {
      if (!recaptchaToken) {
        return NextResponse.json({ message: "Recaptcha requerido" }, { status: 400 });
      }

      const valid = await verifyRecaptcha(recaptchaToken);
      if (!valid) {
        return NextResponse.json({ message: "Verificación de seguridad fallida" }, { status: 400 });
      }
    }

    const result = await usersService.signup(payload);
    return OkResponse(result);

  } catch (err) {
    console.error(err);
    return handleError(err);
  }
}
