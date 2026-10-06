import SignupForm from "@/app/users/signup/form";
import LanguageWrapper from "@/components/LanguageWrapper";
import SideImageLayout from "@/components/layout/side-image-layout";
import { getLanguage } from "@/lib/cookies";
import { translations } from "@/translations";
import { LanguageToggle } from "@/translations/LanguageToggle";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { localizeHref } from "@/translations/locales";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crear cuenta",
  robots: { index: false, follow: false },
};

export default async function SignupPage() {
  const language = await getLanguage();
  const t = (key: string) => translations[key]?.[language] ?? key;


  return (
    <SideImageLayout>
      <div className="mb-6">
        <Link
          href={localizeHref("/", language)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("login.back")}
        </Link>
      </div>
      <h1 className="text-primary text-2xl font-semibold pb-6">{t("signup.create-account")}</h1>
      <main>
        <SignupForm language={language} />
      </main>
    </SideImageLayout>
  );
}


