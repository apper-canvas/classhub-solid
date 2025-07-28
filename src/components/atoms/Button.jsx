import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  children, 
  className = "", 
  variant = "primary", 
  size = "md", 
  disabled = false,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary hover:bg-blue-700 text-white focus:ring-primary shadow-sm hover:shadow-md",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-700 focus:ring-gray-500",
    accent: "bg-accent hover:bg-amber-600 text-white focus:ring-accent shadow-sm hover:shadow-md",
    success: "bg-success hover:bg-green-700 text-white focus:ring-success shadow-sm hover:shadow-md",
    error: "bg-error hover:bg-red-700 text-white focus:ring-error shadow-sm hover:shadow-md",
    outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus:ring-primary"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };
  
  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;