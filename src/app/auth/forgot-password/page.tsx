import SideImageLayout from "@/components/layout/side-image-layout";
import { getLanguageCookie } from "@/lib/cookies";
import { translations } from "@/translations";
import ForgotPasswordForm from "./forgot-password-form";

export default async function ForgotPasswordPage() {
  const language = await getLanguageCookie();
  const t = (key: string) => translations[key]?.[language] ?? key;

  return (
    <SideImageLayout>
      <div className="mx-auto max-w-lg pt-10 flex flex-col items-center min-h-[90vh]">
        <h1 className="text-primary text-2xl font-semibold pb-3">{t("forgot-password.title")}</h1>
        <p className="text-gray-600 mb-6 text-center max-w-sm">{t("forgot-password.description")}</p>
        <main className="flex flex-1 w-full">
          <ForgotPasswordForm language={language} />
        </main>
      </div>
    </SideImageLayout>
  );
}
