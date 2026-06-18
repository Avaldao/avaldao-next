import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getLanguageCookie } from "@/lib/cookies";
import UserDashboardWrapper from "./user-dashboard-wrapper";
import AvaldaoPlatformCard from "./avaldao-platform-card";

export default async function DashboardPage() {
  const [session, language] = await Promise.all([
    getServerSession(authOptions),
    getLanguageCookie(),
  ]);

  const nroles = session?.user?.nroles ?? {};

  return (
    <div className="max-w-6xl space-y-6">
      <UserDashboardWrapper />
      <AvaldaoPlatformCard language={language} nroles={nroles} />
    </div>
  );
}
