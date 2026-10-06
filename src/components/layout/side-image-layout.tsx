import { getLanguage } from "@/lib/cookies";
import { translations } from "@/translations";
import Image from "next/image";
import LanguageWrapper from "../LanguageWrapper";
import { LanguageToggle } from "@/translations/LanguageToggle";

export default async function SideImageLayout({children}: {children: React.ReactNode}) {

  const language = await getLanguage();
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

      <div className="relative px-5 pt-5 pb-10 sm:px-8 sm:pt-8 xl:p-10 xl:max-h-screen xl:overflow-auto">
        <div className="flex justify-end absolute top-5 right-5 sm:top-8 sm:right-8 xl:fixed xl:top-auto xl:right-10 z-50">

          <div className="w-fit">
            <LanguageWrapper language={language}>
              <LanguageToggle theme="dark" />
            </LanguageWrapper>
          </div>
        </div>
        {children}
      </div>
    </div >
  );
}


