import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import GradeBadge from "@/components/molecules/GradeBadge";

const GradeEntry = ({ assignment, students, grades, onSaveGrades }) => {
  const [gradeData, setGradeData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Initialize grade data with existing grades
    const initialData = {};
    students.forEach(student => {
      const existingGrade = grades.find(g => 
        g.studentId === student.Id && g.assignmentId === assignment.Id
      );
      initialData[student.Id] = existingGrade ? existingGrade.score : "";
    });
    setGradeData(initialData);
  }, [students, grades, assignment]);

  const handleGradeChange = (studentId, score) => {
    setGradeData(prev => ({
      ...prev,
      [studentId]: score
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    const gradesToSave = Object.entries(gradeData)
      .filter(([_, score]) => score !== "")
      .map(([studentId, score]) => ({
        studentId,
        assignmentId: assignment.Id,
        score: parseFloat(score),
        submittedDate: new Date().toISOString()
      }));

    await onSaveGrades(gradesToSave);
    setIsSaving(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{assignment.name}</h3>
          <p className="text-sm text-gray-600">
            Total Points: {assignment.totalPoints} | Due: {new Date(assignment.dueDate).toLocaleDateString()}
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="btn-primary"
        >
          {isSaving ? (
            <>
              <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <ApperIcon name="Save" className="w-4 h-4 mr-2" />
              Save Grades
            </>
          )}
        </Button>
      </div>

      <div className="space-y-3">
        {students.map((student) => {
          const score = gradeData[student.Id] || "";
          const numericScore = parseFloat(score);
          
          return (
            <div key={student.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    min="0"
                    max={assignment.totalPoints}
                    value={score}
                    onChange={(e) => handleGradeChange(student.Id, e.target.value)}
                    placeholder="Score"
                    className="w-20 text-center"
                  />
                  <span className="text-sm text-gray-500">/ {assignment.totalPoints}</span>
                </div>
                
                {score && !isNaN(numericScore) && (
                  <GradeBadge score={numericScore} totalPoints={assignment.totalPoints} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default GradeEntry;