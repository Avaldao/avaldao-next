"use client";

import { Language, translations } from "@/translations";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";

interface ResetPasswordFormProps {
  language: Language;
  token: string;
}

export default function ResetPasswordForm({ language, token }: ResetPasswordFormProps) {
  const t = (key: string) => translations[key]?.[language] ?? key;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string>();

  const handleSubmit = async () => {
    setError(undefined);

    if (password !== confirmPassword) {
      setError(t("reset-password.error.passwords-mismatch"));
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data?.error === "invalid_token") {
          setError(t("reset-password.error.invalid-token"));
        } else {
          setError(t("reset-password.error.generic"));
        }
        return;
      }

      setDone(true);
    } catch {
      setError(t("reset-password.error.generic"));
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="w-full max-w-lg mx-auto flex flex-col items-center gap-6 pt-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <CheckCircle className="w-12 h-12 text-green-500" />
          <h2 className="text-xl font-semibold text-gray-900">{t("reset-password.success.title")}</h2>
          <p className="text-sm text-gray-600 max-w-sm leading-relaxed">
            {t("reset-password.success.description")}
          </p>
        </div>
        <Link
          href="/auth/login"
          className="flex items-center gap-2 min-h-12 px-8 py-3.5 rounded-2xl shadow-md text-sm font-semibold bg-primary text-white hover:opacity-90 transition-opacity"
        >
          {t("reset-password.back-to-login")}
        </Link>
      </div>
    );
  }

  const passwordsMatch = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;
  const canSubmit = password.length > 0 && confirmPassword.length > 0 && !submitting;

  return (
    <div className="w-full max-w-lg xl:max-w-xl mx-auto flex flex-col gap-4 flex-1">
      <div className="flex flex-col gap-4 flex-1 max-w-lg mx-auto w-full">

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="reset-password">{t("reset-password.password.label")}</Label>
          <Input
            id="reset-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("reset-password.password.placeholder")}
            autoComplete="new-password"
            trailing={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="reset-confirm-password">{t("reset-password.confirm-password.label")}</Label>
          <Input
            id="reset-confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={t("reset-password.confirm-password.placeholder")}
            autoComplete="new-password"
            onKeyDown={(e) => { if (e.key === "Enter" && canSubmit) handleSubmit(); }}
            trailing={
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />
          {confirmPassword.length > 0 && !passwordsMatch && (
            <p className="text-xs text-red-500">{t("reset-password.error.passwords-mismatch")}</p>
          )}
        </div>

        <div className="flex justify-center pt-3">
          <Button
            className="min-h-12 w-full max-w-md py-3.5 rounded-2xl shadow-md text-sm font-semibold"
            disabled={!canSubmit || !passwordsMatch}
            loading={submitting}
            onClick={handleSubmit}
          >
            {t("reset-password.submit")}
          </Button>
        </div>

        {error && (
          <div className="text-center">
            <p className="mt-2 text-sm text-red-600">{error}</p>
          </div>
        )}
      </div>

      <div className="flex flex-1" />

      <div className="flex justify-center pb-4">
        <Link
          href="/auth/login"
          className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("reset-password.back-to-login")}
        </Link>
      </div>
    </div>
  );
}
