import { handleError } from "@/app/api/response-handler";
import { NotAuthenticatedError } from "@/errors";
import { authOptions } from "@/lib/auth";
import { onSignature } from "@/lib/aval-events";

import { getServerSession } from "next-auth";

export const dynamic = "force-dynamic";

// Comentario SSE periódico para que proxies (nginx) no corten la conexión por inactividad.
const HEARTBEAT_MS = 25_000;

/** Stream SSE con un evento `signature` cada vez que un participante registra su firma. */
export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const avalId = (await context.params).id;
    const session = await getServerSession(authOptions);
    if (!session || !session.user.id) throw new NotAuthenticatedError();

    const encoder = new TextEncoder();
    let cleanup = () => {};

    const stream = new ReadableStream({
      start(controller) {
        let closed = false;
        const send = (chunk: string) => {
          if (!closed) controller.enqueue(encoder.encode(chunk));
        };

        const unsubscribe = onSignature(avalId, (role) => {
          send(`event: signature\ndata: ${JSON.stringify({ role })}\n\n`);
        });
        const heartbeat = setInterval(() => send(": ping\n\n"), HEARTBEAT_MS);

        cleanup = () => {
          if (closed) return;
          closed = true;
          clearInterval(heartbeat);
          unsubscribe();
        };

        request.signal.addEventListener("abort", () => {
          cleanup();
          try {
            controller.close();
          } catch {
            // Ya cerrado por el cliente.
          }
        });
      },
      cancel() {
        cleanup();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        // nginx bufferea las respuestas por defecto; SSE necesita que pasen al instante.
        "X-Accel-Buffering": "no",
      },
    });
  } catch (err) {
    return handleError(err);
  }
}
