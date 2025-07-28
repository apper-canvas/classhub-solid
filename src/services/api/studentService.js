import { toast } from 'react-toastify';

class StudentService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'student_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "firstName_c" } },
          { field: { Name: "lastName_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "grade_c" } },
          { field: { Name: "enrolledClasses_c" } },
          { field: { Name: "createdAt_c" } }
        ],
        orderBy: [{ fieldName: "Name", sorttype: "ASC" }]
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
        console.error("Error fetching students:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error fetching students:", error.message);
        toast.error("Failed to fetch students");
      }
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "firstName_c" } },
          { field: { Name: "lastName_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "grade_c" } },
          { field: { Name: "enrolledClasses_c" } },
          { field: { Name: "createdAt_c" } }
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
        console.error(`Error fetching student with ID ${id}:`, error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error(`Error fetching student with ID ${id}:`, error.message);
        toast.error("Failed to fetch student");
      }
      return null;
    }
  }

  async create(studentData) {
    try {
      const params = {
        records: [{
          Name: studentData.Name || `${studentData.firstName_c} ${studentData.lastName_c}`,
          firstName_c: studentData.firstName_c,
          lastName_c: studentData.lastName_c,
          email_c: studentData.email_c,
          grade_c: studentData.grade_c,
          enrolledClasses_c: studentData.enrolledClasses_c,
          createdAt_c: new Date().toISOString()
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
          console.error(`Failed to create ${failedRecords.length} student records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success("Student created successfully");
          return successfulRecords[0].data;
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating student:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error creating student:", error.message);
        toast.error("Failed to create student");
      }
      return null;
    }
  }

  async update(id, studentData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: studentData.Name || `${studentData.firstName_c} ${studentData.lastName_c}`,
          firstName_c: studentData.firstName_c,
          lastName_c: studentData.lastName_c,
          email_c: studentData.email_c,
          grade_c: studentData.grade_c,
          enrolledClasses_c: studentData.enrolledClasses_c
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
          console.error(`Failed to update ${failedUpdates.length} student records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          toast.success("Student updated successfully");
          return successfulUpdates[0].data;
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating student:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error updating student:", error.message);
        toast.error("Failed to update student");
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
          console.error(`Failed to delete ${failedDeletions.length} student records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          toast.success("Student deleted successfully");
          return true;
        }
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting student:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error deleting student:", error.message);
        toast.error("Failed to delete student");
      }
      return false;
    }
  }
}

export const studentService = new StudentService();