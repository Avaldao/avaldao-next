import Image from "next/image"
import AvalDaoDiagram from "./avaldao/avaldao-diagram"

export default function Features() {
  const features = [
    {
      title: "Seguridad",
      description: "Las personas y empresas avaladas cuentan con una reputación inmutable, creada por terceras partes de confianza"
    },
    {
      title: "Autonomía",
      description: "Las garantías son contratos autónomos que se ejecutarán sin intermediación a favor de quien otorgó el crédito"
    },
    {
      title: "Transparencia",
      description: "Toda la economía de la organización está a la vista, con información y estadísticas publicadas en tiempo real"
    }
  ]

  const services = [
    {
      img: "/images/inversor.png",
      title: "Quiero invertir",
      description: "¿Quieres que tus inversiones operen rentabilidad al mismo tiempo que ayudas a otras personas a cumplir sus sueños?",
    },
    {
      img: "/images/solicitante.png",
      title: "Quiero un aval",
      description: "¿Tienes un comercio y quieres ampliar tus clientes? ¿Tienes un emprendimiento y necesitas una aval para obtener un crédito comercial?",
    }
  ]

  return (
    <>
      <section className="pt-20 px-4">
        {/* Qué es AvalDAO */}
        <div id="que-es" className="text-center mb-16">
          <h2 className="font-heading text-4xl font-bold text-primary mb-6">Qué es AvalDAO</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto leading-loose">
            AvalDAO es la primera Sociedad de Garantía Recíproca (SGR) descentralizada. Una solución WEB3 que otorga garantías a los individuos y microempresas no bancarizadas o sin historial crediticio, para que puedan acceder a créditos comerciales convenientes.
          </p>
          <div className="bg-secondary inline-block px-6 py-3 rounded-full font-bold text-white text-lg shadow-md">
            Conocer Más
          </div>
        </div>

        {/* Características principales */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-lg text-center   max-w-lg md:max-w-lg  mx-auto">
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
          ">
          <div className="col-span-full">
            <AvalDaoDiagram />
          </div>
          {services.map((service, index) => (
            <div key={index} className="bg-gray-100 text-slate-800 rounded-md shadow-lg">
              <Image
                src={service.img}
                alt={service.title}
                width={500}
                height={500}
                className="w-full max-h-[230px] object-cover rounded-t-md"
              />

              <div className="p-8">
                <h3 className="text-2xl font-semibold font-heading mb-4">{service.title}</h3>
                <p className="mb-6 opacity-90">{service.description}</p>
              </div>

            </div>
          ))}
        </div>
      </section>
    </>
  )
}