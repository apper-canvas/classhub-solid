import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import StatCard from "@/components/molecules/StatCard";
import StudentTable from "@/components/organisms/StudentTable";
import StudentModal from "@/components/organisms/StudentModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { studentService } from "@/services/api/studentService";

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = students.filter(student =>
        `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.grade.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students);
    }
  }, [students, searchTerm]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await studentService.getAll();
      setStudents(data);
    } catch (err) {
      setError("Failed to load students. Please try again.");
      console.error("Error loading students:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = () => {
    setEditingStudent(null);
    setIsModalOpen(true);
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  const handleDeleteStudent = async (studentId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await studentService.delete(studentId);
        setStudents(prev => prev.filter(s => s.Id !== studentId));
        toast.success("Student deleted successfully");
      } catch (err) {
        toast.error("Failed to delete student");
        console.error("Error deleting student:", err);
      }
    }
  };

  const handleSaveStudent = async (studentData) => {
    try {
      if (editingStudent) {
        const updatedStudent = await studentService.update(editingStudent.Id, studentData);
        setStudents(prev => prev.map(s => s.Id === editingStudent.Id ? updatedStudent : s));
        toast.success("Student updated successfully");
      } else {
        const newStudent = await studentService.create(studentData);
        setStudents(prev => [...prev, newStudent]);
        toast.success("Student added successfully");
      }
      setIsModalOpen(false);
      setEditingStudent(null);
    } catch (err) {
      toast.error("Failed to save student");
      console.error("Error saving student:", err);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleExport = () => {
    // Simple CSV export
    const headers = ["First Name", "Last Name", "Email", "Grade", "Classes"];
    const csvContent = [
      headers.join(","),
      ...students.map(student => [
        student.firstName,
        student.lastName,
        student.email,
        student.grade,
        student.enrolledClasses.length
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "students.csv";
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Student data exported successfully");
  };

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadStudents} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">Students</h1>
          <p className="text-gray-600 mt-1">Manage your student roster</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button variant="outline" onClick={handleExport}>
            <ApperIcon name="Download" className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleAddStudent}>
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Add Student
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Students"
          value={students.length}
          icon="Users"
          gradient="from-primary to-blue-600"
        />
        <StatCard
          title="Active Classes"
          value={new Set(students.flatMap(s => s.enrolledClasses)).size}
          subtitle="Unique classes"
          icon="BookOpen"
          gradient="from-secondary to-purple-600"
        />
        <StatCard
          title="Average Grade"
          value="B+"
          subtitle="Class average"
          icon="GraduationCap"
          gradient="from-success to-green-600"
        />
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex-1">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search students by name, email, or grade..."
          />
        </div>
      </div>

      {/* Students Table */}
      {filteredStudents.length === 0 && !loading ? (
        <Empty
          title="No students found"
          description={searchTerm ? "Try adjusting your search criteria" : "Get started by adding your first student"}
          actionText="Add Student"
          onAction={handleAddStudent}
          icon="Users"
        />
) : (
        <StudentTable
          students={filteredStudents}
          onEdit={handleEditStudent}
          onDelete={handleDeleteStudent}
          showParentContact={true}
        />
      )}

      {/* Student Modal */}
      <StudentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingStudent(null);
        }}
        onSave={handleSaveStudent}
        student={editingStudent}
      />
    </div>
  );
};

export default StudentsPage;