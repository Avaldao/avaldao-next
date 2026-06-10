"use client";


import { Language, translations } from "@/translations";
import { ArrowRight, Eye, EyeOff, Wallet } from "lucide-react";
import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";


export default function LoginForm({ language }: { language: Language }) {

  const t = (key: string) => translations[key]?.[language] ?? key;

  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>();

  const handleLogin = async () => {
    try {

      //first validate email and password on client side
      if (email.length === 0 || password.length === 0) {
        setSubmitError(t("login.error.missing_fields"));
        return;
      }
      setSubmitting(true);
      setSubmitError(undefined);

  
      const result = await signIn(
        "credentials",
        {
          email,
          password,
          redirect: false, // Evita redirección automática
        }
      );
      console.log(result);
      
      if (result?.error) {
        
        throw new Error(result.error);
      } else if (result?.ok) {
        // Login successful, you can redirect or update UI as needed
        console.log("Login successful");
        router.push("/dashboard"); // Redirige al dashboard u otra página protegida
      }


      console.log("Login successful:", result);


    } catch (error) {
      console.error("Login error:", error);
      setSubmitError(t("login.error.generic"));
    } finally {
      setSubmitting(false);
    }
  }


  return (
    <div className="w-full max-w-lg xl:max-w-xl mx-auto flex flex-col gap-4 flex-1">
      <div className="flex flex-col gap-4 flex-1 max-w-lg mx-auto w-full">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-600">{t("login.email")}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("login.email.placeholder")}
            autoComplete="email"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-10 text-sm text-gray-800 
                         placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500/30 
                         focus:border-violet-400 transition-all"
          />

        </div>

        {/* Confirmar contraseña */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-600">{t("login.password")}</label>
          <div className="relative flex items-center">
            <input
              type={showPwd ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("login.password.placeholder")}
              autoComplete="current-password"
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


        </div>
        <div className="flex justify-center pt-5">

          <button
            className="w-full max-w-md  bg-violet-600 hover:bg-violet-700 active:scale-[0.98] text-white font-semibold text-sm py-3.5 rounded-2xl 
          flex items-center justify-center gap-2 transition-all shadow-md shadow-violet-200
          disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
            disabled={submitting || email.length === 0 || password.length == 0}
            onClick={handleLogin}
          >
            {t("login.submit")}
            {submitting ? (
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}

          </button>

        </div>

        <div className="text-center">
          {submitError && <p className="mt-2 text-sm text-red-600">{submitError}</p>}
        </div>

      </div>
      <div className="flex  flex-1">
      </div>
      {/* Separator OR */}
      <div>
        <div className="flex items-center gap-4 w-full mx-auto max-w-sm">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-sm text-slate-800">{t("login.or")}</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>
      </div>
      <div>
        <div className="flex justify-center">
          <button
            className="w-full max-w-md 
            bg-linear-to-r from-violet-600 to-fuchsia-600 
            hover:from-violet-700 hover:to-fuchsia-700

            cursor-pointer
            active:scale-[0.98] text-white font-semibold text-sm py-3.5 rounded-2xl 
          flex items-center justify-center gap-2 transition-all shadow-md shadow-violet-200
          disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none"

          >
            <Wallet className="w-4 h-4" />
            {t("login.submit.wallet")}

          </button>
        </div>
      </div>

    </div>
  )
}
