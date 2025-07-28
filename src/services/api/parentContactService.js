import { toast } from 'react-toastify';

class ParentContactService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'parent_contact_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "parentName_c" } },
          { field: { Name: "studentName_c" } },
          { field: { Name: "studentId_c" } },
          { field: { Name: "relationship_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "address_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "createdAt_c" } }
        ],
        orderBy: [{ fieldName: "parentName_c", sorttype: "ASC" }]
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
        console.error("Error fetching parent contacts:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error fetching parent contacts:", error.message);
        toast.error("Failed to fetch parent contacts");
      }
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "parentName_c" } },
          { field: { Name: "studentName_c" } },
          { field: { Name: "studentId_c" } },
          { field: { Name: "relationship_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "address_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "notes_c" } },
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
        console.error(`Error fetching parent contact with ID ${id}:`, error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error(`Error fetching parent contact with ID ${id}:`, error.message);
        toast.error("Failed to fetch parent contact");
      }
      return null;
    }
  }

  async create(contactData) {
    try {
      const params = {
        records: [{
          Name: contactData.Name || contactData.parentName_c,
          parentName_c: contactData.parentName_c,
          studentName_c: contactData.studentName_c,
          studentId_c: parseInt(contactData.studentId_c?.Id || contactData.studentId_c),
          relationship_c: contactData.relationship_c,
          email_c: contactData.email_c,
          phone_c: contactData.phone_c,
          address_c: contactData.address_c,
          status_c: contactData.status_c || "Active",
          notes_c: contactData.notes_c,
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
          console.error(`Failed to create ${failedRecords.length} parent contact records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success("Parent contact created successfully");
          return successfulRecords[0].data;
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating parent contact:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error creating parent contact:", error.message);
        toast.error("Failed to create parent contact");
      }
      return null;
    }
  }

  async update(id, contactData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: contactData.Name || contactData.parentName_c,
          parentName_c: contactData.parentName_c,
          studentName_c: contactData.studentName_c,
          studentId_c: parseInt(contactData.studentId_c?.Id || contactData.studentId_c),
          relationship_c: contactData.relationship_c,
          email_c: contactData.email_c,
          phone_c: contactData.phone_c,
          address_c: contactData.address_c,
          status_c: contactData.status_c,
          notes_c: contactData.notes_c
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
          console.error(`Failed to update ${failedUpdates.length} parent contact records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          toast.success("Parent contact updated successfully");
          return successfulUpdates[0].data;
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating parent contact:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error updating parent contact:", error.message);
        toast.error("Failed to update parent contact");
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
          console.error(`Failed to delete ${failedDeletions.length} parent contact records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          toast.success("Parent contact deleted successfully");
          return true;
        }
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting parent contact:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error deleting parent contact:", error.message);
        toast.error("Failed to delete parent contact");
      }
      return false;
    }
  }

  async getByStudentId(studentId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "parentName_c" } },
          { field: { Name: "studentName_c" } },
          { field: { Name: "studentId_c" } },
          { field: { Name: "relationship_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "address_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "createdAt_c" } }
        ],
        where: [
          {
            FieldName: "studentId_c",
            Operator: "EqualTo",
            Values: [parseInt(studentId)]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching parent contacts for student ${studentId}:`, error.response.data.message);
      } else {
        console.error(`Error fetching parent contacts for student ${studentId}:`, error.message);
      }
      return [];
    }
  }
}
export const parentContactService = new ParentContactService();