export default function Hero() {
  return (
    <section className="py-20 bg-white 
      bg-cover
      bg-no-repeat
      bg-center
      bg-[url('/images/slide-bg1.jpg')]
      min-h-[65vh]
      flex
      ">
      <div className="container mx-auto px-8 flex flex-col justify-center items-start max-w-6xl text-left">
         
        <p className="font-heading text-4xl text-primary mb-4 font-bold leading-11">
          Sumate a la comunidad AvalDAO
        </p>
        <p className="text-lg text-slate-700 mb-12 max-w-2xl">
          Únete a un nuevo tipo de empresa, más abierta y transparente, donde el control lo tienen quienes la usan y contribuyen.
        </p>
        <button className="bg-secondary text-white inline-block px-5 py-2 rounded-full font-medium text-lg select-none cursor-pointer text-heading">
          Sumate
        </button>
      </div>
    </section>
  )
}