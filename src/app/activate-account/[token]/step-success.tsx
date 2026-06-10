import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";


interface StepSuccessProps {

  stepIndicator: React.ReactNode;
}


export default function StepSuccess({ stepIndicator }: StepSuccessProps) {
  const router = useRouter();
  return (
    <div className="w-full max-w-lg xl:max-w-xl mx-auto flex flex-col gap-4 p-4">
      {/* Progress + Header */}
      <div className="mb-1 mt-10">
        <div className="mb-3 flex items-center gap-4 cursor-pointer invisible" >
          <ArrowLeft className="w-4 h-4 text-slate-600 hover:text-violet-800 transition-colors" />
        </div>
        {stepIndicator}
        <h1 className="text-xl font-bold text-gray-900 leading-snug">
          ¡Cuenta activada con éxito!
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Tu cuenta ha sido activada correctamente. Ahora puedes iniciar sesión y comenzar a usar nuestros servicios.
        </p>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center">
        <Image
          src="/images/account-success.svg"
          alt="Success"
          width={140}
          height={100}
          className="max-w-xl"
        />
      </div>
      <button
        className="w-full bg-violet-600 hover:bg-violet-700 active:scale-[0.98] text-white font-semibold text-sm py-3.5 rounded-2xl 
                     flex items-center justify-center gap-2 transition-all shadow-md shadow-violet-200
                     disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none"

        onClick={() => router.push("/auth/login")}
      >
        Iniciar sesión <ArrowRight className="w-4 h-4" />

      </button>

    </div>
  );
}