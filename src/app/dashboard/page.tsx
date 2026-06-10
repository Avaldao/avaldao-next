import Footer from "@/components/Footer";
import Header from "@/components/Header";

import UserDashboardWrapper from "./user-dashboard-wrapper";


export default function DashboardPage() {
  return (
    <div className="min-h-screen grid grid-rows-[75px_1fr_auto] bg-linear-to-br from-blue-50 to-indigo-100">
      <Header />

      <div /> {/* espacio para el header fixed */}

      <div className="bg-white p-10 ">

        <main className=" container mx-auto max-w-7xl">
          
            <UserDashboardWrapper />
          
        </main>
      </div>

      <Footer />
    </div>
  );
}