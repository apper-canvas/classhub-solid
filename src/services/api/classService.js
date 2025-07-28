import classesData from "@/services/mockData/classes.json";

class ClassService {
  constructor() {
    this.classes = [...classesData];
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.classes];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const classData = this.classes.find(c => c.Id === id);
    if (!classData) {
      throw new Error("Class not found");
    }
    return { ...classData };
  }

  async create(classData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const maxId = Math.max(...this.classes.map(c => c.Id), 0);
    const newClass = {
      Id: maxId + 1,
      ...classData,
      studentIds: classData.studentIds || []
    };
    
    this.classes.push(newClass);
    return { ...newClass };
  }

  async update(id, classData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = this.classes.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error("Class not found");
    }
    
    this.classes[index] = { ...this.classes[index], ...classData };
    return { ...this.classes[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.classes.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error("Class not found");
    }
    
    this.classes.splice(index, 1);
    return true;
  }
}

export const classService = new ClassService();