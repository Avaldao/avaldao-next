"use client";

import { Suspense } from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import CopyAddress from "@/components/copy-address";
import { shortenAddress } from "@/utils";
import type { UserStatus } from "@/lib/db/models/user-model";
import type { PaginatedResult, UserInfo } from "@/types";
import IPFSUserAvatar from "./ipfs-user-avatar";
import { span } from "framer-motion/client";

interface UsersTabsProps {
  usersByStatus: Record<UserStatus, PaginatedResult<UserInfo>>;
  selectedStatus: UserStatus;
}

const tabs: Array<{ status: UserStatus; label: string }> = [
  { status: "pending", label: "Pending" },
  { status: "active", label: "Active" },
  { status: "rejected", label: "Rejected" },
  { status: "suspended", label: "Suspended" },
];

export default function UsersTabs({ usersByStatus, selectedStatus }: UsersTabsProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedIndex = Math.max(0, tabs.findIndex((tab) => tab.status === selectedStatus));

  const updateSearchParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      params.set(key, value);
    });

    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <TabGroup
      selectedIndex={selectedIndex}
      onChange={(index) => updateSearchParams({ status: tabs[index].status })}
    >
      <TabList className="mb-6 flex flex-wrap gap-2 rounded-2xl ">
        {tabs.map((tab) => (
          <Tab
            key={tab.status}
            className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 
            data-selected:bg-slate-100
            data-selected:text-slate-900 
            data-selected:border-slate-300
              focus:outline-none
              transition duration-200
              
              "
          >
            <span>{tab.label}</span>
            <span className="ml-2 rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-700 data-selected:bg-slate-900 data-selected:text-white">
              {usersByStatus[tab.status]?.totalItems ?? 0}
            </span>
          </Tab>
        ))}
      </TabList>

      <TabPanels>
        {tabs.map((tab) => (
          <TabPanel key={tab.status} className="focus:outline-none min-h-[700px]">
            <UsersTable
              paginatedUsers={usersByStatus[tab.status]}
              emptyLabel={tab.label}
              onPageChange={(page) => updateSearchParams({
                status: tab.status,
                [`${tab.status}Page`]: String(page),
              })}
            />
          </TabPanel>
        ))}
      </TabPanels>
    </TabGroup>
  );
}

function UsersTable({
  paginatedUsers,
  emptyLabel,
  onPageChange,
}: {
  paginatedUsers: PaginatedResult<UserInfo>;
  emptyLabel: string;
  onPageChange: (page: number) => void;
}) {
  const { items: users, page, pageSize, totalItems, totalPages } = paginatedUsers;

  if (users.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
        No hay usuarios con estado {emptyLabel.toLowerCase()}.
      </div>
    );
  }

  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalItems);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-800 shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50 text-left text-sm font-medium text-slate-500">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Address</th>
              <th className="px-4 py-3">Roles</th>
              <th className="px-4 py-3">
                <span className="opacity-0">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 truncate">
                  <div className="flex flex-row items-center gap-x-3">
                    <span>{user.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3 font-mono group">
                  <div className="flex items-center">
                    <span className="select-none">{shortenAddress(user.address)}</span>
                    <div className="invisible opacity-0 transition-all duration-200 ease-in-out group-hover:visible group-hover:opacity-100">
                      <CopyAddress address={user.address} />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="min-w-80">
                    {user.status === "pending" && (
                      user.platformRoles.map((role) => (
                        <RoleCard role={role} key={`${user.id}-${role}`} />
                      ))
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-center items-center">
                    <Link
                      href={`/staff/users/${user.id}`}
                      className="inline-flex items-center justify-center rounded-lg bg-secondary p-2 text-white transition-colors duration-200 hover:bg-secondary-accent"
                      title="Ver detalles del usuario"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-sm text-slate-600">
        <div>
          {startItem}-{endItem} de {totalItems}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </button>
          <span className="min-w-20 text-center">
            Página {page} de {totalPages}
          </span>
          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Siguiente
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function RoleCard({ role }: { role: string }) {
  const roleStr = role.split("_ROLE")[0].replace(/_/g, " ").toLocaleLowerCase();
  let colorClasses = "bg-slate-100 text-slate-700";


  switch (role) {
    case "ADMIN_ROLE":
      colorClasses = "bg-red-100 text-red-700";
      break;
    case "AVALDAO_ROLE":
      colorClasses = "bg-green-100 text-green-700";
      break;
    case "INVERSOR_ROLE":
      colorClasses = "bg-blue-100 text-blue-700";
      break;
    case "SOLICITANTE_ROLE":
      colorClasses = "bg-yellow-100 text-yellow-700";
      break;
    case "COMERCIANTE_ROLE":
      colorClasses = "bg-purple-100 text-purple-700";
      break;
    case "AVALADO_ROLE":
      colorClasses = "bg-indigo-100 text-indigo-700";
      break;
  }


  return (
    <div className={`inline-flex items-center rounded-full ${colorClasses} px-3 py-1 text-xs mx-1 font-medium capitalize`}>
      {roleStr}
    </div>
  );
}