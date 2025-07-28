import communicationsData from "@/services/mockData/communications.json";

class CommunicationService {
  constructor() {
    this.communications = [...communicationsData];
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.communications].sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const communication = this.communications.find(c => c.Id === id);
    if (!communication) {
      throw new Error("Communication not found");
    }
    return { ...communication };
  }

  async create(communicationData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const maxId = Math.max(...this.communications.map(c => c.Id), 0);
    const newCommunication = {
      Id: maxId + 1,
      ...communicationData,
      timestamp: communicationData.timestamp || new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    
    this.communications.push(newCommunication);
    return { ...newCommunication };
  }

  async update(id, communicationData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = this.communications.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error("Communication not found");
    }
    
    this.communications[index] = { 
      ...this.communications[index], 
      ...communicationData,
      updatedAt: new Date().toISOString()
    };
    return { ...this.communications[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.communications.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error("Communication not found");
    }
    
    this.communications.splice(index, 1);
    return true;
  }

  async getByParentContactId(parentContactId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.communications.filter(c => c.parentContactId === parentContactId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }
}

export const communicationService = new CommunicationService();