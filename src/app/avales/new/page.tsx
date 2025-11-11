import Page from "@/components/layout/page";
import AvalFormWrapper from "./aval-form-wrapper";

export const dynamic = 'force-dynamic';

export default async function AvalesPage() {

  return (
    <Page>
      <div className="text-2xl text-slate-800 text-heading mt-1  mb-6 flex space-between">
        Nuevo Aval
      </div>
      <AvalFormWrapper avaldaoAddress={process.env.USER_AVALDAO_ADDRESS!} />

    </Page>
  );
}