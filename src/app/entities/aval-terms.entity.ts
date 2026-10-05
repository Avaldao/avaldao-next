import { Language } from "@/translations";
import { generateTranches } from "./aval.entity";

/**
 * Versión de la plantilla de términos y condiciones.
 *
 * Cambiarla implica que el texto generado para un mismo aval va a ser distinto,
 * y por lo tanto el JSON pineado en IPFS va a tener otro CID. No modificar sin
 * entender que los avales ya firmados quedan atados a la versión con la que se
 * generaron (que queda guardada junto al texto).
 */
export const TERMINOS_VERSION = "1.0.0";

/** Idiomas en los que se genera el texto. Se pinean todos, para que el CID no
 *  dependa del idioma del navegador de quien creó el aval. */
export const TERMINOS_IDIOMAS: Language[] = ["es", "en"];

/** Datos del aval que alimentan la plantilla. */
export interface AvalTermsInput {
  proyecto: string;
  objetivo: string;
  adquisicion: string;
  beneficiarios: string;
  /** Monto total en centavos de USD, tal como se guarda en Mongo. */
  montoFiat: number;
  cuotasCantidad: number;
  fechaInicio: Date | string;
  duracionCuotaSeconds: number;
  desbloqueoSeconds: number;
}

export interface AvalTerminos {
  version: string;
  textos: Record<Language, string>;
}

// ── Formatters deterministas ────────────────────────────────────────────────
// No usamos Intl: su salida depende de la versión de ICU del runtime y rompería
// la reproducibilidad del texto (mismo aval + misma versión = mismo texto).

function formatUsd(centavos: number): string {
  const negative = centavos < 0;
  const abs = Math.abs(Math.round(centavos));
  const units = Math.floor(abs / 100).toString();
  const cents = (abs % 100).toString().padStart(2, "0");
  const grouped = units.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${negative ? "-" : ""}USD ${grouped}.${cents}`;
}

function formatTimestamp(seconds: number): string {
  const iso = new Date(seconds * 1000).toISOString();
  return `${iso.slice(0, 10)} ${iso.slice(11, 16)} UTC`;
}

function formatDuration(seconds: number, idioma: Language): string {
  const dias = seconds / 86400;
  const label = Number.isInteger(dias) ? `${dias}` : dias.toFixed(2);
  const unidad = idioma === "es" ? (dias === 1 ? "día" : "días") : dias === 1 ? "day" : "days";
  return `${label} ${unidad} (${seconds} s)`;
}

function toDate(value: Date | string): Date {
  return value instanceof Date ? value : new Date(value);
}

interface CuotaLinea {
  numero: number;
  montoCentavos: number;
  vencimiento: number;
  desbloqueo: number;
}

function buildCronograma(aval: AvalTermsInput): {
  cuotas: CuotaLinea[];
  montoCuota: number;
  remanente: number;
} {
  const total = Math.round(aval.montoFiat);
  const cantidad = aval.cuotasCantidad;

  // Avaldao.sol: `montoFiatCuota = _montoFiat.div(cuotasCantidad)`. Es división
  // entera y todas las cuotas se crean por el mismo monto; el resto no se
  // reparte entre ellas: queda bloqueado en el contrato del aval sin pertenecer
  // a ninguna cuota.
  const montoCuota = Math.floor(total / cantidad);
  const remanente = total - montoCuota * cantidad;

  const tranches = generateTranches(
    toDate(aval.fechaInicio),
    aval.duracionCuotaSeconds,
    aval.desbloqueoSeconds,
    cantidad
  );

  const cuotas = tranches.map(t => ({
    numero: t.index,
    montoCentavos: montoCuota,
    vencimiento: t.maturityDateSeconds,
    desbloqueo: t.unlockDateSeconds,
  }));

  return { cuotas, montoCuota, remanente };
}

// ── Plantillas ──────────────────────────────────────────────────────────────

function renderEs(aval: AvalTermsInput): string {
  const { cuotas, montoCuota, remanente } = buildCronograma(aval);

  return [
    `TÉRMINOS Y CONDICIONES DEL AVAL`,
    `Plantilla versión ${TERMINOS_VERSION}`,
    ``,
    `1. OBJETO`,
    `El Avalado adquiere del Comerciante "${aval.adquisicion}" y se compromete a pagar el`,
    `precio en ${aval.cuotasCantidad} cuotas. AvalDAO otorga una garantía sobre esa operación: el fondo de`,
    `garantía respalda el pago de las cuotas ante un incumplimiento del Avalado.`,
    ``,
    `Proyecto: ${aval.proyecto}`,
    `Objetivo: ${aval.objetivo}`,
    `Beneficiarios: ${aval.beneficiarios}`,
    ``,
    `2. TÉRMINOS ECONÓMICOS`,
    `Monto total garantizado: ${formatUsd(aval.montoFiat)}`,
    `Cantidad de cuotas: ${aval.cuotasCantidad}`,
    `Monto por cuota: ${formatUsd(montoCuota)} (el mismo para todas las cuotas)`,
    ...(remanente > 0
      ? [
          `Remanente no asignado a ninguna cuota: ${formatUsd(remanente)}. El contrato divide el monto`,
          `total en partes enteras iguales; ese remanente queda bloqueado en el contrato del aval y`,
          `no se transfiere junto con ninguna cuota.`,
        ]
      : []),
    `Fecha de inicio: ${formatTimestamp(Math.floor(toDate(aval.fechaInicio).getTime() / 1000))}`,
    `Duración de cada cuota: ${formatDuration(aval.duracionCuotaSeconds, "es")}`,
    `Ventana de desbloqueo: ${formatDuration(aval.desbloqueoSeconds, "es")} contados desde el`,
    `vencimiento de cada cuota.`,
    ``,
    `3. CRONOGRAMA DE CUOTAS`,
    ...cuotas.map(
      c =>
        `Cuota ${c.numero}: ${formatUsd(c.montoCentavos)} · vence ${formatTimestamp(c.vencimiento)} · ` +
        `se desbloquea ${formatTimestamp(c.desbloqueo)}`
    ),
    ``,
    `4. FACULTADES DE LAS PARTES`,
    `Avalado: recibe la garantía y se obliga a pagar cada cuota al Comerciante antes de su`,
    `  fecha de vencimiento.`,
    `Comerciante: si una cuota vencida sigue impaga, puede abrir un reclamo a partir de la`,
    `  fecha de vencimiento de esa cuota. Solo puede haber un reclamo abierto a la vez.`,
    `Solicitante: con un reclamo abierto puede ejecutar la garantía. La ejecución alcanza a`,
    `  TODAS las cuotas pendientes que ya estén vencidas, no solo a la reclamada: sus montos se`,
    `  transfieren del contrato del aval al Comerciante y el reclamo queda cerrado.`,
    `  Además puede desbloquear una cuota en cualquier momento, sin esperar su fecha de`,
    `  desbloqueo y aun con un reclamo abierto: la cuota se da por pagada y su monto vuelve al`,
    `  fondo de garantía.`,
    `Avaldao: representa a la plataforma. Acepta el aval y lo registra onchain, envía las cuatro`,
    `  firmas al contrato y puede desbloquear cuotas ya cumplidas, siempre que haya pasado su`,
    `  fecha de desbloqueo y no haya ningún reclamo abierto.`,
    ``,
    `El aval pasa a estado Vigente al registrarse las cuatro firmas, y solo si el fondo de`,
    `garantía tiene saldo suficiente para cubrir el monto total, que queda bloqueado en el`,
    `contrato del aval.`,
    `El desbloqueo no es automático: pasada la fecha de desbloqueo de una cuota, alguien tiene`,
    `que ejecutarlo. Cada desbloqueo alcanza a una sola cuota. Cuando no quedan cuotas`,
    `pendientes, el aval queda Finalizado.`,
    ``,
    `5. ALCANCE`,
    `Este texto forma parte del JSON publicado en IPFS. El identificador de ese JSON (infoCid)`,
    `es uno de los campos del mensaje EIP-712 que firman las cuatro partes, de modo que la`,
    `firma compromete estos términos aunque la wallet muestre solamente un hash.`,
    `Cualquier modificación de los datos del aval produce un CID distinto e invalida las`,
    `firmas ya registradas.`,
  ].join("\n");
}

function renderEn(aval: AvalTermsInput): string {
  const { cuotas, montoCuota, remanente } = buildCronograma(aval);

  return [
    `AVAL TERMS AND CONDITIONS`,
    `Template version ${TERMINOS_VERSION}`,
    ``,
    `1. PURPOSE`,
    `The Avalado buys "${aval.adquisicion}" from the Comerciante and undertakes to pay the`,
    `price in ${aval.cuotasCantidad} installments. AvalDAO guarantees that transaction: the guarantee fund`,
    `backs the installment payments should the Avalado default.`,
    ``,
    `Project: ${aval.proyecto}`,
    `Goal: ${aval.objetivo}`,
    `Beneficiaries: ${aval.beneficiarios}`,
    ``,
    `2. ECONOMIC TERMS`,
    `Total guaranteed amount: ${formatUsd(aval.montoFiat)}`,
    `Number of installments: ${aval.cuotasCantidad}`,
    `Amount per installment: ${formatUsd(montoCuota)} (the same for every installment)`,
    ...(remanente > 0
      ? [
          `Remainder not assigned to any installment: ${formatUsd(remanente)}. The contract splits the`,
          `total into equal whole parts; that remainder stays locked in the aval contract and is not`,
          `transferred along with any installment.`,
        ]
      : []),
    `Start date: ${formatTimestamp(Math.floor(toDate(aval.fechaInicio).getTime() / 1000))}`,
    `Length of each installment: ${formatDuration(aval.duracionCuotaSeconds, "en")}`,
    `Unlock window: ${formatDuration(aval.desbloqueoSeconds, "en")} from each installment's due date.`,
    ``,
    `3. INSTALLMENT SCHEDULE`,
    ...cuotas.map(
      c =>
        `Installment ${c.numero}: ${formatUsd(c.montoCentavos)} · due ${formatTimestamp(c.vencimiento)} · ` +
        `unlocks ${formatTimestamp(c.desbloqueo)}`
    ),
    ``,
    `4. RIGHTS OF THE PARTIES`,
    `Avalado: receives the guarantee and undertakes to pay each installment to the Comerciante`,
    `  before its due date.`,
    `Comerciante: if a due installment remains unpaid, may open a claim from that installment's`,
    `  due date. Only one claim can be open at a time.`,
    `Solicitante: with an open claim, may execute the guarantee. Execution reaches ALL pending`,
    `  installments that are already due, not just the claimed one: their amounts are transferred`,
    `  from the aval contract to the Comerciante and the claim is closed.`,
    `  May also unlock an installment at any time, without waiting for its unlock date and even`,
    `  with an open claim: the installment is treated as paid and its amount returns to the`,
    `  guarantee fund.`,
    `Avaldao: represents the platform. Accepts the aval and registers it onchain, submits the four`,
    `  signatures to the contract, and may unlock fulfilled installments, provided their unlock`,
    `  date has passed and no claim is open.`,
    ``,
    `The aval becomes Vigente once the four signatures are registered, and only if the guarantee`,
    `fund holds enough balance to cover the total amount, which is then locked in the aval`,
    `contract.`,
    `Unlocking is not automatic: after an installment's unlock date, someone has to execute it.`,
    `Each unlock reaches a single installment. When no installments remain pending, the aval is`,
    `Finalizado.`,
    ``,
    `5. SCOPE`,
    `This text is part of the JSON published on IPFS. That JSON's identifier (infoCid) is one of`,
    `the fields of the EIP-712 message signed by the four parties, so the signature commits these`,
    `terms even though the wallet only displays a hash.`,
    `Any change to the aval data produces a different CID and invalidates the signatures already`,
    `registered.`,
  ].join("\n");
}

const RENDERERS: Record<Language, (aval: AvalTermsInput) => string> = {
  es: renderEs,
  en: renderEn,
};

/** Genera el texto de términos en un idioma. Determinista: mismo aval + misma
 *  versión de plantilla ⇒ mismo texto. */
export function generateTerminosTexto(aval: AvalTermsInput, idioma: Language): string {
  return RENDERERS[idioma](aval);
}

/** Genera los términos en todos los idiomas soportados, listos para persistir
 *  y pinear junto al resto del aval. */
export function generateTerminos(aval: AvalTermsInput): AvalTerminos {
  const textos = {} as Record<Language, string>;
  for (const idioma of TERMINOS_IDIOMAS) {
    textos[idioma] = generateTerminosTexto(aval, idioma);
  }
  return { version: TERMINOS_VERSION, textos };
}
