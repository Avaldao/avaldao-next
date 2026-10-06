import PageHeader from "@/components/ui/layout/page-header";
import UsersService from "@/services/users-service";
import { AlertCircle, Users } from "lucide-react";
import { handleError } from "@/lib/auth/page-guards";
import type { UserStatus } from "@/lib/db/models/user-model";
import type { PaginatedResult, UserInfo } from "@/types";
import UsersTabs from "./users-tabs";
import { getLanguage } from "@/lib/cookies";
import { createT } from "@/translations";

export const dynamic = 'force-dynamic';

const userStatuses: UserStatus[] = ["active", "pending", "rejected", "suspended"];
const defaultStatus: UserStatus = "active";
const defaultPageSize = 50;

function parsePageParam(value: string | string[] | undefined) {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const page = Number(rawValue);

  if (!Number.isFinite(page) || page < 1) {
    return 1;
  }

  return Math.floor(page);
}

/* First check roles. Necesita ser un admin para ver todos los usarios de la plataforma */
export default async function UsersPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const language = await getLanguage();
  const t = createT(language);
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const rawStatus = resolvedSearchParams.status;
  const selectedStatus = userStatuses.includes(rawStatus as UserStatus)
    ? rawStatus as UserStatus
    : defaultStatus;

  let usersByStatus: Record<UserStatus, PaginatedResult<UserInfo>> | undefined;

  try {
    const usersService = new UsersService();
    const users = await Promise.all(
      userStatuses.map(async (status) => ([
        status,
        await usersService.getAll({
          status,
          page: parsePageParam(resolvedSearchParams[`${status}Page`]),
          pageSize: defaultPageSize,
        })
      ] as const))
    );

    usersByStatus = Object.fromEntries(users) as Record<UserStatus, PaginatedResult<UserInfo>>;
  } catch (err) {
    handleError(err);
  }


  return (
    <div className="max-w-6xl">
      <PageHeader
        title={t("staff.users.title")}
        description={t("staff.users.description")}
        icon={<Users className="h-5 w-5" />}
        breadcrumbs={[{ label: t("staff.users.title") }]}
      />

      {usersByStatus && (
        <UsersTabs usersByStatus={usersByStatus} selectedStatus={selectedStatus} language={language} />
      )}
      {!usersByStatus && (
        <div className="bg-red-100 text-red-500 rounded-xl p-4 max-w-lg flex gap-x-2 items-center">
          <AlertCircle className="w-15 h-15" />
          {t("staff.users.load-error")}
        </div>
      )}
    </div>
  );
}