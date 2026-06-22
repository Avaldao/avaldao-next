import { NextResponse } from "next/server";

export async function POST(request: Request) {
  if (process.env.NEXT_PUBLIC_SKIP_RECAPTCHA === "true") {
    return NextResponse.json({ success: true });
  }

  const { token } = await request.json();

  if (!token) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret: process.env.RECAPTCHA_SECRET_KEY!,
      response: token,
    }),
  });

  const data = await res.json();

  if (!data.success || data.score < 0.5) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
