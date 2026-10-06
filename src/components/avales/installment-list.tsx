import { ReactNode } from "react";
import { format } from "date-fns";

export interface InstallmentItem {
  key: string | number;
  label: string;
  amount: string;
  /** Inicio del período de la cuota, vencimiento y desbloqueo, en segundos. */
  startSeconds: number;
  maturitySeconds: number;
  unlockSeconds: number;
  status?: ReactNode;
}

interface InstallmentListProps {
  items: InstallmentItem[];
  t: (key: string) => string;
}

// Proporción mínima/máxima de la ventana de reclamo en la barra, para que las etiquetas no se pisen.
const MIN_CLAIM_FRACTION = 0.25;
const MAX_CLAIM_FRACTION = 0.55;

const ALIGN = {
  start: "items-start text-left",
  center: "items-center text-center",
  end: "items-end text-right",
} as const;

const fmt = (seconds: number) => format(new Date(seconds * 1000), "dd/MM/yyyy");

// Lista de cuotas con una línea de tiempo por cuota (fondos reservados → vencimiento → desbloqueo).
// Muestra 3 filas completas a la vez (144px por fila en mobile, 112px desde sm) y hace scroll con snap, así no se corta ninguna.
export default function InstallmentList({ items, t }: InstallmentListProps) {
  return (
    <ul className="divide-y divide-slate-100 text-sm max-h-108 sm:max-h-84 overflow-y-auto overscroll-contain snap-y snap-mandatory [scrollbar-gutter:stable] [scrollbar-width:thin]">
      {items.map((item) => {
        const total = item.unlockSeconds - item.startSeconds;
        const claim = total > 0 ? (item.unlockSeconds - item.maturitySeconds) / total : 0.5;
        const claimFraction = Math.min(MAX_CLAIM_FRACTION, Math.max(MIN_CLAIM_FRACTION, claim));
        const columns = { gridTemplateColumns: `${1 - claimFraction}fr ${claimFraction}fr` };

        return (
          <li key={item.key} className="flex h-36 sm:h-28 snap-start flex-col justify-center">
            <div className="flex items-baseline justify-between gap-3">
              <span className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-0.5">
                <span className="font-semibold text-slate-800">{item.label}</span>
                {item.status}
              </span>
              <span className="font-mono text-slate-800 shrink-0">{item.amount}</span>
            </div>

            <div className="relative mt-3">
              <div className="grid grid-cols-2">
                <div className="h-1.5" />
                <span className="pb-1 text-center text-[10px] font-semibold uppercase tracking-wider text-amber-600">
                  {t("how.cuota.claim-window")}
                </span>
              </div>
              {/* Barra: el ancho de cada tramo es proporcional a la duración de la cuota y a la ventana de reclamo */}
              <div className="grid" style={columns}>
                <div className="h-1.5 rounded-l-full bg-violet-300/70" />
                <div className="h-1.5 rounded-r-full bg-amber-300" />
              </div>
              <div className="relative -mt-2.5 h-3.5">
                <span className="absolute left-0 h-3.5 w-3.5 rounded-full border-[3px] border-white bg-violet-400" />
                <span
                  className="absolute h-3.5 w-3.5 -translate-x-1/2 rounded-full border-[3px] border-white bg-amber-400"
                  style={{ left: `${(1 - claimFraction) * 100}%` }}
                />
                <span className="absolute right-0 h-3.5 w-3.5 rounded-full border-[3px] border-white bg-emerald-400" />
              </div>
              <div className="mt-1.5 grid grid-cols-3">
                <Milestone align="start" label={t("how.cuota.reserved")} detail={fmt(item.startSeconds)} />
                <Milestone align="center" label={t("aval.details.maturity-date")} detail={fmt(item.maturitySeconds)} />
                <Milestone align="end" label={t("aval.details.unlock-date")} detail={fmt(item.unlockSeconds)} />
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function Milestone({ align, label, detail }: { align: keyof typeof ALIGN; label: string; detail: string }) {
  return (
    <div className={`flex flex-col ${ALIGN[align]}`}>
      <p className="text-xs font-medium leading-4 text-slate-700 sm:text-sm sm:leading-5">{label}</p>
      <p className="font-mono text-xs text-slate-500">{detail}</p>
    </div>
  );
}
