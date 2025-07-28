import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import StatCard from "@/components/molecules/StatCard";
import GradeEntry from "@/components/organisms/GradeEntry";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { assignmentService } from "@/services/api/assignmentService";
import { studentService } from "@/services/api/studentService";
import { gradeService } from "@/services/api/gradeService";

const GradesPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [assignmentsData, studentsData, gradesData] = await Promise.all([
        assignmentService.getAll(),
        studentService.getAll(),
        gradeService.getAll()
      ]);
      setAssignments(assignmentsData);
      setStudents(studentsData);
      setGrades(gradesData);
      
      if (assignmentsData.length > 0) {
        setSelectedAssignment(assignmentsData[0]);
      }
    } catch (err) {
      setError("Failed to load grade data. Please try again.");
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGrades = async (gradesToSave) => {
    try {
      for (const gradeData of gradesToSave) {
        const existingGrade = grades.find(g => 
          g.studentId === gradeData.studentId && g.assignmentId === gradeData.assignmentId
        );
        
        if (existingGrade) {
          await gradeService.update(existingGrade.Id, gradeData);
        } else {
          await gradeService.create(gradeData);
        }
      }
      
      // Reload grades to get updated data
      const updatedGrades = await gradeService.getAll();
      setGrades(updatedGrades);
      toast.success("Grades saved successfully");
    } catch (err) {
      toast.error("Failed to save grades");
      console.error("Error saving grades:", err);
    }
  };

  const handleAddAssignment = () => {
    toast.info("Add assignment functionality would be implemented here");
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const totalGrades = grades.length;
  const avgScore = grades.length > 0 
    ? (grades.reduce((sum, grade) => sum + grade.score, 0) / grades.length).toFixed(1)
    : 0;
  const completionRate = assignments.length > 0 
    ? ((totalGrades / (assignments.length * students.length)) * 100).toFixed(1)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">Grades</h1>
          <p className="text-gray-600 mt-1">Manage assignments and student grades</p>
        </div>
        <Button onClick={handleAddAssignment}>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Assignment
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Assignments"
          value={assignments.length}
          icon="FileText"
          gradient="from-primary to-blue-600"
        />
        <StatCard
          title="Average Score"
          value={`${avgScore}%`}
          subtitle="Class average"
          icon="TrendingUp"
          gradient="from-success to-green-600"
        />
        <StatCard
          title="Completion Rate"
          value={`${completionRate}%`}
          subtitle="Graded assignments"
          icon="CheckCircle"
          gradient="from-secondary to-purple-600"
        />
      </div>

      {/* Assignment Selection */}
      {assignments.length > 0 ? (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Assignment</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignments.map((assignment) => (
              <button
                key={assignment.Id}
                onClick={() => setSelectedAssignment(assignment)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedAssignment?.Id === assignment.Id
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-primary/50"
                }`}
              >
                <h4 className="font-medium text-gray-900">{assignment.name}</h4>
                <div className="text-sm text-gray-600 mt-1">
                  <p>{assignment.type} • {assignment.totalPoints} points</p>
                  <p>Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <Empty
          title="No assignments found"
          description="Create your first assignment to start grading"
          actionText="Add Assignment"
          onAction={handleAddAssignment}
          icon="FileText"
        />
      )}

      {/* Grade Entry */}
      {selectedAssignment && students.length > 0 && (
        <GradeEntry
          assignment={selectedAssignment}
          students={students}
          grades={grades}
          onSaveGrades={handleSaveGrades}
        />
      )}
    </div>
  );
};

export default GradesPage;