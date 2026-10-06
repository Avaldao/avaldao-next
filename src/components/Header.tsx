import Image from "next/image";
import HeaderAuth from "./HeaderAuth";
import Nav from "./nav";
import Link from "next/link";
import { LanguageToggle } from "@/translations/LanguageToggle";
import HeaderShell from "./HeaderShell";
import LanguageWrapper from "./LanguageWrapper";
import { getLanguage } from "@/lib/cookies";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { localizeHref } from "@/translations/locales";

export default async function Header() {
  const language = await getLanguage();
  const session = await getServerSession(authOptions); //can throw exception
  const nroles = session?.user?.nroles;
  const isAdmin =
    nroles?.[30]?.includes("ADMIN_ROLE") ||
    nroles?.[31]?.includes("ADMIN_ROLE");
  const logoHref = isAdmin ? "/dashboard" : localizeHref("/", language);

  return (
    <HeaderShell className="fixed top-0 z-50 w-full border-b border-violet-100/50 bg-white/80 shadow-sm backdrop-blur-md transition-all duration-300 min-h-14 sm:min-h-[75px]
      flex flex-row items-center
    ">
      <div className="container mx-auto max-w-7xl px-4 py-2 sm:px-6 sm:py-3 lg:px-8 ">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex shrink-0 items-center">
            <Link href={logoHref} className="group flex items-center transition-opacity hover:opacity-80">
              <Image
                src="/images/avaldao.svg"
                alt="AvalDAO Logo"
                width={234}
                height={61}
                className="h-auto w-28 sm:w-30 transition-transform duration-300 group-hover:scale-105"
                priority
              />
            </Link>
          </div>

          {/* Navigation and Actions */}
          <LanguageWrapper language={language}>
            <div className="flex items-center gap-2 sm:gap-4 xl:gap-6">
              <Nav language={language} />
              <HeaderAuth />
              {/* En mobile el toggle vive dentro del menú hamburguesa. */}
              <div className="hidden lg:block">
                <LanguageToggle theme="dark" />
              </div>
            </div>
          </LanguageWrapper>
        </div>
      </div>
    </HeaderShell>
  )
}