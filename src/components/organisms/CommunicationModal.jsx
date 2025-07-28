import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";

const CommunicationModal = ({ isOpen, onClose, onSave, contactName }) => {
  const [formData, setFormData] = useState({
    type: "",
    subject: "",
    description: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        type: "",
        subject: "",
        description: ""
      });
      setErrors({});
    }
  }, [isOpen]);

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
    
    if (!formData.type.trim()) {
      newErrors.type = "Communication type is required";
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
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

  const communicationTypes = [
    "Email",
    "Phone Call",
    "Text Message",
    "In-Person Meeting",
    "Video Call",
    "Letter/Note",
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
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Log Communication
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                      Recording communication with {contactName}
                    </p>
                  </div>
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Communication Type *
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className={`input-field ${errors.type ? "border-red-500" : ""}`}
                    >
                      <option value="">Select communication type</option>
                      {communicationTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    {errors.type && (
                      <p className="text-red-500 text-sm mt-1">{errors.type}</p>
                    )}
                  </div>

                  <FormField
                    label="Subject *"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    error={errors.subject}
                    placeholder="Brief subject or topic"
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className={`input-field ${errors.description ? "border-red-500" : ""}`}
                      rows={4}
                      placeholder="Detailed description of the communication..."
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                    )}
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center text-sm text-gray-600">
                      <ApperIcon name="Clock" size={16} className="mr-2" />
                      This communication will be logged with the current date and time
                    </div>
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
                          Logging...
                        </>
                      ) : (
                        <>
                          <ApperIcon name="MessageSquarePlus" size={16} className="mr-2" />
                          Log Communication
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

export default CommunicationModal;