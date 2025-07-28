import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className = "", 
  type = "text",
  error = false,
  ...props 
}, ref) => {
  const baseStyles = "w-full px-3 py-2 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    default: "border-gray-300 focus:ring-primary focus:border-primary",
    error: "border-error focus:ring-error focus:border-error"
  };
  
  return (
    <input
      ref={ref}
      type={type}
      className={cn(baseStyles, error ? variants.error : variants.default, className)}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;