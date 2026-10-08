import { OkResponse, handleError } from "@/app/api/response-handler";

// RBTC está anclado 1:1 a BTC, así que se usa el precio de BTC.
const PRICE_URL = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd";
// La API pública de CoinGecko tiene límite de requests: se cachea en el servidor.
const REVALIDATE_SECONDS = 300;

/** Precio de RBTC en USD, para mostrar en USD el costo de las transacciones. */
export async function GET() {
  try {
    const res = await fetch(PRICE_URL, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!res.ok) throw new Error(`CoinGecko respondió ${res.status}`);
    const data = await res.json();
    const usd = Number(data?.bitcoin?.usd);
    if (!Number.isFinite(usd) || usd <= 0) throw new Error("Precio de BTC inválido");
    return OkResponse({ usd });
  } catch (err) {
    return handleError(err);
  }
}
