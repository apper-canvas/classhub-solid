import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const MobileSidebar = ({ onClose }) => {
  const navigation = [
    { name: "Students", href: "/students", icon: "Users" },
    { name: "Classes", href: "/classes", icon: "BookOpen" },
    { name: "Grades", href: "/grades", icon: "GraduationCap" },
    { name: "Attendance", href: "/attendance", icon: "Calendar" },
    { name: "Reports", href: "/reports", icon: "BarChart3" }
  ];

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
      />

      {/* Sidebar */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl lg:hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="GraduationCap" className="w-6 h-6 text-white" />
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-bold text-gray-900 font-display">ClassHub</h1>
              <p className="text-sm text-gray-500">Student Management</p>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={onClose} className="p-2">
            <ApperIcon name="X" className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group ${
                  isActive
                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100 hover:text-primary"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <ApperIcon
                    name={item.icon}
                    className={`w-5 h-5 mr-3 transition-colors ${
                      isActive ? "text-white" : "text-gray-500 group-hover:text-primary"
                    }`}
                  />
                  {item.name}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </motion.div>
    </>
  );
};

export default MobileSidebar;