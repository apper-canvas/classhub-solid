import parentContactsData from "@/services/mockData/parentContacts.json";

class ParentContactService {
  constructor() {
    this.contacts = [...parentContactsData];
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.contacts];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const contact = this.contacts.find(c => c.Id === id);
    if (!contact) {
      throw new Error("Parent contact not found");
    }
    return { ...contact };
  }

  async create(contactData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const maxId = Math.max(...this.contacts.map(c => c.Id), 0);
    const newContact = {
      Id: maxId + 1,
      ...contactData,
      status: contactData.status || "Active",
      createdAt: new Date().toISOString()
    };
    
    this.contacts.push(newContact);
    return { ...newContact };
  }

  async update(id, contactData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = this.contacts.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error("Parent contact not found");
    }
    
    this.contacts[index] = { 
      ...this.contacts[index], 
      ...contactData,
      updatedAt: new Date().toISOString()
    };
    return { ...this.contacts[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.contacts.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error("Parent contact not found");
    }
    
    this.contacts.splice(index, 1);
    return true;
  }

  async getByStudentId(studentId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.contacts.filter(c => c.studentId === studentId);
  }
}

export const parentContactService = new ParentContactService();