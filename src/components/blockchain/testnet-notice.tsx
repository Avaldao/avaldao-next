import { FlaskConical } from "lucide-react";

/** Aviso de que la operación se realiza en una red de pruebas y no tiene validez. */
export default function TestnetNotice({ t }: { t: (key: string) => string }) {
  return (
    <div className="mx-6 mb-4 flex gap-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 ring-1 ring-amber-200 dark:ring-amber-900 px-4 py-3">
      <FlaskConical className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
      <div className="space-y-0.5">
        <p className="text-xs font-semibold text-amber-900 dark:text-amber-200">{t("tx.testnet.title")}</p>
        <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">{t("tx.testnet.description")}</p>
      </div>
    </div>
  );
}
