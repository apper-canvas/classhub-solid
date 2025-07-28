import ApperIcon from "@/components/ApperIcon";

const AttendanceIndicator = ({ status, size = "sm" }) => {
  const config = {
    present: {
      color: "text-success",
      bg: "bg-success/10",
      icon: "CheckCircle"
    },
    absent: {
      color: "text-error",
      bg: "bg-error/10", 
      icon: "XCircle"
    },
    tardy: {
      color: "text-warning",
      bg: "bg-warning/10",
      icon: "Clock"
    }
  };
  
  const statusConfig = config[status] || config.absent;
  const sizeClass = size === "lg" ? "w-8 h-8" : "w-6 h-6";
  const iconSize = size === "lg" ? "w-5 h-5" : "w-4 h-4";
  
  return (
    <div 
      className={`${sizeClass} ${statusConfig.bg} rounded-full flex items-center justify-center`}
      title={status.charAt(0).toUpperCase() + status.slice(1)}
    >
      <ApperIcon 
        name={statusConfig.icon} 
        className={`${iconSize} ${statusConfig.color}`} 
      />
    </div>
  );
};

export default AttendanceIndicator;