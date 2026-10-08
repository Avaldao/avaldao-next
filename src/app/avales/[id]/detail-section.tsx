import { ReactNode } from "react";

// Sección del detalle del aval. Replica el fieldset + legend del formulario de creación
// (src/app/avales/new/aval-form.tsx) para que ambas vistas se lean igual.
export function DetailSection({ title, children, className = "" }: { title: ReactNode; children: ReactNode; className?: string }) {
  return (
    <fieldset className={`rounded-xl border border-slate-200 px-3 sm:px-4 pb-4 pt-2 space-y-3 ${className}`}>
      <legend className="px-2 text-sm font-semibold text-slate-800">{title}</legend>
      {children}
    </fieldset>
  );
}

// Campo de solo lectura con el mismo estilo de etiqueta que el Label del formulario.
export function DetailField({ label, children, className = "" }: { label: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <p className="block mb-1 text-sm font-medium text-primary">{label}</p>
      <div className="text-slate-800">{children}</div>
    </div>
  );
}
