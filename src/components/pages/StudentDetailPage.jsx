import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import StatCard from "@/components/molecules/StatCard";
import GradeBadge from "@/components/molecules/GradeBadge";
import AttendanceIndicator from "@/components/molecules/AttendanceIndicator";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { studentService } from "@/services/api/studentService";
import { gradeService } from "@/services/api/gradeService";
import { attendanceService } from "@/services/api/attendanceService";
import { assignmentService } from "@/services/api/assignmentService";

const StudentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadStudentData();
  }, [id]);

  const loadStudentData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [studentData, gradesData, attendanceData, assignmentsData] = await Promise.all([
        studentService.getById(parseInt(id)),
        gradeService.getAll(),
        attendanceService.getAll(),
        assignmentService.getAll()
      ]);
      
      setStudent(studentData);
      setGrades(gradesData.filter(g => g.studentId === parseInt(id)));
      setAttendance(attendanceData.filter(a => a.studentId === parseInt(id)));
      setAssignments(assignmentsData);
    } catch (err) {
      setError("Failed to load student data. Please try again.");
      console.error("Error loading student data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadStudentData} />;
  if (!student) return <Error message="Student not found" />;

  // Calculate stats
  const presentCount = attendance.filter(a => a.status === "present").length;
  const absentCount = attendance.filter(a => a.status === "absent").length;
  const tardyCount = attendance.filter(a => a.status === "tardy").length;
  const attendanceRate = attendance.length > 0 
    ? ((presentCount / attendance.length) * 100).toFixed(1)
    : 0;

  const gradeTotal = grades.reduce((sum, grade) => sum + grade.score, 0);
  const assignmentTotal = grades.reduce((sum, grade) => {
    const assignment = assignments.find(a => a.Id === grade.assignmentId);
    return sum + (assignment?.totalPoints || 0);
  }, 0);
  const overallAverage = assignmentTotal > 0 ? ((gradeTotal / assignmentTotal) * 100).toFixed(1) : 0;

  const getLetterGrade = (percentage) => {
    if (percentage >= 90) return "A";
    if (percentage >= 80) return "B";
    if (percentage >= 70) return "C";
    if (percentage >= 60) return "D";
    return "F";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="secondary" onClick={() => navigate("/students")}>
            <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
            Back to Students
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-display">
              {student.firstName} {student.lastName}
            </h1>
            <p className="text-gray-600">{student.email}</p>
          </div>
        </div>
        <Badge variant="primary" className="text-sm">
          {student.grade}
        </Badge>
      </div>

      {/* Student Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6 bg-gradient-to-br from-white to-gray-50"
      >
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
            <span className="text-white text-2xl font-bold">
              {student.firstName[0]}{student.lastName[0]}
            </span>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900">
              {student.firstName} {student.lastName}
            </h2>
            <p className="text-gray-600 mb-2">{student.email}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>Grade: {student.grade}</span>
              <span>•</span>
              <span>Classes: {student.enrolledClasses.length}</span>
              <span>•</span>
              <span>Student ID: {student.Id}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Overall Grade"
          value={getLetterGrade(overallAverage)}
          subtitle={`${overallAverage}% average`}
          icon="GraduationCap"
          gradient="from-primary to-blue-600"
        />
        <StatCard
          title="Attendance Rate"
          value={`${attendanceRate}%`}
          subtitle={`${presentCount} present days`}
          icon="CheckCircle"
          gradient="from-success to-green-600"
        />
        <StatCard
          title="Assignments"
          value={grades.length}
          subtitle="Completed"
          icon="FileText"
          gradient="from-secondary to-purple-600"
        />
        <StatCard
          title="Absent Days"
          value={absentCount}
          subtitle={`${tardyCount} tardy`}
          icon="XCircle"
          gradient="from-error to-red-600"
        />
      </div>

      {/* Grades Section */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Grades</h3>
        {grades.length > 0 ? (
          <div className="space-y-3">
            {grades.slice(0, 10).map((grade) => {
              const assignment = assignments.find(a => a.Id === grade.assignmentId);
              return (
                <div key={grade.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {assignment?.name || "Unknown Assignment"}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {assignment?.type} • Due: {assignment ? new Date(assignment.dueDate).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                  <GradeBadge 
                    score={grade.score} 
                    totalPoints={assignment?.totalPoints || 100} 
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No grades recorded yet</p>
        )}
      </div>

      {/* Attendance Section */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Attendance</h3>
        {attendance.length > 0 ? (
          <div className="space-y-3">
            {attendance.slice(-10).reverse().map((record) => (
              <div key={record.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">
                    {new Date(record.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </p>
                </div>
                <AttendanceIndicator status={record.status} size="lg" />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No attendance records yet</p>
        )}
      </div>
    </div>
  );
};

export default StudentDetailPage;