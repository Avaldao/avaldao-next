import { BadgeCheck } from "lucide-react";
import type { UserStatus } from "@/lib/db/models/user-model";
import { createT, type Language } from "@/translations";

/**
 * Nombre de un usuario junto a su estado de verificación. Solo los usuarios
 * `active` tienen la identidad constatada por Avaldao; para el resto el nombre
 * es el que declararon al registrarse y así se indica.
 */
export default function VerifiedName({
  name,
  status,
  language,
  className = "",
}: {
  name: string;
  status?: UserStatus;
  language: Language;
  className?: string;
}) {
  const t = createT(language);
  const verified = status === "active";

  return (
    <span className={`inline-flex min-w-0 max-w-full items-center gap-1.5 ${className}`}>
      <span className={`truncate ${verified ? "" : "text-slate-600"}`}>{name}</span>
      {verified ? (
        <span className="shrink-0" title={t("user.identity.verified")}>
          <BadgeCheck className="h-4 w-4 text-green-600" aria-label={t("user.identity.verified")} />
        </span>
      ) : (
        <span
          className="shrink-0 rounded-full border border-amber-200 bg-amber-50 px-1.5 py-px text-[11px] font-normal not-italic text-amber-700"
          title={t("user.identity.unverified.hint")}
        >
          {t("user.identity.unverified")}
        </span>
      )}
    </span>
  );
}
