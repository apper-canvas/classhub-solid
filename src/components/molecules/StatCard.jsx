import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({ title, value, subtitle, icon, gradient = "from-primary to-secondary" }) => {
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.02 }}
      className="card p-6 bg-gradient-to-br from-white to-gray-50"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-3xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
            {value}
          </p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`w-12 h-12 bg-gradient-to-r ${gradient} rounded-lg flex items-center justify-center`}>
          <ApperIcon name={icon} className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;