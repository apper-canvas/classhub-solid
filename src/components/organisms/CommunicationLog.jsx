import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { format } from "date-fns";

const CommunicationLog = ({ communications, contactName }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAll, setShowAll] = useState(false);

  if (!communications || communications.length === 0) {
    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center text-gray-500 text-sm">
          <ApperIcon name="MessageSquare" size={16} className="mr-2" />
          No communications logged yet
        </div>
      </div>
    );
  }

  const displayedCommunications = showAll ? communications : communications.slice(0, 3);

  const getTypeIcon = (type) => {
    const icons = {
      "Email": "Mail",
      "Phone Call": "Phone",
      "Text Message": "MessageCircle",
      "In-Person Meeting": "Users",
      "Video Call": "Video",
      "Letter/Note": "FileText",
      "Other": "MessageSquare"
    };
    return icons[type] || "MessageSquare";
  };

  const getTypeColor = (type) => {
    const colors = {
      "Email": "text-blue-600 bg-blue-100",
      "Phone Call": "text-green-600 bg-green-100",
      "Text Message": "text-purple-600 bg-purple-100",
      "In-Person Meeting": "text-orange-600 bg-orange-100",
      "Video Call": "text-indigo-600 bg-indigo-100",
      "Letter/Note": "text-gray-600 bg-gray-100",
      "Other": "text-gray-600 bg-gray-100"
    };
    return colors[type] || "text-gray-600 bg-gray-100";
  };

  return (
    <div className="mt-6 border-t pt-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-medium text-gray-900">
          Communication Log ({communications.length})
        </h4>
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          variant="ghost"
          size="sm"
        >
          <ApperIcon 
            name={isExpanded ? "ChevronUp" : "ChevronDown"} 
            size={16} 
          />
        </Button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            {displayedCommunications.map((comm) => (
              <motion.div
                key={comm.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50 rounded-lg p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-1.5 rounded-full ${getTypeColor(comm.type)}`}>
                        <ApperIcon 
                          name={getTypeIcon(comm.type)} 
                          size={14} 
                        />
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900">
                          {comm.subject}
                        </h5>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>{comm.type}</span>
                          <span>•</span>
                          <span>
                            {format(new Date(comm.timestamp), "MMM d, yyyy 'at' h:mm a")}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {comm.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}

            {communications.length > 3 && (
              <div className="text-center">
                <Button
                  onClick={() => setShowAll(!showAll)}
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:text-primary/80"
                >
                  {showAll ? (
                    <>
                      <ApperIcon name="ChevronUp" size={16} className="mr-1" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ApperIcon name="ChevronDown" size={16} className="mr-1" />
                      Show {communications.length - 3} More
                    </>
                  )}
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommunicationLog;