import GuaranteeFund from "./GuaranteeFund";

export default function Dashboard() {
  return (
    <section id="dashboard" className="
    py-20 bg-primary text-white  bg-[url(/images/guarantee-fund-bg.png)]
    bg-cover bg-no-repeat
    relative
    ">

      <div className="bg-[url(/images/guarantee-fund-n.png)]  w-full max-w-[300px] h-[283px] absolute bottom-6/12 right-5 z-0 opacity-50 hidden md:block">

      </div>

      <div className="container mx-auto px-4 z-2 relative max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center font-heading mb-12">Dashboard</h2>
        <p className="text-lg text-gray-100 text-center mb-12 max-w-lg mx-auto">
          AvalDAO es transparente. Puedes conocer el estado de su economía interna en tiempo real.

        </p>

        <GuaranteeFund />

        {/* Tablas */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-50 p-6 rounded-2xl">
            <h4 className="text-xl font-bold mb-4 text-center text-slate-700">Componentes de Garantía</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow">
                <span className="font-medium text-slate-700">RBTC</span>
                <span className="text-gray-600">$</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow">
                <span className="font-medium text-slate-700">DOC</span>
                <span className="text-gray-600">$</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl">
            <h4 className="text-xl font-bold text-gray-700 mb-4 text-center ">Métricas</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white rounded-lg shadow">
                <div className="font-bold text-slate-600">Aliados</div>
              </div>
              <div className="bg-white rounded-lg shadow">
                <div className="font-bold text-slate-600">Inversores</div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}