import React, { useState } from "react";
import { submitContactForm } from "../../services/contactService";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane } from "react-icons/fa";

function Contact({ profile }) {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      await submitContactForm(formData);
      setStatus({ type: "success", message: "Message sent successfully! I'll get back to you soon." });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setStatus({ type: "error", message: err.message || "Failed to send message. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="app-shell">
      <div className="section-header">
        <p className="section-label">Contact</p>
        <h1 className="section-title">Get In Touch</h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base px-2">
          Have a project in mind or want to collaborate? Feel free to reach out!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto">
        <div className="lg:col-span-2 space-y-3 sm:space-y-4 md:space-y-6">
          <div className="glass-card p-4 sm:p-5 md:p-6 flex items-start gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-designColor/10 rounded-lg text-designColor flex-shrink-0">
              <FaEnvelope className="text-lg sm:text-xl" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-ink mb-0.5 sm:mb-1 text-sm sm:text-base">Email</h3>
              <a href={`mailto:${profile?.email || ""}`} className="text-gray-300 hover:text-designColor transition text-xs sm:text-sm break-all">
                {profile?.email || "Not provided"}
              </a>
            </div>
          </div>

          <div className="glass-card p-4 sm:p-5 md:p-6 flex items-start gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-designColor/10 rounded-lg text-designColor flex-shrink-0">
              <FaPhone className="text-lg sm:text-xl" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-ink mb-0.5 sm:mb-1 text-sm sm:text-base">Phone</h3>
              <a href={`tel:${profile?.phone || ""}`} className="text-gray-300 hover:text-designColor transition text-xs sm:text-sm">
                {profile?.phone || "Not provided"}
              </a>
            </div>
          </div>

          <div className="glass-card p-4 sm:p-5 md:p-6 flex items-start gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-designColor/10 rounded-lg text-designColor flex-shrink-0">
              <FaMapMarkerAlt className="text-lg sm:text-xl" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-ink mb-0.5 sm:mb-1 text-sm sm:text-base">Location</h3>
              <p className="text-gray-300 text-xs sm:text-sm">
                {profile?.residence || profile?.address || "Not provided"}
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="glass-card p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-5 md:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg text-ink focus:border-designColor focus:outline-none transition text-sm sm:text-base"
                  placeholder="Eric H Oflã"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">Your Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg text-ink focus:border-designColor focus:outline-none transition text-sm sm:text-base"
                  placeholder="ofla@gmail.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg text-ink focus:border-designColor focus:outline-none transition text-sm sm:text-base"
                placeholder="Project Inquiry"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg text-ink focus:border-designColor focus:outline-none transition resize-none text-sm sm:text-base"
                placeholder="Tell me about your project..."
              ></textarea>
            </div>

            {status.message && (
              <div
                className={`p-3 sm:p-4 rounded-lg text-xs sm:text-sm ${
                  status.type === "success"
                    ? "bg-green-500/10 border border-green-500/30 text-green-400"
                    : "bg-red-500/10 border border-red-500/30 text-red-400"
                }`}
              >
                {status.message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="button-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : (
                <>
                  Send Message <FaPaperPlane />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;
