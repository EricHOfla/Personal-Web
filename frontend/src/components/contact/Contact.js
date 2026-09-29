import React, { useState } from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane, FaWhatsapp } from "react-icons/fa";
import { portfolioData } from "../../data";

function Contact({ profile = portfolioData.profile }) {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    const recipientEmail = profile?.email || portfolioData.profile.email || "ericofla1@gmail.com";

    try {
      // Direct in-page submission with professional FormSubmit box template and direct reply-to
      const response = await fetch(`https://formsubmit.co/ajax/${recipientEmail}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _template: "box",
          _captcha: "false",
          _replyto: formData.email,
          _subject: `💼 Portfolio Inquiry: ${formData.subject || "New Message"} — from ${formData.name}`,
          _autoresponse: `Hello ${formData.name},\n\nThank you for reaching out via my portfolio website. I have received your message regarding "${formData.subject || "your inquiry"}" and will get back to you shortly.\n\nBest regards,\nEric HABUMUGISHA (Oflah)\nFull Stack Developer & Software Engineer\nWhatsApp: +250 785 263 931\nWebsite: https://oflah.vercel.app`,
          "Sender Name": formData.name,
          "Sender Email": formData.email,
          "Phone / WhatsApp": formData.phone?.trim() ? formData.phone : "Not provided",
          "Subject": formData.subject,
          "Message": formData.message,
          "Source": "Oflah Portfolio (https://oflah.vercel.app/#contact)",
          "Sent At": new Date().toLocaleString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
        }),
      });

      const data = await response.json();
      if (data.success === "true" || data.success === true) {
        setStatus({
          type: "success",
          message: "Thank you! Your message has been sent directly to Eric's inbox.",
        });
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        throw new Error("Direct send fallback");
      }
    } catch (err) {
      // Fallback: styled mailto format
      const mailtoSubject = encodeURIComponent(`[Portfolio] ${formData.subject || "Contact from Portfolio"} - ${formData.name}`);
      const mailtoBody = encodeURIComponent(
        `===================================================\n` +
        `       NEW MESSAGE VIA OFLAH PORTFOLIO             \n` +
        `===================================================\n\n` +
        `👤 Sender: ${formData.name}\n` +
        `📧 Email:  ${formData.email}\n` +
        `📱 Phone:  ${formData.phone || "Not provided"}\n` +
        `📌 Subject: ${formData.subject}\n` +
        `🕒 Date:   ${new Date().toLocaleString()}\n\n` +
        `---------------------------------------------------\n` +
        `💬 MESSAGE:\n` +
        `---------------------------------------------------\n` +
        `${formData.message}\n\n` +
        `===================================================\n` +
        `Sent via https://oflah.vercel.app/#contact\n`
      );
      window.location.href = `mailto:${recipientEmail}?subject=${mailtoSubject}&body=${mailtoBody}`;
      setStatus({
        type: "success",
        message: "Opening your email app to send the message directly.",
      });
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } finally {
      setLoading(false);
    }
  };


  return (
    <section className="app-shell">
      <div className="section-header">
        <p className="section-label">Contact</p>
        <h1 className="section-title">Get In Touch</h1>
        <p className="text-textSecondary max-w-2xl mx-auto text-sm sm:text-base px-2">
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
              <h3 className="font-semibold text-titleColor mb-0.5 sm:mb-1 text-sm sm:text-base">Email</h3>
              <a href={`mailto:${profile?.email || ""}`} className="text-textSecondary hover:text-designColor transition text-xs sm:text-sm break-all">
                {profile?.email || "Not provided"}
              </a>
            </div>
          </div>

          <div className="glass-card p-4 sm:p-5 md:p-6 flex items-start gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-designColor/10 rounded-lg text-designColor flex-shrink-0">
              <FaPhone className="text-lg sm:text-xl" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-titleColor mb-0.5 sm:mb-1 text-sm sm:text-base">Phone</h3>
              <a href={`tel:${profile?.phone || ""}`} className="text-textSecondary hover:text-designColor transition text-xs sm:text-sm">
                {profile?.phone || "Not provided"}
              </a>
            </div>
          </div>

          <div className="glass-card p-4 sm:p-5 md:p-6 flex items-start gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-designColor/10 rounded-lg text-designColor flex-shrink-0">
              <FaMapMarkerAlt className="text-lg sm:text-xl" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-titleColor mb-0.5 sm:mb-1 text-sm sm:text-base">Location</h3>
              <p className="text-textSecondary text-xs sm:text-sm">
                {profile?.residence || profile?.address || "Not provided"}
              </p>
            </div>
          </div>

          <a
            href={`https://wa.me/250785263931?text=${encodeURIComponent("Hi Eric, I visited your portfolio and would like to connect.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card p-4 sm:p-5 md:p-6 flex items-start gap-3 sm:gap-4 group hover:border-green-500/50 transition cursor-pointer"
          >
            <div className="p-2 sm:p-3 bg-green-500/10 rounded-lg text-green-400 group-hover:bg-green-500 group-hover:text-black transition flex-shrink-0">
              <FaWhatsapp className="text-lg sm:text-xl" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-titleColor mb-0.5 text-sm sm:text-base">WhatsApp</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 font-semibold border border-green-500/30">
                  Instant
                </span>
              </div>
              <p className="text-textSecondary group-hover:text-green-400 transition text-xs sm:text-sm">
                Chat directly: +250 785 263 931
              </p>
            </div>
          </a>
        </div>

        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="glass-card p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-5 md:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-textSecondary mb-1.5 sm:mb-2">Your Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-surface border border-surfaceBorder rounded-lg text-titleColor focus:border-designColor focus:outline-none transition text-sm sm:text-base"
                  placeholder="e.g. John Doe"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-textSecondary mb-1.5 sm:mb-2">Your Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-surface border border-surfaceBorder rounded-lg text-titleColor focus:border-designColor focus:outline-none transition text-sm sm:text-base"
                  placeholder="e.g. john@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-textSecondary mb-1.5 sm:mb-2">
                  Phone / WhatsApp <span className="text-[11px] text-gray-500 font-normal">(Optional)</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-surface border border-surfaceBorder rounded-lg text-titleColor focus:border-designColor focus:outline-none transition text-sm sm:text-base"
                  placeholder="+250 780 000 000"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-textSecondary mb-1.5 sm:mb-2">Subject *</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-surface border border-surfaceBorder rounded-lg text-titleColor focus:border-designColor focus:outline-none transition text-sm sm:text-base"
                  placeholder="e.g. Project Inquiry"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-textSecondary mb-1.5 sm:mb-2">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-surface border border-surfaceBorder rounded-lg text-titleColor focus:border-designColor focus:outline-none transition resize-none text-sm sm:text-base"
                placeholder="Tell me about your project..."
              ></textarea>
            </div>

            {status.message && (
              <div
                className={`p-3 sm:p-4 rounded-lg text-xs sm:text-sm ${status.type === "success"
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
