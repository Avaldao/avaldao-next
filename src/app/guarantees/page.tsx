import { AvalTable } from "@/components/avaldao/avales/avales-table";
import { UnauthenticatedError } from "@/lib/auth/authorization";
import AvalesService from "@/services/avales-service";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function GuaranteesPage() {
  let avales;
  try {
    avales = await (new AvalesService()).getAvales();

  } catch (error) {
    if (error instanceof UnauthenticatedError) {
      redirect("/");
    }

  }

  return (
    <div className="max-w-8xl pt-6 pl-10">
      <div className="mt-2 mb-6 flex flex-row justify-between items-center max-w-7xl mx-auto">
        <div className="text-2xl text-slate-800 text-heading ">
          Avales
        </div>
        <Link href={"/avales/new"}>
          <div className="px-4 py-2 rounded-lg font-medium transition-all duration-300 min-w-[90px]
          flex items-center justify-center gap-2 bg-success text-white hover:bg-success-accent text-sm">
            <PlusCircle className="w-4 h-4" />
            Nuevo Aval
          </div>
        </Link>
      </div>
      <div>
        <AvalTable avales={avales} />
      </div>
    </div>
  );
}