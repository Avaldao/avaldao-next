import { AvalTable } from "@/components/avaldao/avales/avales-table";
import Page from "@/components/layout/page";
import AvalesService from "@/services/avales-service";

export const dynamic = 'force-dynamic';

export default async function AvalesPage() {

  const avales = await new AvalesService().getAll();

  return (
    <Page>
      <div className="text-2xl text-slate-800 text-heading mb-6">
        Avales
      </div>
      <div>
        <AvalTable avales={avales} />
      </div>
    </Page>
  );
}