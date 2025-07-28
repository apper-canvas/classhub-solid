import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import StatCard from "@/components/molecules/StatCard";
import ClassCard from "@/components/organisms/ClassCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { classService } from "@/services/api/classService";

const ClassesPage = () => {
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadClasses();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = classes.filter(cls =>
        cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.period.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredClasses(filtered);
    } else {
      setFilteredClasses(classes);
    }
  }, [classes, searchTerm]);

  const loadClasses = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await classService.getAll();
      setClasses(data);
    } catch (err) {
      setError("Failed to load classes. Please try again.");
      console.error("Error loading classes:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClass = (classData) => {
    toast.info("Edit class functionality would be implemented here");
  };

  const handleDeleteClass = async (classId) => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      try {
        await classService.delete(classId);
        setClasses(prev => prev.filter(c => c.Id !== classId));
        toast.success("Class deleted successfully");
      } catch (err) {
        toast.error("Failed to delete class");
        console.error("Error deleting class:", err);
      }
    }
  };

  const handleViewStudents = (classId) => {
    toast.info("View students functionality would be implemented here");
  };

  const handleAddClass = () => {
    toast.info("Add class functionality would be implemented here");
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadClasses} />;

  const totalStudents = classes.reduce((sum, cls) => sum + (cls.studentIds?.length || 0), 0);
  const subjects = new Set(classes.map(cls => cls.subject)).size;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">Classes</h1>
          <p className="text-gray-600 mt-1">Manage your class schedules and enrollments</p>
        </div>
        <Button onClick={handleAddClass}>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Class
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Classes"
          value={classes.length}
          icon="BookOpen"
          gradient="from-primary to-blue-600"
        />
        <StatCard
          title="Total Students"
          value={totalStudents}
          subtitle="Across all classes"
          icon="Users"
          gradient="from-secondary to-purple-600"
        />
        <StatCard
          title="Subjects"
          value={subjects}
          subtitle="Different subjects"
          icon="Library"
          gradient="from-accent to-yellow-600"
        />
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex-1">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search classes by name, subject, or period..."
          />
        </div>
      </div>

      {/* Classes Grid */}
      {filteredClasses.length === 0 && !loading ? (
        <Empty
          title="No classes found"
          description={searchTerm ? "Try adjusting your search criteria" : "Get started by creating your first class"}
          actionText="Add Class"
          onAction={handleAddClass}
          icon="BookOpen"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((classData) => (
            <ClassCard
              key={classData.Id}
              classData={classData}
              onEdit={handleEditClass}
              onDelete={handleDeleteClass}
              onViewStudents={handleViewStudents}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ClassesPage;