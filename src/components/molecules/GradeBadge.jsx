import Badge from "@/components/atoms/Badge";

const GradeBadge = ({ score, totalPoints }) => {
  const percentage = totalPoints > 0 ? (score / totalPoints) * 100 : 0;
  
  const getLetterGrade = (percentage) => {
    if (percentage >= 90) return "A";
    if (percentage >= 80) return "B";
    if (percentage >= 70) return "C";
    if (percentage >= 60) return "D";
    return "F";
  };
  
  const letterGrade = getLetterGrade(percentage);
  
  return (
    <div className="flex items-center space-x-2">
      <Badge variant={letterGrade.toLowerCase()}>
        {letterGrade}
      </Badge>
      <span className="text-sm text-gray-600">
        {score}/{totalPoints} ({percentage.toFixed(1)}%)
      </span>
    </div>
  );
};

export default GradeBadge;