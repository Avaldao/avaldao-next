
export const Badge = ({ 
  children, 
  variant = "default", 
  className = ""
}: { 
  children: React.ReactNode; 
  variant?: "default" | "secondary" | "destructive" | "outline" 
  className?: string;
}) => {
  const variantStyles = {
    default: "bg-blue-100 text-blue-800 border border-blue-200",
    secondary: "bg-gray-100 text-gray-800 border border-gray-200",
    destructive: "bg-red-100 text-red-800 border border-red-200",
    outline: "bg-white text-gray-800 border border-gray-300"
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};