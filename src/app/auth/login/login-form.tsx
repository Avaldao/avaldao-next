"use client";

import { Language, translations } from "@/translations";
import { Eye, EyeOff } from "lucide-react";
import { useState, useCallback } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import LoginWithWallet from "./login-with-wallet";
import RecaptchaProvider from "@/components/recaptcha-provider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";


function LoginFormInner({ language }: { language: Language }) {
  const t = (key: string) => translations[key]?.[language] ?? key;

  const router = useRouter();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>();


  const handleLogin = useCallback(async () => {
    try {
      if (email.length === 0 || password.length === 0) {
        setSubmitError(t("login.error.missing_fields"));
        return;
      }

      if (!executeRecaptcha && process.env.NEXT_PUBLIC_SKIP_RECAPTCHA !== "true") {
        setSubmitError(t("login.error.generic"));
        return;
      }

      setSubmitting(true);
      setSubmitError(undefined);

      if (process.env.NEXT_PUBLIC_SKIP_RECAPTCHA !== "true") {
        if(!executeRecaptcha) {
          setSubmitError(t("login.error.generic"));
          return;
        }
        const token = await executeRecaptcha("login");
        const verifyRes = await fetch("/api/auth/verify-recaptcha", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (!verifyRes.ok) {
          setSubmitError(t("login.error.recaptcha"));
          return;
        }
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      } else if (result?.ok) {
        router.push("/dashboard");
      }

    } catch (error) {
      console.error("Login error:", error);
      setSubmitError(t("login.error.generic"));
    } finally {
      setSubmitting(false);
    }
  }, [email, password, executeRecaptcha, router, language]);


  return (
    <div className="w-full max-w-lg xl:max-w-xl mx-auto flex flex-col gap-4 flex-1">
      <form
        className="flex flex-col gap-4 flex-1 max-w-lg mx-auto w-full"
        onSubmit={(e) => { e.preventDefault(); handleLogin(); }}
      >
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="login-email">{t("login.email")}</Label>
          <Input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("login.email.placeholder")}
            autoComplete="email"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="login-password">{t("login.password")}</Label>
          <Input
            id="login-password"
            type={showPwd ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("login.password.placeholder")}
            autoComplete="current-password"
            trailing={
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />
        </div>

        <div className="flex justify-center pt-3">
          <Button
            type="submit"
            className="min-h-12 w-full max-w-md py-3.5 rounded-2xl shadow-md  text-sm font-semibold"
            disabled={submitting || email.length === 0 || password.length === 0}
            loading={submitting}
          >
            {t("login.submit")}
            {submitting && <Spinner variant="sm" />}
          </Button>
        </div>

        <div className="text-center">
          {submitError && <p className="mt-2 text-sm text-red-600">{submitError}</p>}
          <a
            href="/auth/forgot-password"
            className="text-sm font-medium text-primary hover:underline"
          >
            {t("login.forgot-password")}
          </a>
        </div>

      </form>
      <div className="flex flex-1"></div>
      <div>
        <div className="flex items-center gap-4 w-full mx-auto max-w-sm">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-sm text-slate-800">{t("login.or")}</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>
      </div>
      <div>
        <div className="flex justify-center">
          <LoginWithWallet language={language} />
        </div>
      </div>
      <p className="text-center text-sm text-slate-500">
        {t("login.no-account")}{" "}
        <a href="/auth/signup" className="font-semibold text-violet-600 hover:text-violet-700 transition-colors">
          {t("login.signup-link")}
        </a>
      </p>
    </div>
  );
}

export default function LoginForm({ language }: { language: Language }) {
  return (
    <RecaptchaProvider>
      <LoginFormInner language={language} />
    </RecaptchaProvider>
  );
}
