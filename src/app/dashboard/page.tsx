import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getLanguage } from "@/lib/cookies";
import UserDashboardWrapper from "./user-dashboard-wrapper";
import AvaldaoPlatformCard from "./avaldao-platform-card";
import CommonUserDashboard from "./common-user-dashboard";
import Link from "next/link";
import { Plus } from "lucide-react";
import { translations } from "@/translations";

export default async function DashboardPage() {
  const [session, language] = await Promise.all([
    getServerSession(authOptions),
    getLanguage(),
  ]);

  const nroles = session?.user?.nroles ?? {};
  const isAdmin =
    nroles[30]?.includes("ADMIN_ROLE") ||
    nroles[31]?.includes("ADMIN_ROLE") ||
    false;

  const newAvalLabel = translations["dashboard.new-aval"]?.[language] ?? "dashboard.new-aval";

  if (!isAdmin) {
    return <CommonUserDashboard />;
  }

  return (
    <div className="max-w-6xl space-y-6">
      <UserDashboardWrapper userName={session?.user?.name ?? ""} />
      <AvaldaoPlatformCard language={language} nroles={nroles} />
      <Link
        href="/avales/new"
        aria-label={newAvalLabel}
        title={newAvalLabel}
        className="fixed bottom-5 right-5 z-40 flex h-14 items-center justify-center gap-2 rounded-full bg-linear-to-r from-violet-600 to-fuchsia-600 px-4 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition-all duration-200 hover:from-violet-700 hover:to-fuchsia-700 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 sm:bottom-8 sm:right-8 max-sm:w-14 max-sm:px-0"
      >
        <Plus className="h-6 w-6 shrink-0" />
        <span className="max-sm:hidden">{newAvalLabel}</span>
      </Link>
    </div>
  );
}
