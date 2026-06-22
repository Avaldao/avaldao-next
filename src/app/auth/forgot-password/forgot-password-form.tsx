"use client";

import { Language, translations } from "@/translations";
import { useState, useCallback } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import RecaptchaProvider from "@/components/recaptcha-provider";

function ForgotPasswordFormInner({ language }: { language: Language }) {
  const t = (key: string) => translations[key]?.[language] ?? key;

  const { executeRecaptcha } = useGoogleReCaptcha();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string>();

  const handleSubmit = useCallback(async () => {
    if (!email) return;

    setSubmitting(true);
    setError(undefined);

    try {
      if (process.env.NEXT_PUBLIC_SKIP_RECAPTCHA !== "true") {
        if (!executeRecaptcha) {
          setError(t("forgot-password.error.generic"));
          return;
        }
        const recaptchaToken = await executeRecaptcha("forgot_password");
        const verifyRes = await fetch("/api/auth/verify-recaptcha", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: recaptchaToken }),
        });
        if (!verifyRes.ok) {
          setError(t("login.error.recaptcha"));
          return;
        }
      }

      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, language }),
      });

      if (res.status === 422) {
        setError(t("forgot-password.error.cannot-process"));
        return;
      }

      if (!res.ok) {
        setError(t("forgot-password.error.generic"));
        return;
      }

      setDone(true);
    } catch {
      setError(t("forgot-password.error.generic"));
    } finally {
      setSubmitting(false);
    }
  }, [email, language, executeRecaptcha]);

  if (done) {
    return (
      <div className="w-full max-w-lg mx-auto flex flex-col items-center gap-6 pt-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <CheckCircle className="w-12 h-12 text-green-500" />
          <h2 className="text-xl font-semibold text-gray-900">{t("forgot-password.success.title")}</h2>
          <p className="text-sm text-gray-600 max-w-sm leading-relaxed">
            {t("forgot-password.success.description")}
          </p>
        </div>
        <Link
          href="/auth/login"
          className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("forgot-password.back-to-login")}
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg xl:max-w-xl mx-auto flex flex-col gap-4 flex-1">
      <div className="flex flex-col gap-4 flex-1 max-w-lg mx-auto w-full">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="forgot-email">{t("forgot-password.email.label")}</Label>
          <Input
            id="forgot-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("forgot-password.email.placeholder")}
            autoComplete="email"
            onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
          />
        </div>

        <div className="flex justify-center pt-3">
          <Button
            className="min-h-12 w-full max-w-md py-3.5 rounded-2xl shadow-md text-sm font-semibold"
            disabled={submitting || email.length === 0}
            loading={submitting}
            onClick={handleSubmit}
          >
            {t("forgot-password.submit")}
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
          {t("forgot-password.back-to-login")}
        </Link>
      </div>
    </div>
  );
}

export default function ForgotPasswordForm({ language }: { language: Language }) {
  return (
    <RecaptchaProvider>
      <ForgotPasswordFormInner language={language} />
    </RecaptchaProvider>
  );
}
