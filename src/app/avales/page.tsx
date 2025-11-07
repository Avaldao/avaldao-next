import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function AvalesPage() {
  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr_auto]">
      {/* Header - primera fila */}
      <div className="row-start-1">
        <Header />
      </div>
      
      {/* Content - segunda fila (ocupa espacio disponible) */}
      <div className="row-start-2 bg-white">
        <div className="container mx-auto p-4 max-w-6xl h-full">
          <div className="text-2xl text-slate-800 text-heading mb-6">
            Avales
          </div>
   
          
        </div>
      </div>
      
      {/* Footer - tercera fila */}
      <div className="row-start-3">
        <Footer />
      </div>
    </div>
  );
}