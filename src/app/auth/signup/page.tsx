import SignupForm from "@/app/users/signup/form";
import LanguageWrapper from "@/components/LanguageWrapper";
import SideImageLayout from "@/components/layout/side-image-layout";
import { getLanguageCookie } from "@/lib/cookies";
import { translations } from "@/translations";
import { LanguageToggle } from "@/translations/LanguageToggle";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crear cuenta",
  robots: { index: false, follow: false },
};

export default async function SignupPage() {
  const language = await getLanguageCookie();
  const t = (key: string) => translations[key]?.[language] ?? key;


  return (
    <SideImageLayout>
      <h1 className="text-primary text-2xl font-semibold pb-6">{t("signup.create-account")}</h1>
      <main>
        <SignupForm language={language} />
      </main>
    </SideImageLayout>
  );
}


