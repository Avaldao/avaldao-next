import { AvalState } from "@/types";
import { Award, Clock, FileCheck, ShieldCheck, X } from "lucide-react";

export function AvalStatusChip({ status, variant = "default", className }: { status: number; variant?: "default" | "compact", className?: string }) {
  const getStatusConfig = (status: AvalState) => {
    const configs = {
      [AvalState.SOLICITADO]: {
        label: "Solicitado",
        icon: Clock,
        className: "bg-blue-50 text-blue-700 border border-blue-200",
        compactClassName: "bg-blue-100 text-blue-800"
      },
      [AvalState.RECHAZADO]: {
        label: "Rechazado",
        icon: X, 
        className: "bg-red-50 text-red-700 border border-red-200",
        compactClassName: "bg-red-100 text-red-800"
      },
      [AvalState.ACEPTADO]: {
        label: "Aceptado",
        icon: FileCheck,
        className: "bg-amber-50 text-amber-700 border border-amber-200", 
        compactClassName: "bg-amber-100 text-amber-800"
      },
      [AvalState.VIGENTE]: {
        label: "Vigente",
        icon: ShieldCheck,
        className: "bg-green-50 text-green-700 border border-green-200",
        compactClassName: "bg-green-100 text-green-800"
      },
      [AvalState.FINALIZADO]: {
        label: "Finalizado", 
        icon: Award,
        className: "bg-purple-50 text-purple-700 border border-purple-200",
        compactClassName: "bg-purple-100 text-purple-800"
      }
    };
    return configs[status];
  };

  const statusConfig = getStatusConfig(status);
  const IconComponent = statusConfig.icon;

  if (variant === "compact") {
    return (
      <div className={`${className} inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold ${statusConfig.compactClassName}`}>
        <IconComponent className="w-3 h-3" />
        <span>{statusConfig.label}</span>
      </div>
    );
  }

  return (
    <div className={`${className} inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium border transition-all duration-200 hover:shadow-sm ${statusConfig.className}`}>
      <IconComponent className="w-4 h-4" />
      <span>{statusConfig.label}</span>
    </div>
  );
}