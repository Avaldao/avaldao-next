import { Suspense } from "react";
import GuaranteeFundValue from "./GuaranteeFundValue";

export default function GuaranteeFund() {

  return (
    <div className="bg-linear-to-r from-blue-500 to-purple-600 text-white p-8 rounded-2xl shadow-lg text-center mb-12 max-w-md mx-auto">
      <h3 className="text-2xl font-bold mb-4 font-heading">Fondo de Garantía</h3>
      <div className="text-4xl font-bold font-heading flex flex-row justify-center gap-x-2">
        <div className="min-w-32">
        <Suspense fallback={
          <div className="h-full rounded-md bg-white/60 animate-pulse"></div>
        }>
          <GuaranteeFundValue />
        </Suspense>
          
        </div>
        USD</div>

    </div>
  )
}