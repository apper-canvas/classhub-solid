import attendanceData from "@/services/mockData/attendance.json";

class AttendanceService {
  constructor() {
    this.attendance = [...attendanceData];
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.attendance];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const record = this.attendance.find(a => a.Id === id);
    if (!record) {
      throw new Error("Attendance record not found");
    }
    return { ...record };
  }

  async create(attendanceData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const maxId = Math.max(...this.attendance.map(a => a.Id), 0);
    const newRecord = {
      Id: maxId + 1,
      ...attendanceData
    };
    
    this.attendance.push(newRecord);
    return { ...newRecord };
  }

  async update(id, attendanceData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = this.attendance.findIndex(a => a.Id === id);
    if (index === -1) {
      throw new Error("Attendance record not found");
    }
    
    this.attendance[index] = { ...this.attendance[index], ...attendanceData };
    return { ...this.attendance[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.attendance.findIndex(a => a.Id === id);
    if (index === -1) {
      throw new Error("Attendance record not found");
    }
    
    this.attendance.splice(index, 1);
    return true;
  }
}

export const attendanceService = new AttendanceService();