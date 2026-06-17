import { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import StaffSidebar from "@/components/ui/layout/staff-sidebar";
import { getLanguageCookie } from "@/lib/cookies";


export default async function StaffLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  const language = await getLanguageCookie();
  const userName = session?.user?.name ?? undefined;  
  const nroles = session?.user?.nroles ?? [];

  return (
    <>
      <div className="min-h-[75px] bg-white">
      </div>
      <Header />
      <div className="flex min-h-[calc(100vh-75px)] bg-white">
        <StaffSidebar userName={userName} nroles={nroles} language={language} />
        <main className="flex-1 overflow-auto scroll-smooth bg-white p-4 text-slate-700">{children}</main>
      </div>
      <Footer />
    </>
  );
}


