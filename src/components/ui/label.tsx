import React from "react";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> { }

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ children, className, ...props }, ref) => (
    <label className={`${className ?? ""} block mb-1 text-sm font-medium text-gray-900`} {...props}>
      {children}
    </label>
  )
);

Label.displayName = "Label";


