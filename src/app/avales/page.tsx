import { AvalTable } from "@/components/avaldao/avales/avales-table";
import Page from "@/components/layout/page";
import AvalesService from "@/services/avales-service";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function AvalesPage() {

  const avales = await new AvalesService().getAll();

  return (
    <Page>
      <div className="mt-2 mb-6 flex flex-row justify-between items-center">
        <div className="text-2xl text-slate-800 text-heading ">
          Avales
        </div>
        <Link href={"/avales/new"}>
          <div className="px-4 py-2 rounded-lg font-medium transition-all duration-300 min-w-[90px]
          flex items-center justify-center gap-2 bg-success text-white hover:bg-success-accent text-sm">
            <PlusCircle className="w-4 h-4"/>
            Nuevo Aval
          </div>
        </Link>
      </div>
      <div>
        <AvalTable avales={avales} />
      </div>
    </Page>
  );
}