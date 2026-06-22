import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getLanguageCookie } from "@/lib/cookies";
import UserDashboardWrapper from "./user-dashboard-wrapper";
import AvaldaoPlatformCard from "./avaldao-platform-card";
import CommonUserDashboard from "./common-user-dashboard";

export default async function DashboardPage() {
  const [session, language] = await Promise.all([
    getServerSession(authOptions),
    getLanguageCookie(),
  ]);

  const nroles = session?.user?.nroles ?? {};
  const isAdmin =
    nroles[30]?.includes("ADMIN_ROLE") ||
    nroles[31]?.includes("ADMIN_ROLE") ||
    false;

  if (!isAdmin) {
    return <CommonUserDashboard />;
  }

  return (
    <div className="max-w-6xl space-y-6">
      <UserDashboardWrapper userName={session?.user?.name ?? ""} />
      <AvaldaoPlatformCard language={language} nroles={nroles} />
    </div>
  );
}
