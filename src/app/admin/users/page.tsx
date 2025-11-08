import { shortenAddress } from "@/app/avales/[id]/page";
import Page from "@/components/layout/page";
import UsersService from "@/services/users-service";
import { AlertCircle, ChevronRight } from "lucide-react";
import Link from "next/link";
import IPFSUserAvatar from "./ipfs-user-avatar";
import { Suspense } from "react";
import CopyAddress from "@/components/copy-address";

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  let users;
  let error;
  try {
    users = await new UsersService().getAll();
    /* console.log(users); */
  } catch (err) {
    error = err;
  }

  return (
    <Page>
      <div className="text-2xl text-slate-800 text-heading mb-6">
        Users
      </div>

      {!error && users && (
        <div className="text-slate-800">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Address</th>
                <th>Roles</th>
                <th>
                  <div className="opacity-0">
                    Actions
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="truncate">
                    <div className="flex flex-row gap-x-3 items-center ">
                      <div className="min-w-[45]">
                        <Suspense fallback={<div className="bg-slate-500 w-10 h-10 rounded-full animate-pulse" />}>
                          <IPFSUserAvatar username={user.name} infoCid={user.infoCid} />
                        </Suspense>


                      </div>
                      {user.name}

                    </div>
                  </td>
                  <td>
                    {user.email}
                  </td>
                  <td className="font-mono group">
                    <div className=" flex items-center">

                      <span className="select-none">
                        {shortenAddress(user.address)}
                      </span>
                      <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 ease-in-out">
                        <CopyAddress address={user.address} />
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="min-w-80"></div>
                  </td>
                  <td>
                    <div className="flex justify-center items-center">
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="inline-flex items-center justify-center p-2 bg-secondary hover:bg-secondary-accent text-white rounded-lg transition-colors duration-200"
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
      )}
      {error != undefined && (
        <div className="bg-red-100 text-red-500 rounded-xl p-4 max-w-lg flex gap-x-2 items-center">
          <AlertCircle className="w-15 h-15" />
          No podemos recuperar los usuarios en este momento. Intenta nuevamente más tarde
        </div>
      )}

    </Page>
  );
}