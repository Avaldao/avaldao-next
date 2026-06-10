import { ReactNode, useState } from "react";
import { AuthMethod, Step } from "./activate-account-client";
import { ArrowLeft, ArrowRight, Eye, EyeOff } from "lucide-react";

interface Step2Props {
  selected: AuthMethod[];
  setStep: React.Dispatch<React.SetStateAction<Step>>;
  stepIndicator: ReactNode;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  submitting: boolean;
  submitError: string | undefined;
  submitForm: () => Promise<void>;
}

export default function Step2({ selected, password, setPassword, setStep, stepIndicator, submitForm }: Step2Props) {
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const strength = (p: string) => {
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };

  const strengthLevel = strength(password);
  const strengthColors = ["bg-red-400", "bg-amber-400", "bg-lime-500", "bg-emerald-500"];
  const strengthLabels = ["", "Débil", "Aceptable", "Buena", "Fuerte"];

  const passwordsMatch = confirm.length > 0 && password === confirm;
  const passwordMismatch = confirm.length > 0 && password !== confirm;
  const isValid = strengthLevel >= 2 && passwordsMatch;

  return (
    <div className="w-full max-w-lg xl:max-w-xl mx-auto flex flex-col gap-4 p-4">
      {/* Progress + Header */}
      <div className="mb-1 mt-10">
        <div className="mb-3 flex items-center gap-4 cursor-pointer" onClick={() => setStep(1)}>
          <ArrowLeft className="w-4 h-4 text-slate-600 hover:text-violet-800 transition-colors" />
        </div>
        {stepIndicator}
        <h1 className="text-xl font-bold text-gray-900 leading-snug">
          Tu cuenta está casi lista
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Elegí una contraseña segura para tu cuenta.{" "}
          <span className="text-gray-400">(podés cambiarla después)</span>
        </p>
      </div>

      {/* Password fields */}
      <div className="flex flex-col gap-4">

        {/* Contraseña */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-600">Contraseña</label>
          <div className="relative flex items-center">
            <input
              type={showPwd ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 8 caracteres"
              autoComplete="new-password"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-10 text-sm text-gray-800 
                         placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500/30 
                         focus:border-violet-400 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPwd((v) => !v)}
              className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Barra de fortaleza */}
          {password.length > 0 && (
            <>
              <div className="flex gap-1 mt-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all ${i <= strengthLevel ? strengthColors[strengthLevel - 1] : "bg-gray-100"
                      }`}
                  />
                ))}
              </div>
              <p
                className={`text-xs ${strengthLevel <= 1
                  ? "text-red-400"
                  : strengthLevel >= 3
                    ? "text-emerald-500"
                    : "text-amber-500"
                  }`}
              >
                {strengthLabels[strengthLevel]}
              </p>
            </>
          )}
        </div>

        {/* Confirmar contraseña */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-600">Confirmar contraseña</label>
          <div className="relative flex items-center">
            <input
              type={showConfirm ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repetí tu contraseña"
              autoComplete="new-password"
              className={`w-full border rounded-xl px-4 py-3 pr-10 text-sm text-gray-800 
                          placeholder-gray-300 focus:outline-none focus:ring-2 transition-all
                          ${passwordMismatch
                  ? "border-red-300 focus:ring-red-500/20 focus:border-red-400"
                  : passwordsMatch
                    ? "border-emerald-300 focus:ring-emerald-500/20 focus:border-emerald-400"
                    : "border-gray-200 focus:ring-violet-500/30 focus:border-violet-400"
                }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={showConfirm ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {confirm.length > 0 && (
            <p
              className={`text-xs ${passwordsMatch ? "text-emerald-500" : "text-red-400"
                }`}
            >
              {passwordsMatch ? "Las contraseñas coinciden" : "Las contraseñas no coinciden"}
            </p>
          )}
        </div>

        <div className="text-xs text-gray-500 mt-2">
          Usa una contraseña de al menos 8 caracteres. Para aumentar su seguridad, combina letras mayúsculas y minúsculas, números y caracteres especiales (por ejemplo: !, @, #, $).
        </div>
      </div>

      <div className="flex-1" />

      {/* CTA */}
      <div>
        <button
          className="w-full bg-violet-600 hover:bg-violet-700 active:scale-[0.98] text-white font-semibold text-sm py-3.5 rounded-2xl 
                     flex items-center justify-center gap-2 transition-all shadow-md shadow-violet-200
                     disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
          disabled={!isValid}
          onClick={() => {
            if(selected.includes("web3")) {
              setStep(3);
            } else {
              submitForm();
            }
            
          }}
        >
          Continuar
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}