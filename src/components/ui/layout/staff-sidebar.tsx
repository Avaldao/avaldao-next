"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  Trees,
  Building2,
  Package,
  GitBranch,
  PanelRight,
  UserIcon,
  Search,
  Factory,
  FileText,
  Award,
  Ship,
  ShieldAlert,
  ScrollText,
  BarChart2,
  FileCheck,
} from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import { Language, translations } from "@/translations";
import NetworkRoles, { networks } from "@/components/ui/layout/network-roles";

interface SidebarItem {
  key: string;
  labelKey: string;
  icon: React.ReactNode;
  href: string;
  roles?: string[];
}

const items: SidebarItem[] = [
  {
    key: "dashboard",
    labelKey: "sidebar.dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    href: "/dashboard",
  },
  {
    key: "avales",
    labelKey: "sidebar.avales",
    icon: <FileCheck className="h-5 w-5" />,
    href: "/guarantees",
  },
  {
    key: "users",
    labelKey: "sidebar.users",
    icon: <Users className="h-5 w-5" />,
    href: "/staff/users",
    roles: ["ADMIN_ROLE"],
  },
];

interface StaffSidebarProps {
  userName?: string;
  nroles: {
    "30": string[];
    "31": string[];
  };
  badges?: Record<string, number>;
  language: Language;
}

export default function StaffSidebar({ userName, nroles, badges, language }: StaffSidebarProps) {
  const t = (key: string) => translations[key]?.[language] ?? key;

  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("staff-sidebar-collapsed");
    if (saved !== null) setCollapsed(saved === "true");
  }, []);

  const toggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("staff-sidebar-collapsed", String(next));
  };

  const isActive = (href: string) => {
    if (!pathname) return false;
    const path = href.split("#")[0];
    console.log({ pathname, path });
    if (path === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(path);
  };

  return (
    <aside
      className={`hidden md:flex flex-col shrink-0 border-r border-gray-200 bg-white sticky top-[75px] h-[calc(100vh-75px)] overflow-y-auto transition-all duration-200 text-slate-700 text-sm ${collapsed ? "w-14" : "w-72"}`}
    >
      {/* Toggle button */}
      <div
        className={`flex items-center border-b border-gray-100 px-3 py-3 ${collapsed ? "justify-center" : "justify-between"}`}
      >
        {!collapsed && (
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {t("staff.sidebar.menu")}
          </span>
        )}
        <button
          onClick={toggle}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          title={collapsed ? t("staff.sidebar.expand") : t("staff.sidebar.collapse")}
        >
          <PanelRight className="h-4 w-4" />
        </button>
      </div>

      {/* User info — expanded */}
      {!collapsed && (
        <div className="px-3 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0">
              {userName ? (
                <span className="text-slate-700 text-xs font-bold text-white">{userName[0].toUpperCase()}</span>
              ) : (
                <UserIcon className="text-white h-4 w-4" />
              )}
            </div>
            <div className="flex flex-col min-w-0 gap-2 text-xs">
              {userName && (
                <span className="font-semibold text-slate-700 truncate">
                  {userName}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Nav items */}
      <nav className="flex flex-col gap-1 px-2 pt-2">
        {items
          .filter(
            (item) =>
              !item.roles ||
              item.roles.some((r) =>
                nroles["30"]?.includes(r) ||
                nroles[process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID as "30" | "31"]?.includes(r)
              )
          )
          .map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.key}
                href={item.href}
                title={collapsed ? t(item.labelKey) : undefined}
                className={`flex items-center rounded-lg text-sm font-medium transition-colors group ${collapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2.5"} ${active ? "bg-violet-100 text-violet-600" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}`}
              >
                <span className={`shrink-0 ${active ? "text-violet-600" : "text-violet-300 group-hover:text-violet-500 transition-colors"}`}>
                  {item.icon}
                </span>
                {!collapsed && (
                  <span className="truncate flex-1">{t(item.labelKey)}</span>
                )}
                {!collapsed && badges?.[item.key] ? (
                  <span className="ml-auto text-[10px] font-bold bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center leading-none">
                    {badges[item.key]}
                  </span>
                ) : null}
              </Link>
            );
          })}
      </nav>

      {/* Network roles — expanded */}
      {!collapsed && <NetworkRoles nroles={nroles} language={language} className="absolute bottom-5 left-3 right-3" />}

      {/* Network roles — collapsed (compact) */}
      {collapsed && (
        <div className="absolute bottom-5 left-0 right-0 flex flex-col items-center gap-1.5">
          {networks.map((network) => {
            const count = nroles?.[network.id as "30" | "31"]?.length ?? 0;
            const roles = nroles?.[network.id as "30" | "31"] ?? [];
            const tooltip = `${network.name}\n${roles.length ? roles.map((r) => r.replaceAll("_", " ")).join(", ") : t("staff.roles.none-short")}`;
            return (
              <div
                key={network.id}
                title={tooltip}
                className={`w-8 h-8 rounded-lg border flex flex-col items-center justify-center cursor-default ${network.className}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${network.dotClassName} mb-0.5`} />
                <span className={`text-[9px] font-bold leading-none ${network.badgeClassName.split(" ")[1]}`}>
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </aside>
  );
}
