import { useState } from "react";
import { motion } from "framer-motion";
import { format, startOfWeek, addDays } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import AttendanceIndicator from "@/components/molecules/AttendanceIndicator";

const AttendanceGrid = ({ students, attendance, onMarkAttendance, selectedDate = new Date() }) => {
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(selectedDate));
  
  const weekDays = Array.from({ length: 5 }, (_, i) => addDays(currentWeek, i));

  const getAttendanceStatus = (studentId, date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const record = attendance.find(a => 
      a.studentId === studentId && a.date === dateStr
    );
    return record?.status || null;
  };

  const handleStatusChange = (studentId, date, status) => {
    const dateStr = format(date, "yyyy-MM-dd");
    onMarkAttendance(studentId, dateStr, status);
  };

  const navigateWeek = (direction) => {
    const newWeek = addDays(currentWeek, direction * 7);
    setCurrentWeek(newWeek);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-6"
    >
      {/* Week Navigation */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Week of {format(currentWeek, "MMM d, yyyy")}
        </h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigateWeek(-1)}
          >
            <ApperIcon name="ChevronLeft" className="w-4 h-4" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setCurrentWeek(startOfWeek(new Date()))}
          >
            Today
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigateWeek(1)}
          >
            <ApperIcon name="ChevronRight" className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Grid Header */}
      <div className="grid grid-cols-6 gap-4 mb-4">
        <div className="font-medium text-gray-700">Student</div>
        {weekDays.map((date) => (
          <div key={date.toISOString()} className="text-center">
            <div className="font-medium text-gray-700">{format(date, "EEE")}</div>
            <div className="text-sm text-gray-500">{format(date, "M/d")}</div>
          </div>
        ))}
      </div>

      {/* Student Rows */}
      <div className="space-y-3">
        {students.map((student) => (
          <div key={student.Id} className="grid grid-cols-6 gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">
                  {student.firstName[0]}{student.lastName[0]}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {student.firstName} {student.lastName}
                </p>
              </div>
            </div>
            
            {weekDays.map((date) => {
              const status = getAttendanceStatus(student.Id, date);
              
              return (
                <div key={`${student.Id}-${date.toISOString()}`} className="flex justify-center">
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleStatusChange(student.Id, date, "present")}
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                        status === "present"
                          ? "bg-success text-white"
                          : "bg-gray-200 hover:bg-success hover:text-white"
                      }`}
                      title="Present"
                    >
                      <ApperIcon name="Check" className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleStatusChange(student.Id, date, "tardy")}
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                        status === "tardy"
                          ? "bg-warning text-white"
                          : "bg-gray-200 hover:bg-warning hover:text-white"
                      }`}
                      title="Tardy"
                    >
                      <ApperIcon name="Clock" className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleStatusChange(student.Id, date, "absent")}
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                        status === "absent"
                          ? "bg-error text-white"
                          : "bg-gray-200 hover:bg-error hover:text-white"
                      }`}
                      title="Absent"
                    >
                      <ApperIcon name="X" className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default AttendanceGrid;