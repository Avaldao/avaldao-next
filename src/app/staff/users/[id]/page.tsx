import { shortenAddress } from "@/utils";
import CopyAddress from "@/components/copy-address";
import PageHeader from "@/components/ui/layout/page-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requireRoles } from "@/lib/auth/authorization";
import { handleError } from "@/lib/auth/page-guards";
import UsersService from "@/services/users-service";
import { ShieldCheck, UserIcon } from "lucide-react";
import Image from "next/image";
import { networks, NRoles } from "@/components/ui/layout/network-roles";

interface UersDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function UserDetailsPage({ params }: UersDetailsPageProps) {
  const { id } = await params;

  try {
    await requireRoles(["ADMIN_ROLE", "AVALDAO_ROLE"]);
  } catch (err) {
    handleError(err);
  }
  const user = await new UsersService().getUser(id, { resolveInfoCid: true });

  if (!user) {
    return (
      <div> User not found</div>
    )
  }

  return (
    <div className="max-w-3xl pb-20">
      <PageHeader
        title={user.name}
        description={user.email}
        icon={<UserIcon className="h-5 w-5" />}
        breadcrumbs={[{ label: "Usuarios", href: "/staff/users" }, { label: user.name }]}
      />
      <div>
        {user.avatar && (
          <>
            <Label htmlFor="avatar">Avatar</Label>
            <div className="mb-3 flex justify-center md:justify-start">
              <Image
                src={user.avatar}
                alt="User avatar"
                width={150}
                height={150}
                className={`w-40 h-40 rounded-full shadow-sm object-cover object-center border border-gray-200 md:ml-3`}
              />
            </div>
          </>
        )}

        <div>
          <Label htmlFor="name">Nombre</Label>
          <Input
            id="name"
            readOnly
            value={user.name}
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            readOnly
            value={user.email}
          />
        </div>
        <div>
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            readOnly
            value={user.website}
          />
        </div>
        <div>
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            readOnly
            value={shortenAddress(user.address)}
            className="pr-12"
            trailing={<CopyAddress address={user.address} className="" />}
          />
        </div>
        <div>
          <Label htmlFor="name">Roles</Label>
          <div className="mt-2 divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white">
            {networks.map((network) => {
              const networkRoles = (user.nroles as NRoles)?.[network.id as "30" | "31"] ?? [];
              return (
                <div key={network.id} className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:gap-4">
                  <div className="flex items-center gap-2 sm:w-48 shrink-0">
                    <span className={`h-2 w-2 rounded-full ${network.dotClassName}`} />
                    <span className="text-sm font-medium text-gray-700">{network.name}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {networkRoles.length ? (
                      networkRoles.map((role) => (
                        <span
                          key={role}
                          className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 px-2 py-0.5 text-sm text-gray-800"
                        >
                          <ShieldCheck className="h-3.5 w-3.5 text-gray-500" />
                          {role.replace(/_ROLE$/, "")}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm italic text-gray-400">Sin roles en esta red</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  )
}