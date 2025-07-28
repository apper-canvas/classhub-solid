import { toast } from 'react-toastify';

class AssignmentService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'assignment_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "classId_c" } },
          { field: { Name: "totalPoints_c" } },
          { field: { Name: "dueDate_c" } },
          { field: { Name: "type_c" } }
        ],
        orderBy: [{ fieldName: "dueDate_c", sorttype: "ASC" }]
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
        console.error("Error fetching assignments:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error fetching assignments:", error.message);
        toast.error("Failed to fetch assignments");
      }
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "classId_c" } },
          { field: { Name: "totalPoints_c" } },
          { field: { Name: "dueDate_c" } },
          { field: { Name: "type_c" } }
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
        console.error(`Error fetching assignment with ID ${id}:`, error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error(`Error fetching assignment with ID ${id}:`, error.message);
        toast.error("Failed to fetch assignment");
      }
      return null;
    }
  }

  async create(assignmentData) {
    try {
      const params = {
        records: [{
          Name: assignmentData.Name,
          classId_c: parseInt(assignmentData.classId_c?.Id || assignmentData.classId_c),
          totalPoints_c: parseInt(assignmentData.totalPoints_c),
          dueDate_c: assignmentData.dueDate_c,
          type_c: assignmentData.type_c
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
          console.error(`Failed to create ${failedRecords.length} assignment records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success("Assignment created successfully");
          return successfulRecords[0].data;
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating assignment:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error creating assignment:", error.message);
        toast.error("Failed to create assignment");
      }
      return null;
    }
  }

  async update(id, assignmentData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: assignmentData.Name,
          classId_c: parseInt(assignmentData.classId_c?.Id || assignmentData.classId_c),
          totalPoints_c: parseInt(assignmentData.totalPoints_c),
          dueDate_c: assignmentData.dueDate_c,
          type_c: assignmentData.type_c
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
          console.error(`Failed to update ${failedUpdates.length} assignment records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          toast.success("Assignment updated successfully");
          return successfulUpdates[0].data;
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating assignment:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error updating assignment:", error.message);
        toast.error("Failed to update assignment");
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
          console.error(`Failed to delete ${failedDeletions.length} assignment records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          toast.success("Assignment deleted successfully");
          return true;
        }
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting assignment:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error deleting assignment:", error.message);
        toast.error("Failed to delete assignment");
      }
      return false;
    }
  }
}

export const assignmentService = new AssignmentService();