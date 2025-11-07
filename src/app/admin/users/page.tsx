import { shortenAddress } from "@/app/avales/[id]/page";
import Page from "@/components/layout/page";
import UsersService from "@/services/users-service";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  const users = await new UsersService().getAll();
  console.log(users);

  return (
    <Page>
      <div className="text-2xl text-slate-800 text-heading mb-6">
        Users
      </div>
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
              </th> {/* Actions */}
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td>
                  {user.name}
                </td>
                <td>
                  {user.email}
                </td>
                <td className="font-mono">
                  {shortenAddress(user.address)}
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
    </Page>
  );
}