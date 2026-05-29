import Image from "next/image";
import HeaderAuth from "./HeaderAuth";
import Nav from "./nav";
import Link from "next/link";
import { LanguageProvider } from "@/context/LanguageContext";
import { LanguageToggle } from "@/translations/LanguageToggle";
import LanguageWrapper from "./LanguageWrapper";
import { getLanguageCookie } from "@/lib/cookies";

export default async function Header() {
  const language = await getLanguageCookie();

  return (
    <header className="bg-white shadow-md border-b py-1 fixed w-full z-50">
      <div className="container mx-auto px-6 sm:px-4 py-4 max-w-6xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link href="/">
              <Image
                src="/images/avaldao.svg"
                alt="AvalDAO Logo"
                width={65}
                height={250}
                className="w-30 sm:w-45 -mt-3"
              />
            </Link>
          </div>

          <div className="flex items-center md:gap-x-4 sm:gap-x-8">
            <Nav language={language} />
            <HeaderAuth />
            <LanguageWrapper language={language}>
              <LanguageToggle theme="dark" />
            </LanguageWrapper>
     
          </div>
        </div>
      </div>
    </header>
  )
}