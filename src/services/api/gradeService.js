import gradesData from "@/services/mockData/grades.json";

class GradeService {
  constructor() {
    this.grades = [...gradesData];
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.grades];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const grade = this.grades.find(g => g.Id === id);
    if (!grade) {
      throw new Error("Grade not found");
    }
    return { ...grade };
  }

  async create(gradeData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const maxId = Math.max(...this.grades.map(g => g.Id), 0);
    const newGrade = {
      Id: maxId + 1,
      ...gradeData
    };
    
    this.grades.push(newGrade);
    return { ...newGrade };
  }

  async update(id, gradeData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = this.grades.findIndex(g => g.Id === id);
    if (index === -1) {
      throw new Error("Grade not found");
    }
    
    this.grades[index] = { ...this.grades[index], ...gradeData };
    return { ...this.grades[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.grades.findIndex(g => g.Id === id);
    if (index === -1) {
      throw new Error("Grade not found");
    }
    
    this.grades.splice(index, 1);
    return true;
  }
}

export const gradeService = new GradeService();