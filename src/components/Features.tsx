import Image from "next/image"
import AvalDaoDiagram from "./avaldao/avaldao-diagram"
import { getLanguageCookie } from "@/lib/cookies"
import { translations } from "@/translations";



export default async function Features() {

  const language = await getLanguageCookie();
  const t = (key: string) => translations[key]?.[language] ?? key;

  const features = [
    {
      title: t("features.security.title"),
      description: t("features.security.description")
    },
    {
      title: t("features.autonomy.title"),
      description: t("features.autonomy.description")
    },
    {
      title: t("features.transparency.title"),
      description: t("features.transparency.description")
    }
  ]

  const services = [
    {
      img: "/images/inversor.png",
      title: t("services.investor.title"),
      description: t("services.investor.description"),
    },
    {
      img: "/images/solicitante.png",
      title: t("services.applicant.title"),
      description: t("services.applicant.description"),
    }
  ]

  return (
    <>
      <section className="pt-20 px-4">
        {/* Qué es AvalDAO */}
        <div id="que-es" className="text-center mb-16">
          <h2 className="font-heading text-4xl font-bold text-primary mb-6">{t("about.avaldao.title")}</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto leading-loose">
            {t("about.avaldao.description")}
          </p>
          <div className="bg-secondary inline-block px-6 py-3 rounded-full font-bold text-white text-lg shadow-md">
            {t("about.avaldao.know-more")}
          </div>
        </div>

        {/* Características principales */}
        <div className="grid md:grid-cols-3 gap-8 mb-20 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-lg md:max-w-lg  mx-auto">
              <h3 className="text-[#7868E5] text-2xl font-bold mb-4 font-heading">{feature.title}</h3>
              <p className="text-lg text-slate-700">{feature.description}</p>
            </div>
          ))}
        </div>


        {/* Servicios */}
      </section>
      <section className="px-4 md:py-20 py-10 
          min-h-[60vh] 
          bg-[url('/images/background.jpg')]
          bg-repeat
          bg-size-[110px_110px]
          
          ">

        <div className="grid md:grid-cols-2 gap-8 border border-white  
          backdrop-blur-xs rounded-md bg-gray-50/20
          md:p-8
          max-w-7xl mx-auto
          ">
          <div className="col-span-full">
            <AvalDaoDiagram language={language} />
          </div>
          {services.map((service, index) => (
            <div key={index} className="bg-gray-100 text-slate-800 rounded-md shadow-lg ">
              <Image
                src={service.img}
                alt={service.title}
                width={500}
                height={500}
                className="w-full max-h-[230px] object-cover rounded-t-md"
              />

              <div className="p-8">
                <h3 className="text-2xl font-semibold font-heading mb-4">{service.title}</h3>
                <p className="mb-6 opacity-90leading-6 min-h-[4.5rem]">{service.description}</p>
              </div>

            </div>
          ))}
        </div>
      </section>
    </>
  )
}