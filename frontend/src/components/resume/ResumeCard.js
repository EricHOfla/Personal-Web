import React from "react";

function ResumeCard({ item, type }) {
  const title = type === "education" ? item.degree : item.job_title || item.title;
  const organization = type === "education" ? item.institution : item.company || item.organization;
  const duration = item.time_period || item.duration || "";

  // Function to render duration with "Now" highlighted
  const renderDuration = () => {
    if (!duration) return null;

    // Check if duration contains "now" (case-insensitive)
    const nowMatch = duration.match(/\bnow\b/i);

    if (nowMatch) {
      const parts = duration.split(/\b(now)\b/i);
      return parts.map((part, index) => {
        if (part.toLowerCase() === "now") {
          return (
            <span
              key={index}
              className="now-highlight px-1.5 py-0.5 text-xs font-semibold bg-designColor/20 text-designColor border border-designColor/30 rounded animate-pulse"
            >
              Now
            </span>
          );
        }
        return part;
      });
    }

    return duration;
  };

  return (
    <article className="resume-card">
      <h3>{title}</h3>
      <p className="organization">{organization}</p>
      <p className="duration">{renderDuration()}</p>
      <p className="description">{item.description}</p>
    </article>
  );
}

export default React.memo(ResumeCard);
