import { toast } from 'react-toastify';

class GradeService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'grade_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "studentId_c" } },
          { field: { Name: "assignmentId_c" } },
          { field: { Name: "score_c" } },
          { field: { Name: "submittedDate_c" } }
        ],
        orderBy: [{ fieldName: "submittedDate_c", sorttype: "DESC" }]
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
        console.error("Error fetching grades:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error fetching grades:", error.message);
        toast.error("Failed to fetch grades");
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
          { field: { Name: "assignmentId_c" } },
          { field: { Name: "score_c" } },
          { field: { Name: "submittedDate_c" } }
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
        console.error(`Error fetching grade with ID ${id}:`, error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error(`Error fetching grade with ID ${id}:`, error.message);
        toast.error("Failed to fetch grade");
      }
      return null;
    }
  }

  async create(gradeData) {
    try {
      const params = {
        records: [{
          Name: gradeData.Name || `Grade for ${gradeData.studentId_c}`,
          studentId_c: parseInt(gradeData.studentId_c?.Id || gradeData.studentId_c),
          assignmentId_c: parseInt(gradeData.assignmentId_c?.Id || gradeData.assignmentId_c),
          score_c: parseInt(gradeData.score_c),
          submittedDate_c: gradeData.submittedDate_c || new Date().toISOString()
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
          console.error(`Failed to create ${failedRecords.length} grade records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success("Grade created successfully");
          return successfulRecords[0].data;
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating grade:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error creating grade:", error.message);
        toast.error("Failed to create grade");
      }
      return null;
    }
  }

  async update(id, gradeData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: gradeData.Name || `Grade for ${gradeData.studentId_c}`,
          studentId_c: parseInt(gradeData.studentId_c?.Id || gradeData.studentId_c),
          assignmentId_c: parseInt(gradeData.assignmentId_c?.Id || gradeData.assignmentId_c),
          score_c: parseInt(gradeData.score_c),
          submittedDate_c: gradeData.submittedDate_c
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
          console.error(`Failed to update ${failedUpdates.length} grade records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          toast.success("Grade updated successfully");
          return successfulUpdates[0].data;
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating grade:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error updating grade:", error.message);
        toast.error("Failed to update grade");
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
          console.error(`Failed to delete ${failedDeletions.length} grade records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          toast.success("Grade deleted successfully");
          return true;
        }
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting grade:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error deleting grade:", error.message);
        toast.error("Failed to delete grade");
      }
      return false;
    }
  }
}

export const gradeService = new GradeService();