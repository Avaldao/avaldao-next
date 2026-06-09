import SignupForm from "@/app/users/signup/form";
import LanguageWrapper from "@/components/LanguageWrapper";
import { getLanguageCookie } from "@/lib/cookies";
import { translations } from "@/translations";
import { LanguageToggle } from "@/translations/LanguageToggle";
import Image from "next/image";

export default async function SignupPage() {
  const language = await getLanguageCookie();
  const t = (key: string) => translations[key]?.[language] ?? key;


  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 min-h-screen bg-white">
      <aside className="hidden xl:block">
        <div className="relative h-full w-full overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-bottom-left scale-105 blur-xs"
            style={{ backgroundImage: "url('/images/signup-bg.png')" }}
          />

          <div className="absolute inset-0 z-10 flex items-center justify-center p-20">
            <Image
              src="/images/avaldao.svg"
              alt="Logo"
              width={300}
              height={100}
              className="h-auto w-72"
              priority
            />
          </div>

          <div className="absolute inset-0 bg-black/60" />
        </div>
      </aside>

      <div className="p-10 max-h-screen overflow-auto">
        <div className="flex justify-end fixed right-10 z-50">

          <div className="w-fit">
            <LanguageWrapper language={language}>
              <LanguageToggle theme="dark" />
            </LanguageWrapper>
          </div>
        </div>
        <div>
        <h1 className="text-primary text-2xl font-semibold pb-6">{t("signup.create-account")}</h1>
        <main>
          <SignupForm language={language} />
        </main>
          </div>
      </div>
    </div >
  );
}


