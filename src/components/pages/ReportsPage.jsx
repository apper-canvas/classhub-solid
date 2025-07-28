import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Chart from "react-apexcharts";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import StatCard from "@/components/molecules/StatCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { studentService } from "@/services/api/studentService";
import { gradeService } from "@/services/api/gradeService";
import { attendanceService } from "@/services/api/attendanceService";
import { assignmentService } from "@/services/api/assignmentService";

const ReportsPage = () => {
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [studentsData, gradesData, attendanceData, assignmentsData] = await Promise.all([
        studentService.getAll(),
        gradeService.getAll(),
        attendanceService.getAll(),
        assignmentService.getAll()
      ]);
      setStudents(studentsData);
      setGrades(gradesData);
      setAttendance(attendanceData);
      setAssignments(assignmentsData);
    } catch (err) {
      setError("Failed to load report data. Please try again.");
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  // Calculate grade distribution
  const gradeDistribution = grades.reduce((acc, grade) => {
    const assignment = assignments.find(a => a.Id === grade.assignmentId);
    if (assignment) {
      const percentage = (grade.score / assignment.totalPoints) * 100;
      let letterGrade = "F";
      if (percentage >= 90) letterGrade = "A";
      else if (percentage >= 80) letterGrade = "B";
      else if (percentage >= 70) letterGrade = "C";
      else if (percentage >= 60) letterGrade = "D";
      
      acc[letterGrade] = (acc[letterGrade] || 0) + 1;
    }
    return acc;
  }, {});

  const gradeChartData = {
    series: Object.values(gradeDistribution),
    options: {
      chart: { type: "donut" },
      labels: Object.keys(gradeDistribution),
      colors: ["#10B981", "#2563EB", "#F59E0B", "#F97316", "#EF4444"],
      legend: { position: "bottom" },
      plotOptions: {
        pie: { donut: { size: "70%" } }
      }
    }
  };

  // Calculate attendance trends (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split("T")[0];
  });

  const attendanceTrends = last7Days.map(date => {
    const dayAttendance = attendance.filter(a => a.date === date);
    const present = dayAttendance.filter(a => a.status === "present").length;
    const absent = dayAttendance.filter(a => a.status === "absent").length;
    const tardy = dayAttendance.filter(a => a.status === "tardy").length;
    
    return { date, present, absent, tardy };
  });

  const attendanceChartData = {
    series: [
      {
        name: "Present",
        data: attendanceTrends.map(d => d.present)
      },
      {
        name: "Absent", 
        data: attendanceTrends.map(d => d.absent)
      },
      {
        name: "Tardy",
        data: attendanceTrends.map(d => d.tardy)
      }
    ],
    options: {
      chart: { type: "bar", stacked: true },
      xaxis: {
        categories: attendanceTrends.map(d => new Date(d.date).toLocaleDateString("en-US", { weekday: "short" }))
      },
      colors: ["#10B981", "#EF4444", "#F59E0B"],
      legend: { position: "top" }
    }
  };

  // Calculate stats
  const totalAttendanceRecords = attendance.length;
  const presentRate = totalAttendanceRecords > 0 
    ? ((attendance.filter(a => a.status === "present").length / totalAttendanceRecords) * 100).toFixed(1)
    : 0;

  const avgGrade = grades.length > 0 
    ? grades.reduce((sum, grade) => {
        const assignment = assignments.find(a => a.Id === grade.assignmentId);
        return sum + (assignment ? (grade.score / assignment.totalPoints) * 100 : 0);
      }, 0) / grades.length
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">Reports</h1>
          <p className="text-gray-600 mt-1">Analytics and insights for your classes</p>
        </div>
        <Button variant="outline">
          <ApperIcon name="Download" className="w-4 h-4 mr-2" />
          Export Reports
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={students.length}
          icon="Users"
          gradient="from-primary to-blue-600"
        />
        <StatCard
          title="Class Average"
          value={`${avgGrade.toFixed(1)}%`}
          icon="TrendingUp"
          gradient="from-success to-green-600"
        />
        <StatCard
          title="Attendance Rate"
          value={`${presentRate}%`}
          icon="CheckCircle"
          gradient="from-secondary to-purple-600"
        />
        <StatCard
          title="Total Assignments"
          value={assignments.length}
          icon="FileText"
          gradient="from-accent to-yellow-600"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grade Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Grade Distribution</h3>
          {Object.keys(gradeDistribution).length > 0 ? (
            <Chart
              options={gradeChartData.options}
              series={gradeChartData.series}
              type="donut"
              height={300}
            />
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No grade data available
            </div>
          )}
        </motion.div>

        {/* Attendance Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Trends (Last 7 Days)</h3>
          {attendanceTrends.some(d => d.present + d.absent + d.tardy > 0) ? (
            <Chart
              options={attendanceChartData.options}
              series={attendanceChartData.series}
              type="bar"
              height={300}
            />
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No attendance data available
            </div>
          )}
        </motion.div>
      </div>

      {/* Student Performance Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Performance Summary</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Student</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Average Grade</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Attendance Rate</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Assignments</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => {
                const studentGrades = grades.filter(g => g.studentId === student.Id);
                const studentAttendance = attendance.filter(a => a.studentId === student.Id);
                
                const avgGrade = studentGrades.length > 0 
                  ? studentGrades.reduce((sum, grade) => {
                      const assignment = assignments.find(a => a.Id === grade.assignmentId);
                      return sum + (assignment ? (grade.score / assignment.totalPoints) * 100 : 0);
                    }, 0) / studentGrades.length
                  : 0;
                
                const attendanceRate = studentAttendance.length > 0
                  ? (studentAttendance.filter(a => a.status === "present").length / studentAttendance.length) * 100
                  : 0;

                return (
                  <tr key={student.Id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-medium">
                            {student.firstName[0]}{student.lastName[0]}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">
                          {student.firstName} {student.lastName}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-900">{avgGrade.toFixed(1)}%</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-900">{attendanceRate.toFixed(1)}%</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-900">{studentGrades.length}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default ReportsPage;