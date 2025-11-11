import Page from "@/components/layout/page";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import UsersService from "@/services/users-service";
import { div } from "framer-motion/client";
import Image from "next/image";

interface UersDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function UserDetailsPage({ params }: UersDetailsPageProps) {
  const { id } = await params;
  const user = await new UsersService().getUser(id, { resolveInfoCid: true });

  if (!user) {
    return (
      <div> User not found</div>
    )
  }

  return (
    <Page>
      <div className="pb-20">
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
            value={user.address}
          />
        </div>
        <div>
          <Label htmlFor="name">Roles</Label>
          <div className="flex gap-x-2 gap-y-2 mt-2">
            {user.roles.length == 0 && (
              <div className="italic">
                No se encontraron roles asociados a este usuario
              </div>
            )}
            {user.roles?.map(role => {
              return (
                <div className="bg-secondary text-white px-3 py-1 rounded-2xl select-none">
                  {role.split("_")[0]}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Page>
  )
}