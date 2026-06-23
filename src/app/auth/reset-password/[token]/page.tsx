import SideImageLayout from "@/components/layout/side-image-layout";
import { getLanguageCookie } from "@/lib/cookies";
import { translations } from "@/translations";
import ResetPasswordForm from "./reset-password-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Restablecer contraseña",
  robots: { index: false, follow: false },
};

export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const language = await getLanguageCookie();
  const t = (key: string) => translations[key]?.[language] ?? key;

  return (
    <SideImageLayout>
      <div className="mx-auto max-w-lg pt-10 flex flex-col items-center min-h-[90vh]">
        <h1 className="text-primary text-2xl font-semibold pb-3">{t("reset-password.title")}</h1>
        <p className="text-gray-600 mb-6 text-center max-w-sm">{t("reset-password.description")}</p>
        <main className="flex flex-1 w-full">
          <ResetPasswordForm language={language} token={token} />
        </main>
      </div>
    </SideImageLayout>
  );
}
