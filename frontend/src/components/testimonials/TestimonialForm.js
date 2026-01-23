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
        <div className="glass-card p-5 sm:p-6 md:p-8 max-w-2xl mx-auto shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
                <div className="mb-6">
                    <h3 className="text-lg sm:text-xl font-bold text-titleColor mb-1">Share Your Experience</h3>
                    <p className="text-textTertiary text-xs sm:text-sm">Your feedback helps me grow and improve.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Name */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] sm:text-xs font-semibold text-textTertiary uppercase tracking-wider flex items-center gap-1.5">
                                <FaUser className="text-designColor" /> Full Name
                            </label>
                            <input
                                required
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Your Name"
                                className="w-full bg-surface border border-surfaceBorder rounded-lg px-3 py-2 text-sm text-textColor focus:border-designColor/50 focus:outline-none transition-all"
                            />
                        </div>

                        {/* Image */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] sm:text-xs font-semibold text-textTertiary uppercase tracking-wider flex items-center gap-1.5">
                                <FaImage className="text-designColor" /> Photo (Optional)
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
                                    className="w-full flex items-center justify-between bg-surface border border-surfaceBorder rounded-lg px-3 py-2 text-sm text-textTertiary cursor-pointer hover:border-designColor/30 transition-all"
                                >
                                    <span className="truncate">{image ? image.name : "Choose..."}</span>
                                    <span className="text-[10px] bg-surface border border-surfaceBorder px-2 py-0.5 rounded text-designColor">Browse</span>
                                </label>
                            </div>
                        </div>

                        {/* Role */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] sm:text-xs font-semibold text-textTertiary uppercase tracking-wider flex items-center gap-1.5">
                                <FaBriefcase className="text-designColor" /> Role
                            </label>
                            <input
                                type="text"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                placeholder="e.g. CEO"
                                className="w-full bg-surface border border-surfaceBorder rounded-lg px-3 py-2 text-sm text-textColor focus:border-designColor/50 focus:outline-none transition-all"
                            />
                        </div>

                        {/* Company */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] sm:text-xs font-semibold text-textTertiary uppercase tracking-wider flex items-center gap-1.5">
                                <FaBuilding className="text-designColor" /> Company
                            </label>
                            <input
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                placeholder="Organization"
                                className="w-full bg-surface border border-surfaceBorder rounded-lg px-3 py-2 text-sm text-textColor focus:border-designColor/50 focus:outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] sm:text-xs font-semibold text-textTertiary uppercase tracking-wider">Your Testimonial</label>
                        <textarea
                            required
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Write your thoughts here..."
                            rows="3"
                            className="w-full bg-surface border border-surfaceBorder rounded-lg px-3 py-2 text-sm text-textColor focus:border-designColor/50 focus:outline-none transition-all resize-none"
                        ></textarea>
                    </div>

                    <div className="flex flex-col gap-3 pt-2">
                        <button
                            disabled={loading}
                            type="submit"
                            className={`w-full py-2.5 rounded-lg font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${loading
                                ? "bg-gray-700 text-gray-400"
                                : "bg-designColor text-black hover:brightness-110 active:scale-[0.98]"
                                }`}
                        >
                            {loading ? "Submitting..." : "Submit Testimonial"}
                        </button>

                        {message.text && (
                            <p className={`text-[11px] text-center font-medium ${message.type === "success" ? "text-green-400" : "text-red-400"}`}>
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
