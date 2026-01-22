import { apiCall } from './api';

// Submit contact form
export const submitContactForm = async (formData) => {
  const payload = {
    name: formData.name,
    email: formData.email,
    message: formData.subject
      ? `${formData.subject}\n\n${formData.message || ""}`
      : formData.message || "",
  };

  try {
    return await apiCall('/api/contact/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  } catch (error) {
    throw new Error(
      error.message || 'Failed to submit contact form'
    );
  }
};

// Get contact info
export const getContactInfo = async () => {
  try {
    return await apiCall('/api/contact-info/');
  } catch (error) {
    throw new Error('Failed to fetch contact information');
  }
};
