import Image from "next/image";
import HeaderAuth from "./HeaderAuth";
import Nav from "./nav";
import Link from "next/link";
import { LanguageProvider } from "@/context/LanguageContext";
import { LanguageToggle } from "@/translations/LanguageToggle";
import LanguageWrapper from "./LanguageWrapper";
import { getLanguageCookie } from "@/lib/cookies";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Header() {
  const language = await getLanguageCookie();
  const session = await getServerSession(authOptions);
  const nroles = session?.user?.nroles;
  const isAdmin =
    nroles?.[30]?.includes("ADMIN_ROLE") ||
    nroles?.[31]?.includes("ADMIN_ROLE");
  const logoHref = isAdmin ? "/dashboard" : "/";

  return (
    <header className="fixed top-0 z-50 w-full border-b border-violet-100/50 bg-white/80 shadow-sm backdrop-blur-md transition-all duration-300 min-h-[75px]
      flex flex-row items-center
    ">
      <div className="container mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8 ">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href={logoHref} className="group flex items-center transition-opacity hover:opacity-80">
              <Image
                src="/images/avaldao.svg"
                alt="AvalDAO Logo"
                width={234}
                height={61}
                className="h-auto w-20 sm:w-30 transition-transform duration-300 group-hover:scale-105"
                priority
              />
            </Link>
          </div>

          {/* Navigation and Actions */}
          <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
            <Nav language={language} />
            <LanguageWrapper language={language}>
              <>
                <HeaderAuth />
                <LanguageToggle theme="dark" />
              </>
            </LanguageWrapper>
          </div>
        </div>
      </div>
    </header>
  )
}