import React, { ReactNode } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  leading?: ReactNode,
  trailing?: ReactNode,
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, trailing, error, ...props }, ref) => (
    <>

      <div className="relative">
        <input
          type="text"
          ref={ref}
          className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 
          focus:ring-1 focus:ring-[#292A6D] focus:border-[#292A6D]
          focus-visible:ring-1 focus-visible:ring-[#292A6D] focus-visible:border-[#292A6D]
          focus-visible:outline-none ${className ?? ""}`}
          {...props}
        />


        <div className="absolute top-0 bottom-0 right-0 min-w-[20px] mr-2 flex flex-col justify-center">
          {trailing}
        </div>

      </div>

      <div className="text-sm text-red-500 mt-1 mb-2 ml-1 overflow-hidden transition-all duration-300 min-h-[0.5rem]"
        /* style={{ maxHeight: error ? "1.25rem" : "0" }} */
      >
        {error}
      </div>
    </>
  )
);

Input.displayName = "Input";


