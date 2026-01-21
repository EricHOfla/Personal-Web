import axios from "axios";

const API_HOST = process.env.REACT_APP_API_URL || "http://localhost:8000";

export const submitContactForm = async (formData) => {
  try {
    const payload = {
      name: formData.name,
      email: formData.email,
      message: formData.subject
        ? `${formData.subject}\n\n${formData.message || ""}`
        : formData.message || "",
    };
    const response = await axios.post(`${API_HOST}/api/contact/`, payload);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Failed to submit contact form");
  }
};

export const getContactInfo = async () => {
  try {
    const response = await axios.get(`${API_HOST}/api/contact-info/`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch contact information");
  }
};