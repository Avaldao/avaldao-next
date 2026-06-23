import SignupForm from "./form";
import { getLanguageCookie } from "@/lib/cookies";
import { translations } from "@/translations";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registrarse",
  robots: { index: false, follow: false },
};

export default async function SignupPage() {
  const language = await getLanguageCookie();
  const t = (key: string) => translations[key]?.[language] ?? key;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-slate-800 mb-1">{t("signup.title")}</h1>
      <p className="text-sm text-slate-500 mb-6">{t("signup.description")}</p>

      <SignupForm language={language} />
    </div>
  );
}