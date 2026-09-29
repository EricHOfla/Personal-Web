import React, { useState } from "react";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaWhatsapp,
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { portfolioData } from "../../data";

function Contact({ profile = portfolioData.profile }) {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [status, setStatus] = useState({ type: "", message: "", fallback: null });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "", fallback: null });

    const recipientEmail = profile?.email || portfolioData.profile.email || "ericofla1@gmail.com";

    // Set an 8-second timeout so it never hangs indefinitely
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      // Direct in-page submission with professional FormSubmit box template and direct reply-to
      // Note: _autoresponse is omitted because sending 2 synchronous SMTP emails caused 15s delays
      const response = await fetch(`https://formsubmit.co/ajax/${recipientEmail}`, {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _template: "box",
          _captcha: "false",
          _replyto: formData.email,
          _subject: `💼 Portfolio Inquiry: ${formData.subject || "New Message"} — from ${formData.name}`,
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

      clearTimeout(timeoutId);

      const data = await response.json();
      if (data.success === "true" || data.success === true) {
        setStatus({
          type: "success",
          message: `Thank you, ${formData.name}! Your message was successfully sent directly to Eric's inbox.`,
        });
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        throw new Error(data.message || "Submission failed");
      }
    } catch (err) {
      clearTimeout(timeoutId);

      // Prepared fallback URLs for computer & mobile
      const mailSubject = `[Portfolio] ${formData.subject || "Contact from Portfolio"} - ${formData.name}`;
      const mailBody =
        `Hi Eric,\n\n${formData.message}\n\n` +
        `---\n` +
        `Sender: ${formData.name}\n` +
        `Email: ${formData.email}\n` +
        `Phone: ${formData.phone || "Not provided"}\n` +
        `Sent via https://oflah.vercel.app`;

      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipientEmail)}&su=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;
      const mailtoUrl = `mailto:${recipientEmail}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;
      const whatsappUrl = `https://wa.me/250785263931?text=${encodeURIComponent(`Hi Eric, my name is ${formData.name} (${formData.email}).\n\nSubject: ${formData.subject}\n\n${formData.message}`)}`;

      setStatus({
        type: "fallback",
        message: "Notice: An adblocker or network delay blocked direct delivery. Send your message instantly using one of the options below:",
        fallback: {
          gmailUrl,
          mailtoUrl,
          whatsappUrl,
        },
      });
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
                className={`p-4 rounded-xl text-xs sm:text-sm ${
                  status.type === "success"
                    ? "bg-green-500/10 border border-green-500/30 text-green-300"
                    : status.type === "fallback"
                    ? "bg-amber-500/10 border border-amber-500/30 text-amber-200"
                    : "bg-red-500/10 border border-red-500/30 text-red-300"
                }`}
              >
                <div className="flex items-start gap-2.5">
                  {status.type === "success" ? (
                    <FaCheckCircle className="text-green-400 text-lg flex-shrink-0 mt-0.5" />
                  ) : (
                    <FaExclamationTriangle className="text-amber-400 text-lg flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 space-y-2">
                    <p className="font-medium leading-relaxed">{status.message}</p>

                    {status.fallback && (
                      <div className="pt-2 flex flex-wrap gap-2">
                        <a
                          href={status.fallback.gmailUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium text-xs transition shadow-md"
                        >
                          <FaEnvelope /> Open in Gmail <FaExternalLinkAlt className="text-[10px]" />
                        </a>
                        <a
                          href={status.fallback.whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-500 text-white font-medium text-xs transition shadow-md"
                        >
                          <FaWhatsapp /> Send via WhatsApp <FaExternalLinkAlt className="text-[10px]" />
                        </a>
                        <a
                          href={status.fallback.mailtoUrl}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 font-medium text-xs transition border border-gray-700"
                        >
                          Mail Client
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="button-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin text-base" />
                  <span>Sending message...</span>
                </>
              ) : (
                <>
                  <span>Send Message</span>
                  <FaPaperPlane />
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
