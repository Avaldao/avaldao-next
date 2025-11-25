import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLTextAreaElement> {}

export const TextArea = React.forwardRef<HTMLTextAreaElement, InputProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={`bg-gray-50 border border-gray-300 text-slate-800 text-sm rounded-lg block w-full p-2.5 
                focus:ring-1 focus:ring-[#292A6D] focus:border-[#292A6D]
                focus-visible:ring-1 focus-visible:ring-[#292A6D] focus-visible:border-[#292A6D]
                focus-visible:outline-none ${className ?? ""}`}
      {...props}
    />
  )
);

TextArea.displayName = "TextArea";