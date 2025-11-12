import Page from "@/components/layout/page";
import AvalesService from "@/services/avales-service";

export default async function AvalesPage() {
  const avales = await new AvalesService().getAvales();
/*   console.log(avales) */
  return (
    <Page>
      <div className="text-xl mb-5">
        Avales encontrados: <span className="font-bold">{avales.length}</span>

      </div>

      {avales?.map(a => (
        <div key={a._id}>
          {a.proyecto}
        </div>
      ))}
    </Page>
  )
}