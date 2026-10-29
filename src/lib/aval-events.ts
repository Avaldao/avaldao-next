import 'server-only';
import { EventEmitter } from "events";
import type { AvalRoleEnum } from "@/services/avales-service";

// Emisor en memoria para avisar en vivo a quienes miran un aval. Vive en globalThis
// porque cada route handler se empaqueta por separado (y en dev el HMR recrea los
// módulos): sin eso, el POST de firmas y el stream SSE verían emisores distintos.
// Solo funciona con una única instancia del servidor (pm2 en modo fork); con varias
// habría que pasar a un pub/sub compartido (Redis, change streams de MongoDB).
const globalWithEvents = globalThis as typeof globalThis & { _avalEvents?: EventEmitter };

const avalEvents = (globalWithEvents._avalEvents ??= new EventEmitter().setMaxListeners(0));

const signatureEvent = (avalId: string) => `signature:${avalId}`;

export function emitSignature(avalId: string, role: AvalRoleEnum) {
  avalEvents.emit(signatureEvent(avalId), role);
}

/** Devuelve la función para desuscribirse. */
export function onSignature(avalId: string, listener: (role: AvalRoleEnum) => void) {
  avalEvents.on(signatureEvent(avalId), listener);
  return () => {
    avalEvents.off(signatureEvent(avalId), listener);
  };
}
