"use client";
import { useState } from "react";

interface FieldErrorProps {
  error?: string;
  /** Sin espacio reservado: el error aparece y desaparece con una animación de altura. */
  compact?: boolean;
}

export default function FieldError({ error, compact = false }: FieldErrorProps) {
  // Se recuerda el último error para que el texto no desaparezca antes de terminar de colapsar.
  const [lastError, setLastError] = useState(error);
  if (error && error !== lastError) setLastError(error);

  if (!compact) {
    return (
      <div className="text-sm text-red-500 mt-1 mb-2 ml-1 overflow-hidden transition-all duration-300 min-h-[0.5rem]">
        {error}
      </div>
    );
  }

  return (
    <div
      aria-live="polite"
      className={`grid transition-all duration-300 ease-out ${error ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
    >
      <div className="overflow-hidden">
        <p className="text-sm text-red-500 mt-1 ml-1">{error ?? lastError}</p>
      </div>
    </div>
  );
}
