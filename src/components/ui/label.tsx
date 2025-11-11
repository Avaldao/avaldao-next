import React from "react";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> { 
  required?: boolean
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ children, className, required = false ,...props }, ref) => (
    <label className={`${className ?? ""} block mb-1 text-sm font-medium text-gray-900`} {...props}>
      {children}{required && "*"}
    </label>
  )
);

Label.displayName = "Label";


