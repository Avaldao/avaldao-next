import { useSession } from "next-auth/react";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { CheckCircle2, UserIcon, Settings, LogOut, LayoutDashboard } from "lucide-react";
import Image from "next/image";
import { useAppKit, useAppKitAccount, useAppKitNetwork, useDisconnect, useWalletInfo } from "@reown/appkit/react";
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from "next-auth/react";
import Link from "next/link";
import { networks } from "@/blockchain/contracts";
import { Badge } from "./ui/badge";

interface AccountDropdownProps {
  address: string;
}

function formatHash(input: string) {
  return `${input.slice(0, 6)}...${input.slice(-4)}`;
}

export function AccountDropdown({ address }: { address: string }) {
  const { data: session, status } = useSession();
  const { open: openAppkit } = useAppKit();
  const { isConnected, embeddedWalletInfo } = useAppKitAccount();
  const { chainId: connectedChainId } = useAppKitNetwork();
  const walletInfo = useWalletInfo();
  const { disconnect } = useDisconnect();

  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    signOut({ callbackUrl: "/" });
    await disconnect();
    router.push("/");
  };

  const userInitial = session?.user?.name?.substring(0, 1)?.toUpperCase() || "U";

  console.log(walletInfo, connectedChainId);

  return (
    <Menu>
      <MenuButton
        onDoubleClick={() => openAppkit()}
        className={`
          px-4 py-2 rounded-lg font-medium transition-all duration-300 min-w-[140px]
          flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white 
          shadow-sm hover:shadow-md
        `}
      >
        <>
          <CheckCircle2 className="w-4 h-4" />
          {formatHash(address)}
        </>
      </MenuButton>

      <MenuItems
        anchor="bottom end"
        className={`
          bg-white min-w-80 rounded-md shadow-xl border border-gray-200 z-50 
          overflow-hidden mt-2
        `}
      >
        {/* User Info Section */}
        <div className="border-b border-gray-100 pb-3 p-4 mb-1 bg-gray-50">
          <div className="flex items-center space-x-3">
            {session?.user.avatar ? (
              <Image
                width={150}
                height={150}
                src={session?.user.avatar}
                alt=""
                className="rounded-full shadow-sm w-15 h-15 aspect-square object-cover"
              />

            ) : (
              <div className="flex bg-emerald-500 rounded-full w-15 h-15 text-white justify-center items-center font-bold text-xl">
                {userInitial}
              </div>
            )}
            <div className="flex flex-col">
              <div className="text-sm font-semibold text-gray-900">
                {session?.user?.name || 'User'}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {session?.user?.email || `${formatHash(address)}@wallet`}
              </div>


              {/* Los roles dependen de la cadena a la que se haya conectado el usuario y a la cfg de red
                si cambia de red, tengo que actualizar los roles, lo cual se hace en el callback de next-auth, pero para eso necesito saber a qué red se ha conectado el usuario, lo cual no sé si es posible sin que el usuario vuelva a loguearse o refresque la página, porque la información de la wallet se obtiene después del login, entonces no sé si puedo actualizar los roles dinámicamente al cambiar de red sin que el usuario tenga que hacer algo para refrescar la sesión.
                La alternativa es que los popule, pero de forma distinta


                quiero mostrar un badge con la network actual
                connectedChainId 

              */}
              {connectedChainId && (
                <Badge variant="outline" className="text-xs mt-1 w-fit">
                  <div className="text-xs text-emerald-600 font-medium w-fit">
                    {networks[Number(connectedChainId)]?.name || `Chain ${connectedChainId}`}
                  </div>
                </Badge>
              )}






              {session?.user?.roles && session.user.roles.length > 0 && (
                <div className="text-xs text-emerald-600 font-medium mt-1 max-w-xs flex gap-x-1 gap-y-1 flex-wrap">
                  {session.user.roles.map(role => (
                    <div key={role} className="text-primary px-1 py-1 rounded-2xl select-none">{role.split("_")[0]}</div>
                  ))}
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Navigation Links */}
        {pathname !== "/dashboard" && (
          <MenuItem>
            <Link
              href="/dashboard"
              className="flex items-center hover:bg-emerald-400 hover:text-white transition duration-300 ease-in-out p-3 cursor-pointer text-sm text-gray-700"
            >
              <LayoutDashboard className="w-4 h-4 mr-3" />
              Dashboard
            </Link>
          </MenuItem>
        )}

        <MenuItem>
          <Link
            href="/user/profile"
            className="flex items-center hover:bg-emerald-400 hover:text-white transition duration-300 ease-in-out p-3 cursor-pointer text-sm text-gray-700"
          >
            <UserIcon className="w-4 h-4 mr-3" />
            Profile
          </Link>
        </MenuItem>

        <MenuItem>
          <Link
            href="/settings"
            className="flex items-center hover:bg-emerald-400 hover:text-white transition duration-300 ease-in-out p-3 cursor-pointer text-sm text-gray-700"
          >
            <Settings className="w-4 h-4 mr-3" />
            Settings
          </Link>
        </MenuItem>



        {/* Divider */}
        <div className="border-t border-gray-100 my-1" />

        {/* Sign Out */}
        <MenuItem>
          <button
            onClick={handleSignOut}
            className="flex items-center w-full hover:bg-emerald-400 hover:text-white transition duration-300 ease-in-out p-3 cursor-pointer text-sm text-gray-700"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Sign Out
          </button>
        </MenuItem>
      </MenuItems>
    </Menu >
  );
}