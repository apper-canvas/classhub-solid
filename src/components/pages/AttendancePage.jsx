import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import StatCard from "@/components/molecules/StatCard";
import AttendanceGrid from "@/components/organisms/AttendanceGrid";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { studentService } from "@/services/api/studentService";
import { attendanceService } from "@/services/api/attendanceService";

const AttendancePage = () => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [studentsData, attendanceData] = await Promise.all([
        studentService.getAll(),
        attendanceService.getAll()
      ]);
      setStudents(studentsData);
      setAttendance(attendanceData);
    } catch (err) {
      setError("Failed to load attendance data. Please try again.");
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = async (studentId, date, status) => {
    try {
      const existingRecord = attendance.find(a => 
        a.studentId === studentId && a.date === date
      );

      if (existingRecord) {
        const updatedRecord = await attendanceService.update(existingRecord.Id, {
          ...existingRecord,
          status
        });
        setAttendance(prev => prev.map(a => 
          a.Id === existingRecord.Id ? updatedRecord : a
        ));
      } else {
        const newRecord = await attendanceService.create({
          studentId,
          classId: "default-class", // In a real app, this would be selected
          date,
          status
        });
        setAttendance(prev => [...prev, newRecord]);
      }
      
      toast.success("Attendance updated successfully");
    } catch (err) {
      toast.error("Failed to update attendance");
      console.error("Error updating attendance:", err);
    }
  };

  const handleMarkAllPresent = async () => {
    const today = format(new Date(), "yyyy-MM-dd");
    
    try {
      for (const student of students) {
        await handleMarkAttendance(student.Id, today, "present");
      }
      toast.success("All students marked as present");
    } catch (err) {
      toast.error("Failed to mark all students present");
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  // Calculate stats
  const today = format(new Date(), "yyyy-MM-dd");
  const todayAttendance = attendance.filter(a => a.date === today);
  const presentToday = todayAttendance.filter(a => a.status === "present").length;
  const absentToday = todayAttendance.filter(a => a.status === "absent").length;
  const tardyToday = todayAttendance.filter(a => a.status === "tardy").length;

  const totalAttendanceRecords = attendance.length;
  const overallPresentRate = totalAttendanceRecords > 0 
    ? ((attendance.filter(a => a.status === "present").length / totalAttendanceRecords) * 100).toFixed(1)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">Attendance</h1>
          <p className="text-gray-600 mt-1">Track student attendance and participation</p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <Button variant="outline" onClick={handleMarkAllPresent}>
            <ApperIcon name="CheckCircle" className="w-4 h-4 mr-2" />
            Mark All Present
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Present Today"
          value={presentToday}
          subtitle={`of ${students.length} students`}
          icon="CheckCircle"
          gradient="from-success to-green-600"
        />
        <StatCard
          title="Absent Today"
          value={absentToday}
          icon="XCircle"
          gradient="from-error to-red-600"
        />
        <StatCard
          title="Tardy Today"
          value={tardyToday}
          icon="Clock"
          gradient="from-warning to-yellow-600"
        />
        <StatCard
          title="Overall Rate"
          value={`${overallPresentRate}%`}
          subtitle="Present rate"
          icon="TrendingUp"
          gradient="from-primary to-blue-600"
        />
      </div>

      {/* Date Selector */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Today's Date: {format(new Date(), "EEEE, MMMM d, yyyy")}
          </h3>
          <div className="text-sm text-gray-600">
            Click the status buttons to mark attendance
          </div>
        </div>
      </div>

      {/* Attendance Grid */}
      {students.length > 0 ? (
        <AttendanceGrid
          students={students}
          attendance={attendance}
          onMarkAttendance={handleMarkAttendance}
          selectedDate={selectedDate}
        />
      ) : (
        <Empty
          title="No students found"
          description="Add students to start tracking attendance"
          actionText="Go to Students"
          onAction={() => window.location.href = "/students"}
          icon="Users"
        />
      )}
    </div>
  );
};

export default AttendancePage;