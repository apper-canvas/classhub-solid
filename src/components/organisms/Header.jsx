import { useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import { AuthContext } from "../App";
const Header = ({ onMenuToggle }) => {
  const location = useLocation();
  const [globalSearch, setGlobalSearch] = useState("");
  const { logout } = useContext(AuthContext);
  const { user } = useSelector((state) => state.user);
  
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/" || path === "/students") return "Students";
    if (path === "/classes") return "Classes";
    if (path === "/grades") return "Grades";
    if (path === "/attendance") return "Attendance";
    if (path === "/reports") return "Reports";
    if (path.includes("/students/")) return "Student Details";
    return "ClassHub";
  };

  const handleGlobalSearch = (searchTerm) => {
    setGlobalSearch(searchTerm);
    // TODO: Implement global search functionality
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <Button
              variant="secondary"
              size="sm"
              onClick={onMenuToggle}
              className="p-2"
            >
              <ApperIcon name="Menu" className="w-5 h-5" />
            </Button>
          </div>

          {/* Page Title */}
          <div className="flex-1 min-w-0 lg:flex lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-display">
                {getPageTitle()}
              </h1>
            </div>

            {/* Search Bar - Hidden on mobile */}
            <div className="hidden md:block md:ml-4 md:flex-1 md:max-w-xs">
              <SearchBar 
                onSearch={handleGlobalSearch}
                placeholder="Search students, classes..."
              />
            </div>
          </div>

{/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Button variant="secondary" size="sm" className="p-2 relative">
              <ApperIcon name="Bell" className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full"></span>
            </Button>

            {/* User Menu */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                <ApperIcon name="User" className="w-5 h-5 text-white" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">Teacher</p>
                <p className="text-xs text-gray-500">Welcome back!</p>
              </div>
            </div>

            {/* Logout Button */}
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={handleLogout}
              className="flex items-center space-x-2"
            >
              <ApperIcon name="LogOut" className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;