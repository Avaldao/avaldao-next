import Page from "@/components/layout/page";
import AvalesService from "@/services/avales-service";
import AvalForm from "./aval-form";
export const dynamic = 'force-dynamic';

export default async function AvalesPage() {

  return (
    <Page>
      <div className="text-2xl text-slate-800 text-heading mt-1  mb-6 flex space-between">
        Nuevo Aval
      </div>
      <div className="mb-15">
        <AvalForm />
      </div>

    </Page>
  );
}