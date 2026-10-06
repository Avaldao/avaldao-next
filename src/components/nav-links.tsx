"use client";

import { useEffect, useRef, useState } from "react";
import { Language, translations } from "@/translations";
import { localizeHref } from "@/translations/locales";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDisconnect } from "@reown/appkit/react";
// Side effect: inicializa AppKit (createAppKit) para poder usar sus hooks acá.
import "@/context/appkit-context";
import { LogOut, Menu, Settings, UserIcon, X } from "lucide-react";
import { LanguageToggle } from "@/translations/LanguageToggle";
import NetworkRoles from "@/components/ui/layout/network-roles";

const linkClass = "whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-violet-50 hover:text-violet-700 xl:px-4 xl:text-base";
const accountLinkClass = "flex items-center px-2 py-3 text-base font-medium text-slate-700 transition-colors duration-200 hover:bg-violet-50 hover:text-violet-700";
const mobileLinkClass = "block px-2 py-3 text-base font-medium text-slate-700 transition-colors duration-200 hover:bg-violet-50 hover:text-violet-700";

interface NavItem {
  href: string;
  label: string;
  // Los anchors (#seccion) son de la landing y no pasan por el router.
  anchor?: boolean;
}

export default function NavLinks({ language }: { language: Language }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  // Guardamos en qué ruta se abrió: al navegar deja de coincidir y el menú se cierra solo.
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;
  const setOpen = (value: boolean) => setOpenPath(value ? pathname : null);
  const menuRef = useRef<HTMLDivElement>(null);
  const nroles = session?.user?.nroles;
  const isAdmin =
    nroles?.[30]?.includes("ADMIN_ROLE") ||
    nroles?.[31]?.includes("ADMIN_ROLE") ||
    false;

  const t = (key: string) => translations[key]?.[language] ?? key;
  const router = useRouter();
  const { disconnect } = useDisconnect();
  const user = session?.user;
  const address = user?.address;

  const handleSignOut = async () => {
    setOpen(false);
    signOut({ callbackUrl: "/" });
    await disconnect();
    router.push("/");
  };

  const items: NavItem[] = status == "authenticated"
    ? [
      { href: "/dashboard", label: t("nav.dashboard") },
      { href: "/guarantees", label: t("sidebar.avales") },
      ...(isAdmin ? [{ href: "/staff/users", label: t("nav.users") }] : []),
    ]
    : [
      { href: "#que-es", label: t("nav.about"), anchor: true },
      { href: "#como-funciona", label: t("nav.how"), anchor: true },
      { href: "#dashboard", label: t("nav.dashboard"), anchor: true },
      { href: localizeHref("/invertir", language), label: t("nav.invest") },
      { href: "/avales/new", label: t("nav.request-aval") },
    ];

  // Cerrar con Escape o al tocar fuera del menú.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && setOpenPath(null);
    const onPointerDown = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setOpenPath(null);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  const renderLink = (item: NavItem, className: string, onClick?: () => void) =>
    item.anchor ? (
      <a key={item.href} href={item.href} className={className} onClick={onClick}>{item.label}</a>
    ) : (
      <Link key={item.href} href={item.href} className={className} onClick={onClick}>{item.label}</Link>
    );

  return (
    <>
      <nav className="hidden lg:flex lg:items-center lg:gap-1 xl:gap-2">
        {items.map((item) => renderLink(item, linkClass))}
      </nav>

      {/* Menú hamburguesa (< lg). order-last lo deja al final del header; el panel se ancla al header. */}
      <div ref={menuRef} className="order-last lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? t("nav.menu.close") : t("nav.menu.open")}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-700 transition-colors hover:bg-violet-50 hover:text-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {open && (
          <nav
            id="mobile-menu"
            className="absolute inset-x-0 top-full max-h-[calc(100dvh-56px)] sm:max-h-[calc(100dvh-75px)] overflow-y-auto rounded-b-2xl border-b border-violet-100/50 bg-white px-4 pb-4 pt-1 shadow-xl sm:px-6"
          >
            <div className="mx-auto flex max-w-7xl flex-col">
              {status === "authenticated" && user && (
                <div className="flex items-center gap-3 border-b border-slate-100 py-3">
                  {user.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.avatar} alt="" className="h-12 w-12 shrink-0 rounded-full object-cover shadow-sm" />
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-lg font-bold text-white">
                      {user.name?.substring(0, 1)?.toUpperCase() || "U"}
                    </div>
                  )}
                  <div className="min-w-0 text-xs">
                    <div className="truncate text-sm font-semibold text-gray-900">{user.name || "User"}</div>
                    {user.email && <div className="truncate text-gray-500">{user.email}</div>}
                    {address && (
                      <div className="font-mono text-gray-500">{`${address.slice(0, 6)}...${address.slice(-4)}`}</div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-col divide-y divide-slate-100">
                {items.map((item) => renderLink(item, mobileLinkClass, () => setOpen(false)))}
              </div>

              {status === "authenticated" && (
                <>
                  <NetworkRoles nroles={user?.nroles} className="border-t border-slate-100 py-3" />
                  <div className="flex flex-col divide-y divide-slate-100 border-t border-slate-100">
                    <Link href="/user/profile" onClick={() => setOpen(false)} className={accountLinkClass}>
                      <UserIcon className="mr-3 h-4 w-4" />{t("nav.profile")}
                    </Link>
                    <Link href="/settings" onClick={() => setOpen(false)} className={accountLinkClass}>
                      <Settings className="mr-3 h-4 w-4" />{t("nav.settings")}
                    </Link>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="flex items-center px-2 py-3 text-left text-base font-medium text-red-600 transition-colors hover:bg-red-50"
                    >
                      <LogOut className="mr-3 h-4 w-4" />{t("nav.signout")}
                    </button>
                  </div>
                </>
              )}

              <div className="flex items-center gap-3 border-t border-slate-100 pt-3">
                {status === "unauthenticated" && (
                  <div className="grid flex-1 grid-cols-2 gap-2">
                    <Link
                      href="/auth/login"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-center rounded-full border border-violet-200 px-3 py-2 text-sm font-semibold text-violet-700 transition-colors hover:bg-violet-50"
                    >
                      {t("nav.login")}
                    </Link>
                    <Link
                      href="/auth/signup"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-center rounded-full bg-linear-to-r from-violet-600 to-fuchsia-600 px-3 py-2 text-sm font-semibold text-white shadow-md"
                    >
                      {t("nav.signup")}
                    </Link>
                  </div>
                )}
                <div className="ml-auto shrink-0">
                  <LanguageToggle />
                </div>
              </div>
            </div>
          </nav>
        )}
      </div>
    </>
  );
}
