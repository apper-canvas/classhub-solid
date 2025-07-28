import { toast } from 'react-toastify';

class AttendanceService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'attendance_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "studentId_c" } },
          { field: { Name: "classId_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "status_c" } }
        ],
        orderBy: [{ fieldName: "date_c", sorttype: "DESC" }]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching attendance records:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error fetching attendance records:", error.message);
        toast.error("Failed to fetch attendance records");
      }
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "studentId_c" } },
          { field: { Name: "classId_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "status_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching attendance record with ID ${id}:`, error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error(`Error fetching attendance record with ID ${id}:`, error.message);
        toast.error("Failed to fetch attendance record");
      }
      return null;
    }
  }

  async create(attendanceData) {
    try {
      const params = {
        records: [{
          Name: attendanceData.Name || `Attendance ${attendanceData.date_c}`,
          studentId_c: parseInt(attendanceData.studentId_c?.Id || attendanceData.studentId_c),
          classId_c: parseInt(attendanceData.classId_c?.Id || attendanceData.classId_c),
          date_c: attendanceData.date_c,
          status_c: attendanceData.status_c
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} attendance records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success("Attendance record created successfully");
          return successfulRecords[0].data;
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating attendance record:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error creating attendance record:", error.message);
        toast.error("Failed to create attendance record");
      }
      return null;
    }
  }

  async update(id, attendanceData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: attendanceData.Name || `Attendance ${attendanceData.date_c}`,
          studentId_c: parseInt(attendanceData.studentId_c?.Id || attendanceData.studentId_c),
          classId_c: parseInt(attendanceData.classId_c?.Id || attendanceData.classId_c),
          date_c: attendanceData.date_c,
          status_c: attendanceData.status_c
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} attendance records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          toast.success("Attendance record updated successfully");
          return successfulUpdates[0].data;
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating attendance record:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error updating attendance record:", error.message);
        toast.error("Failed to update attendance record");
      }
      return null;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} attendance records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          toast.success("Attendance record deleted successfully");
          return true;
        }
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting attendance record:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error deleting attendance record:", error.message);
        toast.error("Failed to delete attendance record");
      }
      return false;
    }
  }
}

export const attendanceService = new AttendanceService();