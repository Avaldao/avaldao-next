import { ReactNode } from "react";
import Header from "../Header";
import Footer from "../Footer";

export default function Page({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr_auto]">
      <div className="row-start-1">
        <Header />
      </div>

      <div className="row-start-2 bg-white">
        <div className="container mx-auto p-4 max-w-6xl h-full">
          {children}
        </div>
      </div>
      <div className="row-start-3">
        <Footer />
      </div>
    </div>
  )
}