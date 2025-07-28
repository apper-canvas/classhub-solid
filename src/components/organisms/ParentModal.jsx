import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";

const ParentModal = ({ isOpen, onClose, onSave, contact }) => {
  const [formData, setFormData] = useState({
    parentName: "",
    studentName: "",
    studentId: "",
    relationship: "",
    email: "",
    phone: "",
    address: "",
    status: "Active",
    notes: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (contact) {
      setFormData({
        parentName: contact.parentName || "",
        studentName: contact.studentName || "",
        studentId: contact.studentId || "",
        relationship: contact.relationship || "",
        email: contact.email || "",
        phone: contact.phone || "",
        address: contact.address || "",
        status: contact.status || "Active",
        notes: contact.notes || ""
      });
    } else {
      setFormData({
        parentName: "",
        studentName: "",
        studentId: "",
        relationship: "",
        email: "",
        phone: "",
        address: "",
        status: "Active",
        notes: ""
      });
    }
    setErrors({});
  }, [contact, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.parentName.trim()) {
      newErrors.parentName = "Parent name is required";
    }
    
    if (!formData.studentName.trim()) {
      newErrors.studentName = "Student name is required";
    }
    
    if (!formData.relationship.trim()) {
      newErrors.relationship = "Relationship is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSave(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const relationshipOptions = [
    "Mother",
    "Father",
    "Guardian",
    "Grandmother",
    "Grandfather",
    "Step-parent",
    "Foster Parent",
    "Emergency Contact",
    "Other"
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {contact ? "Edit Parent Contact" : "Add Parent Contact"}
                  </h2>
                  <Button
                    onClick={onClose}
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <ApperIcon name="X" size={20} />
                  </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label="Parent Name *"
                      name="parentName"
                      value={formData.parentName}
                      onChange={handleInputChange}
                      error={errors.parentName}
                      placeholder="Enter parent's full name"
                    />

                    <FormField
                      label="Student Name *"
                      name="studentName"
                      value={formData.studentName}
                      onChange={handleInputChange}
                      error={errors.studentName}
                      placeholder="Enter student's name"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Relationship *
                      </label>
                      <select
                        name="relationship"
                        value={formData.relationship}
                        onChange={handleInputChange}
                        className={`input-field ${errors.relationship ? "border-red-500" : ""}`}
                      >
                        <option value="">Select relationship</option>
                        {relationshipOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                      {errors.relationship && (
                        <p className="text-red-500 text-sm mt-1">{errors.relationship}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="input-field"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Emergency Only">Emergency Only</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label="Email Address *"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      error={errors.email}
                      placeholder="parent@email.com"
                    />

                    <FormField
                      label="Phone Number *"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      error={errors.phone}
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <FormField
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    error={errors.address}
                    placeholder="Enter full address"
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="input-field"
                      rows={3}
                      placeholder="Additional notes or preferences..."
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      type="button"
                      onClick={onClose}
                      variant="secondary"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="btn-primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <ApperIcon name="Save" size={16} className="mr-2" />
                          {contact ? "Update Contact" : "Create Contact"}
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ParentModal;