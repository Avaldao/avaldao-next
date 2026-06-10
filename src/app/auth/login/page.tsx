import SignupForm from "@/app/users/signup/form";
import LanguageWrapper from "@/components/LanguageWrapper";
import SideImageLayout from "@/components/layout/side-image-layout";
import { getLanguageCookie } from "@/lib/cookies";
import { translations } from "@/translations";
import { LanguageToggle } from "@/translations/LanguageToggle";
import Image from "next/image";
import LoginForm from "./login-form";

export default async function LoginPage() {
  const language = await getLanguageCookie();
  const t = (key: string) => translations[key]?.[language] ?? key;


  return (
    <SideImageLayout>
      <div className="mx-auto max-w-lg pt-10 flex flex-col items-center min-h-[90vh]">
        <h1 className="text-primary text-2xl font-semibold pb-6">{t("login.title")}</h1>
        <p className="text-gray-600 mb-6">{t("login.description")}</p>
        <main className="flex flex-1 w-full">
          <LoginForm language={language}/>
        </main>
      </div>
    </SideImageLayout>
  );
}


