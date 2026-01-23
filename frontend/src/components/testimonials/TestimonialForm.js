import React, { useState } from "react";
import { createTestimonial } from "../../services/testimonialService";
import { FaUser, FaBriefcase, FaBuilding, FaImage } from "react-icons/fa";

const TestimonialForm = ({ onTestimonialAdded }) => {
    const [formData, setFormData] = useState({
        name: "",
        role: "",
        company: "",
        message: "",
    });
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: "", text: "" });

        const data = new FormData();
        data.append("name", formData.name);
        data.append("role", formData.role);
        data.append("company", formData.company);
        data.append("message", formData.message);
        if (image) {
            data.append("image", image);
        }

        try {
            await createTestimonial(data);
            setMessage({ type: "success", text: "Thank you! Your testimonial has been submitted and is awaiting approval." });
            setFormData({ name: "", role: "", company: "", message: "" });
            setImage(null);
            if (onTestimonialAdded) onTestimonialAdded();
        } catch (error) {
            console.error("Submission error:", error);
            setMessage({ type: "error", text: "Something went wrong. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-card p-6 sm:p-8 md:p-10 max-w-4xl mx-auto shadow-2xl relative overflow-hidden group">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-designColor/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            <div className="relative z-10">
                <div className="mb-8 text-center lgl:text-left">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Leave a Testimonial</h3>
                    <p className="text-gray-400 text-sm sm:text-base">I value your feedback! Share your experience working with me.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div className="space-y-2">
                            <label className="text-xs sm:text-sm font-semibold text-gray-300 flex items-center gap-2">
                                <FaUser className="text-designColor" /> Full Name
                            </label>
                            <input
                                required
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. John Doe"
                                className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-3 text-sm sm:text-base text-white focus:border-designColor/50 focus:outline-none transition-all placeholder:text-gray-600"
                            />
                        </div>

                        {/* Image Upload */}
                        <div className="space-y-2">
                            <label className="text-xs sm:text-sm font-semibold text-gray-300 flex items-center gap-2">
                                <FaImage className="text-designColor" /> Profile Image (Optional)
                            </label>
                            <div className="relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    id="testimonial-image"
                                />
                                <label
                                    htmlFor="testimonial-image"
                                    className="w-full flex items-center justify-between bg-[#121212] border border-white/10 rounded-xl px-4 py-3 text-sm sm:text-base text-gray-400 cursor-pointer hover:border-designColor/30 transition-all"
                                >
                                    <span className="truncate">{image ? image.name : "Choose an image..."}</span>
                                    <div className="bg-white/5 p-1 rounded-md text-designColor">
                                        Browse
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Role */}
                        <div className="space-y-2">
                            <label className="text-xs sm:text-sm font-semibold text-gray-300 flex items-center gap-2">
                                <FaBriefcase className="text-designColor" /> Your Role
                            </label>
                            <input
                                type="text"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                placeholder="e.g. Project Manager"
                                className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-3 text-sm sm:text-base text-white focus:border-designColor/50 focus:outline-none transition-all placeholder:text-gray-600"
                            />
                        </div>

                        {/* Company */}
                        <div className="space-y-2">
                            <label className="text-xs sm:text-sm font-semibold text-gray-300 flex items-center gap-2">
                                <FaBuilding className="text-designColor" /> Company/Organization
                            </label>
                            <input
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                placeholder="e.g. Tech Solutions"
                                className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-3 text-sm sm:text-base text-white focus:border-designColor/50 focus:outline-none transition-all placeholder:text-gray-600"
                            />
                        </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                        <label className="text-xs sm:text-sm font-semibold text-gray-300">Your Message</label>
                        <textarea
                            required
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Share your experience working with me..."
                            rows="4"
                            className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-3 text-sm sm:text-base text-white focus:border-designColor/50 focus:outline-none transition-all placeholder:text-gray-600 resize-none"
                        ></textarea>
                    </div>

                    {/* Submit Button */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                        <button
                            disabled={loading}
                            type="submit"
                            className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${loading
                                    ? "bg-gray-700 cursor-not-allowed text-gray-400"
                                    : "bg-gradient-to-r from-designColor to-cyan-500 text-black hover:shadow-lg hover:shadow-designColor/20 active:scale-95"
                                }`}
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                                    Submitting...
                                </>
                            ) : "Post Testimonial"}
                        </button>

                        {message.text && (
                            <p className={`text-sm font-medium ${message.type === "success" ? "text-green-400" : "text-red-400"}`}>
                                {message.text}
                            </p>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TestimonialForm;
