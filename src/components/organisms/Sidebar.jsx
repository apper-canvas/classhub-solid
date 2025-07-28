import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = () => {
  const navigation = [
    { name: "Students", href: "/students", icon: "Users" },
    { name: "Classes", href: "/classes", icon: "BookOpen" },
    { name: "Grades", href: "/grades", icon: "GraduationCap" },
    { name: "Attendance", href: "/attendance", icon: "Calendar" },
    { name: "Reports", href: "/reports", icon: "BarChart3" }
  ];

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center px-6 py-4 border-b border-gray-200">
        <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
          <ApperIcon name="GraduationCap" className="w-6 h-6 text-white" />
        </div>
        <div className="ml-3">
          <h1 className="text-xl font-bold text-gray-900 font-display">ClassHub</h1>
          <p className="text-sm text-gray-500">Student Management</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group ${
                isActive
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100 hover:text-primary"
              }`
            }
          >
            {({ isActive }) => (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center w-full"
              >
                <ApperIcon
                  name={item.icon}
                  className={`w-5 h-5 mr-3 transition-colors ${
                    isActive ? "text-white" : "text-gray-500 group-hover:text-primary"
                  }`}
                />
                {item.name}
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="px-4 py-4 border-t border-gray-200">
        <div className="flex items-center px-4 py-2 text-sm text-gray-600">
          <ApperIcon name="Settings" className="w-4 h-4 mr-2" />
          Settings
        </div>
      </div>
    </div>
  );
};

export default Sidebar;