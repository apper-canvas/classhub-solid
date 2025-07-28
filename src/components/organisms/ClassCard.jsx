import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

const ClassCard = ({ classData, onEdit, onDelete, onViewStudents }) => {
  const studentCount = classData.studentIds?.length || 0;
  
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className="card p-6 bg-gradient-to-br from-white to-gray-50"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {classData.name}
          </h3>
          <p className="text-gray-600 text-sm mb-2">{classData.subject}</p>
          <Badge variant="primary" className="text-xs">
            Period {classData.period}
          </Badge>
        </div>
        <div className="w-12 h-12 bg-gradient-to-r from-secondary to-primary rounded-lg flex items-center justify-center">
          <ApperIcon name="BookOpen" className="w-6 h-6 text-white" />
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <ApperIcon name="Users" className="w-4 h-4 mr-1" />
          {studentCount} student{studentCount !== 1 ? "s" : ""}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewStudents(classData.Id)}
        >
          <ApperIcon name="Users" className="w-4 h-4 mr-2" />
          View Students
        </Button>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onEdit(classData)}
          >
            <ApperIcon name="Edit" className="w-4 h-4" />
          </Button>
          <Button
            variant="error"
            size="sm"
            onClick={() => onDelete(classData.Id)}
          >
            <ApperIcon name="Trash2" className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ClassCard;