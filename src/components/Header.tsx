import Image from "next/image";
import WalletAuth from "./wallet-auth";
import AppkitContextProvider from "@/context/appkit-context";

export default function Header() {
  return (
    <header className="bg-white shadow-md border-b py-1">
      <div className="container mx-auto px-6 sm:px-4 py-4 max-w-6xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Image
              src="/images/avaldao.svg"
              alt="AvalDAO Logo"
              width={65}
              height={250}
              className="w-30 sm:w-45 -mt-3"
            />
          </div>

          <div className="flex items-center gap-x-4 sm:gap-x-8">
            <nav className="hidden md:flex space-x-8">
              <a href="#que-es" className="text-gray-600 hover:text-slate-800">Qué es</a>
              <a href="#dashboard" className="text-gray-600 hover:text-slate-800">Dashboard</a>
              <a href="#invertir" className="text-gray-600 hover:text-slate-800">Invertir</a>
              <a href="#aval" className="text-gray-600 hover:text-slate-800">Solicitar Aval</a>
            </nav>
            <AppkitContextProvider>
              <WalletAuth />
            </AppkitContextProvider>
            <button className="md:hidden text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}