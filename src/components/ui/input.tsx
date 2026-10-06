import React, { ReactNode } from "react";
import FieldError from "./field-error";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  /** Colapsa el espacio del error cuando no hay error (con animación). */
  compactError?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, trailing, error, compactError = false, ...props }, ref) => (
    <>
      <div className="relative">
        <input
          type="text"
          ref={ref}
          className={`bg-white border border-gray-200 text-slate-800 text-sm rounded-xl block w-full px-4 py-3
          placeholder-gray-300
          focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400
          focus-visible:outline-none transition-all
          ${error ? "border-red-300 focus:ring-red-300 focus:border-red-300" : ""}
          ${className ?? ""}
          `}
          {...props}
        />
        <div className="absolute top-0 bottom-0 right-0 min-w-[20px] mr-2 flex flex-col justify-center">
          {trailing}
        </div>
      </div>
      <FieldError error={error} compact={compactError} />
    </>
  )
);

Input.displayName = "Input";
