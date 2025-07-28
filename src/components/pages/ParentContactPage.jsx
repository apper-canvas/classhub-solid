import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import StatCard from "@/components/molecules/StatCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ParentModal from "@/components/organisms/ParentModal";
import CommunicationModal from "@/components/organisms/CommunicationModal";
import CommunicationLog from "@/components/organisms/CommunicationLog";
import { parentContactService } from "@/services/api/parentContactService";
import { communicationService } from "@/services/api/communicationService";

const ParentContactPage = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [communications, setCommunications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isCommunicationModalOpen, setIsCommunicationModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadContacts();
    loadCommunications();
  }, []);

  useEffect(() => {
    const filtered = contacts.filter(contact =>
      contact.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredContacts(filtered);
  }, [contacts, searchTerm]);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const data = await parentContactService.getAll();
      setContacts(data);
      setError("");
    } catch (err) {
      setError("Failed to load parent contacts");
      toast.error("Failed to load parent contacts");
    } finally {
      setLoading(false);
    }
  };

  const loadCommunications = async () => {
    try {
      const data = await communicationService.getAll();
      setCommunications(data);
    } catch (err) {
      console.error("Failed to load communications:", err);
    }
  };

  const handleAddContact = () => {
    setEditingContact(null);
    setIsContactModalOpen(true);
  };

  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setIsContactModalOpen(true);
  };

  const handleDeleteContact = async (contactId) => {
    try {
      await parentContactService.delete(contactId);
      await loadContacts();
      toast.success("Parent contact deleted successfully");
    } catch (err) {
      toast.error("Failed to delete parent contact");
    }
  };

  const handleSaveContact = async (contactData) => {
    try {
      if (editingContact) {
        await parentContactService.update(editingContact.Id, contactData);
        toast.success("Parent contact updated successfully");
      } else {
        await parentContactService.create(contactData);
        toast.success("Parent contact created successfully");
      }
      await loadContacts();
      setIsContactModalOpen(false);
    } catch (err) {
      toast.error("Failed to save parent contact");
    }
  };

  const handleAddCommunication = (contactId) => {
    setSelectedContactId(contactId);
    setIsCommunicationModalOpen(true);
  };

  const handleSaveCommunication = async (communicationData) => {
    try {
      const newCommunication = {
        ...communicationData,
        parentContactId: selectedContactId,
        timestamp: new Date().toISOString()
      };
      await communicationService.create(newCommunication);
      await loadCommunications();
      toast.success("Communication logged successfully");
      setIsCommunicationModalOpen(false);
    } catch (err) {
      toast.error("Failed to log communication");
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const getContactCommunications = (contactId) => {
    return communications.filter(comm => comm.parentContactId === contactId);
  };

  if (loading) return <Loading />;
  if (error) return <Error error={error} onRetry={loadContacts} />;

  const stats = [
    {
      title: "Total Contacts",
      value: contacts.length,
      icon: "Users",
      color: "blue"
    },
    {
      title: "Recent Communications",
      value: communications.filter(c => 
        new Date(c.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length,
      icon: "MessageSquare",
      color: "green"
    },
    {
      title: "Emergency Contacts",
      value: contacts.filter(c => c.relationship === "Emergency Contact").length,
      icon: "AlertTriangle",
      color: "orange"
    },
    {
      title: "Active Parents",
      value: contacts.filter(c => c.status === "Active").length,
      icon: "UserCheck",
      color: "purple"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">
            Parent Contacts
          </h1>
          <p className="text-gray-600">
            Manage parent contact information and communication logs
          </p>
        </div>
        <Button onClick={handleAddContact} className="btn-primary">
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Contact
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* Search Bar */}
      <SearchBar
        onSearch={handleSearch}
        placeholder="Search contacts by name, email, or phone..."
        className="max-w-md"
      />

      {/* Contacts List */}
      {filteredContacts.length === 0 ? (
        <Empty
          icon="Users"
          title="No parent contacts found"
          description="Add parent contacts to start managing communications"
          action={
            <Button onClick={handleAddContact} className="btn-primary">
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Add First Contact
            </Button>
          }
        />
      ) : (
        <div className="grid gap-6">
          {filteredContacts.map((contact) => (
            <motion.div
              key={contact.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-card hover:shadow-hover transition-all duration-200 p-6"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                {/* Contact Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {contact.parentName}
                      </h3>
                      <p className="text-gray-600">
                        Parent of {contact.studentName} • {contact.relationship}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEditContact(contact)}
                        variant="ghost"
                        size="sm"
                      >
                        <ApperIcon name="Edit" size={16} />
                      </Button>
                      <Button
                        onClick={() => handleDeleteContact(contact.Id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <ApperIcon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-gray-600">
                      <ApperIcon name="Mail" size={16} className="mr-2" />
                      {contact.email}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <ApperIcon name="Phone" size={16} className="mr-2" />
                      {contact.phone}
                    </div>
                    {contact.address && (
                      <div className="flex items-center text-gray-600">
                        <ApperIcon name="MapPin" size={16} className="mr-2" />
                        {contact.address}
                      </div>
                    )}
                    <div className="flex items-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        contact.status === 'Active' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {contact.status}
                      </span>
                    </div>
                  </div>

                  {contact.notes && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600">
                        <strong>Notes:</strong> {contact.notes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Communication Actions */}
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={() => handleAddCommunication(contact.Id)}
                    className="btn-secondary"
                  >
                    <ApperIcon name="MessageSquarePlus" size={16} className="mr-2" />
                    Log Communication
                  </Button>
                </div>
              </div>

              {/* Communication Log */}
              <CommunicationLog
                communications={getContactCommunications(contact.Id)}
                contactName={contact.parentName}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Modals */}
      <ParentModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        onSave={handleSaveContact}
        contact={editingContact}
      />

      <CommunicationModal
        isOpen={isCommunicationModalOpen}
        onClose={() => setIsCommunicationModalOpen(false)}
        onSave={handleSaveCommunication}
        contactName={
          selectedContactId 
            ? contacts.find(c => c.Id === selectedContactId)?.parentName
            : ""
        }
      />
    </div>
  );
};

export default ParentContactPage;