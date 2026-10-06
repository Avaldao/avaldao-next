import InstallmentList from "@/components/avales/installment-list";
import { DEFAULT_DESBLOQUEO_SECONDS, generateTranches } from "@/app/entities/aval.entity";

interface CuotasPreviewProps {
  fechaInicio: Date | string | undefined;
  duracionCuotaDias: number | string;
  cuotasCantidad: number | string;
  montoFiat: number | string;
  t: (key: string) => string;
}

const MAX_CUOTAS = 120;

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
  const montoCuota = (monto / cantidad).toFixed(2);

  const items = tranches.map((tr) => ({
    key: tr.index,
    label: `${t("aval.details.tranche")} ${tr.index}`,
    amount: `$ ${montoCuota}`,
    startSeconds: tr.startDateSeconds,
    maturitySeconds: tr.maturityDateSeconds,
    unlockSeconds: tr.unlockDateSeconds,
  }));

  return (
    <fieldset className="rounded-xl border border-slate-200 px-3 sm:px-4 pb-4 pt-2">
      <legend className="px-2 text-sm font-semibold text-slate-800">{t("aval.form.schedule")}</legend>

      <InstallmentList items={items} t={t} />

      <p className="mt-2 text-xs text-slate-500">
        {t("aval.form.schedule.note").replace("{days}", String(DEFAULT_DESBLOQUEO_SECONDS / 86400))}
      </p>
    </fieldset>
  );
}
