import { toast } from "react-toastify";
import React from "react";

class CommunicationService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'communication_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "parentContactId_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "subject_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "timestamp_c" } },
          { field: { Name: "createdAt_c" } }
        ],
        orderBy: [{ fieldName: "timestamp_c", sorttype: "DESC" }]
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
        console.error("Error fetching communications:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error fetching communications:", error.message);
        toast.error("Failed to fetch communications");
      }
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "parentContactId_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "subject_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "timestamp_c" } },
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
        console.error(`Error fetching communication with ID ${id}:`, error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error(`Error fetching communication with ID ${id}:`, error.message);
        toast.error("Failed to fetch communication");
      }
      return null;
    }
  }

  async create(communicationData) {
    try {
      const params = {
        records: [{
          Name: communicationData.Name || communicationData.subject_c,
          parentContactId_c: parseInt(communicationData.parentContactId_c?.Id || communicationData.parentContactId_c),
          type_c: communicationData.type_c,
          subject_c: communicationData.subject_c,
          description_c: communicationData.description_c,
          timestamp_c: communicationData.timestamp_c || new Date().toISOString(),
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
          console.error(`Failed to create ${failedRecords.length} communication records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success("Communication created successfully");
          return successfulRecords[0].data;
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating communication:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error creating communication:", error.message);
        toast.error("Failed to create communication");
      }
      return null;
    }
  }

  async update(id, communicationData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: communicationData.Name || communicationData.subject_c,
          parentContactId_c: parseInt(communicationData.parentContactId_c?.Id || communicationData.parentContactId_c),
          type_c: communicationData.type_c,
          subject_c: communicationData.subject_c,
          description_c: communicationData.description_c,
          timestamp_c: communicationData.timestamp_c
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
          console.error(`Failed to update ${failedUpdates.length} communication records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          toast.success("Communication updated successfully");
          return successfulUpdates[0].data;
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating communication:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error updating communication:", error.message);
        toast.error("Failed to update communication");
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
          console.error(`Failed to delete ${failedDeletions.length} communication records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          toast.success("Communication deleted successfully");
          return true;
        }
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting communication:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error deleting communication:", error.message);
        toast.error("Failed to delete communication");
      }
      return false;
    }
  }

  async getByParentContactId(parentContactId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "parentContactId_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "subject_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "timestamp_c" } },
          { field: { Name: "createdAt_c" } }
        ],
        where: [
          {
            FieldName: "parentContactId_c",
            Operator: "EqualTo",
            Values: [parseInt(parentContactId)]
          }
        ],
        orderBy: [{ fieldName: "timestamp_c", sorttype: "DESC" }]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching communications for parent contact ${parentContactId}:`, error.response.data.message);
      } else {
        console.error(`Error fetching communications for parent contact ${parentContactId}:`, error.message);
      }
      return [];
    }
return [];
    }
  }
}

export const communicationService = new CommunicationService();