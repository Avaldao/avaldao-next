import { AvalTable } from "@/components/avaldao/avales/avales-table";
import PageHeader from "@/components/ui/layout/page-header";
import { UnauthenticatedError } from "@/lib/auth/authorization";
import AvalesService from "@/services/avales-service";
import { FileCheck, PlusCircle } from "lucide-react";
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
    <div className="max-w-6xl">
      <PageHeader
        title="Avales"
        description="Gestión de avales en la plataforma"
        icon={<FileCheck className="h-5 w-5" />}
        breadcrumbs={[{ label: "Avales" }]}
        actions={
          <Link
            href="/avales/new"
            className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700"
          >
            <PlusCircle className="h-4 w-4" />
            Nuevo Aval
          </Link>
        }
      />
      <AvalTable avales={avales} />
    </div>
  );
}