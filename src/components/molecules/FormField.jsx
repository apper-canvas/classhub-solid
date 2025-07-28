import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";

const FormField = ({ 
  label, 
  error, 
  required = false, 
  children, 
  className = "",
  ...props 
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <Label required={required}>
          {label}
        </Label>
      )}
      {children || <Input error={!!error} {...props} />}
      {error && (
        <p className="text-sm text-error mt-1">{error}</p>
      )}
    </div>
  );
};

export default FormField;