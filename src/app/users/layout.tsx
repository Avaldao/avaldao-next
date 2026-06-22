import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { ReactNode } from "react";


export default async function Layout({ children }: { children?: ReactNode }) {
  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr_auto] bg-white">
      <div className="row-start-1">
        <Header />
      </div>

      <div className="row-start-2 bg-white mt-20">
        <div className="container mx-auto p-4 max-w-6xl h-full text-slate-700">
          {children}
        </div>
      </div>
      <div className="row-start-3">
        <Footer />
      </div>
    </div>
  )
}