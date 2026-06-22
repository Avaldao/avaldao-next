import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";


interface StepSubmittingProps {

  stepIndicator: React.ReactNode;
}


export default function StepSubmitting({ stepIndicator }: StepSubmittingProps) {
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
          Activando tu cuenta
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Estamos activando tu cuenta. Esto puede tardar unos segundos, por favor no cierres esta ventana ni actualices la página.
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <div className="h-20 w-20 animate-spin rounded-full border-5 border-slate-200 border-t-violet-600"></div>
      </div>

      {/* This button is just only used to keep consistency */}
      <button
        className="invisible w-full bg-violet-600 hover:bg-violet-700 active:scale-[0.98] text-white font-semibold text-sm py-3.5 rounded-2xl 
                     flex items-center justify-center gap-2 transition-all shadow-md shadow-violet-200
                     disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
      >
        No
      </button>

    </div>
  );
}