import { format } from "date-fns";
import { DEFAULT_DESBLOQUEO_SECONDS, generateTranches } from "@/app/entities/aval.entity";

interface CuotasPreviewProps {
  fechaInicio: Date | string | undefined;
  duracionCuotaDias: number | string;
  cuotasCantidad: number | string;
  montoFiat: number | string;
  t: (key: string) => string;
}

const MAX_CUOTAS = 120;
const MIN_CLAIM_FRACTION = 0.25;
const MAX_CLAIM_FRACTION = 0.55;

// Vista previa del plan de cuotas con la misma lógica que se usa al crear el aval (generateTranches).
export default function CuotasPreview({ fechaInicio, duracionCuotaDias, cuotasCantidad, montoFiat, t }: CuotasPreviewProps) {
  const cantidad = Number(cuotasCantidad);
  const dias = Number(duracionCuotaDias);
  const monto = Number(montoFiat);
  const inicio = fechaInicio ? new Date(fechaInicio) : undefined;

  if (!inicio || isNaN(inicio.getTime())) return null;
  if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > MAX_CUOTAS) return null;
  if (!(dias > 0) || !(monto >= 0)) return null;

  const tranches = generateTranches(inicio, dias * 86400, DEFAULT_DESBLOQUEO_SECONDS, cantidad);
  // Proporción del tramo "ventana de reclamo" sobre la vida de la cuota. Se acota para que las etiquetas no se pisen.
  const claimFraction = Math.min(
    MAX_CLAIM_FRACTION,
    Math.max(MIN_CLAIM_FRACTION, DEFAULT_DESBLOQUEO_SECONDS / (dias * 86400 + DEFAULT_DESBLOQUEO_SECONDS))
  );
  const columns = { gridTemplateColumns: `${1 - claimFraction}fr ${claimFraction}fr` };
  const montoCuota = (monto / cantidad).toFixed(2);
  const fmt = (seconds: number) => format(new Date(seconds * 1000), "dd/MM/yyyy");

  return (
    <fieldset className="rounded-xl border border-slate-200 px-3 sm:px-4 pb-4 pt-2">
      <legend className="px-2 text-sm font-semibold text-slate-800">{t("aval.form.schedule")}</legend>

      {/* Altura máxima = 3 filas completas (144px por fila en mobile, 112px desde sm), con snap para no cortar ninguna. */}
      <ul className="divide-y divide-slate-100 text-sm max-h-108 sm:max-h-84 overflow-y-auto overscroll-contain snap-y snap-mandatory [scrollbar-gutter:stable] [scrollbar-width:thin]">
        {tranches.map((tr) => (
          <li key={tr.index} className="flex h-36 sm:h-28 snap-start flex-col justify-center">
            <div className="flex items-baseline justify-between">
              <span className="font-semibold text-slate-800">{t("aval.details.tranche")} {tr.index}</span>
              <span className="font-mono text-slate-800">$ {montoCuota}</span>
            </div>

            {/* Línea de tiempo de la cuota: fondos reservados → vencimiento → desbloqueo. Los tramos son proporcionales a la duración de la cuota y a la ventana de desbloqueo. */}
            <div className="relative mt-3">
              <div className="grid grid-cols-2">
                <div className="h-1.5" />
                <span className="pb-1 text-center text-[10px] font-semibold uppercase tracking-wider text-amber-600">
                  {t("how.cuota.claim-window")}
                </span>
              </div>
              {/* Barra: el ancho de cada tramo es proporcional (ver claimFraction) */}
              <div className="grid" style={columns}>
                <div className="h-1.5 rounded-l-full bg-violet-300/70" />
                <div className="h-1.5 rounded-r-full bg-amber-300" />
              </div>
              {/* Puntos sobre la barra, en el inicio, en el vencimiento y en el desbloqueo */}
              <div className="relative -mt-2.5 h-3.5">
                <span className="absolute left-0 h-3.5 w-3.5 rounded-full border-[3px] border-white bg-violet-400" />
                <span
                  className="absolute h-3.5 w-3.5 -translate-x-1/2 rounded-full border-[3px] border-white bg-amber-400"
                  style={{ left: `${(1 - claimFraction) * 100}%` }}
                />
                <span className="absolute right-0 h-3.5 w-3.5 rounded-full border-[3px] border-white bg-emerald-400" />
              </div>
              <div className="mt-1.5 grid grid-cols-3">
                <Milestone align="start" label={t("how.cuota.reserved")} detail={fmt(tr.startDateSeconds)} mono />
                <Milestone align="center" label={t("aval.details.maturity-date")} detail={fmt(tr.maturityDateSeconds)} mono />
                <Milestone align="end" label={t("aval.details.unlock-date")} detail={fmt(tr.unlockDateSeconds)} mono />
              </div>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-2 text-xs text-slate-500">
        {t("aval.form.schedule.note").replace("{days}", String(DEFAULT_DESBLOQUEO_SECONDS / 86400))}
      </p>
    </fieldset>
  );
}

const ALIGN = {
  start: "items-start text-left",
  center: "items-center text-center",
  end: "items-end text-right",
} as const;

function Milestone({ align, label, detail, mono = false }: { align: keyof typeof ALIGN; label: string; detail: string; mono?: boolean }) {
  return (
    <div className={`flex flex-col ${ALIGN[align]}`}>
      <p className="text-xs font-medium leading-4 text-slate-700 sm:text-sm sm:leading-5">{label}</p>
      <p className={`text-xs text-slate-500 ${mono ? "font-mono" : ""}`}>{detail}</p>
    </div>
  );
}
