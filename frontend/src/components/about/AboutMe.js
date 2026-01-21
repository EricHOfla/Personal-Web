import React from "react";
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaCalendar } from "react-icons/fa";
import { buildMediaUrl } from "../../services/api";

function AboutMe({ profile }) {
  const stats = [
    { label: "Freelance Status", value: profile?.freelance_status || "Available" },
    { label: "Residence", value: profile?.residence || profile?.address || "N/A" },
    { label: "Qualification", value: profile?.qualification || "N/A" },
  ];

  return (
    <section className="space-y-6 sm:space-y-8">
      <div className="text-center px-2">
        <p className="text-xs sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.2em] text-designColor mb-1.5 sm:mb-2">About Me</p>
        <h2 className="text-xl sm:text-2xl font-semibold text-ink">Get to Know Me</h2>
      </div>

      <div className="glass-card p-3 sm:p-4 md:p-6 lg:p-8 xl:p-12 flex flex-col lg:flex-row gap-3 sm:gap-4 md:gap-6 lg:gap-8 items-center">
        {/* Avatar */}
        <div className="shrink-0">
          <div className="relative w-24 h-24 xs:w-28 xs:h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 lg:w-48 lg:h-48 rounded-xl sm:rounded-2xl overflow-hidden border-2 sm:border-3 md:border-4 border-designColor/30 shadow-glow flex items-center justify-center text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white bg-gradient-to-br from-designColor to-cyan-500">
            {profile?.first_name || profile?.last_name
              ? `${profile.last_name?.charAt(0) || ""}${profile.first_name?.charAt(0) || ""}`
              : "?"}
          </div>
        </div>

        {/* Bio */}
        <div className="flex-1 space-y-2 sm:space-y-3 md:space-y-4 text-center lg:text-left w-full">
          <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-ink break-words">{profile?.full_name || "Developer"}</h3>
          <p className="text-xs sm:text-sm md:text-base text-designColor font-medium break-words">{profile?.title || "Full Stack Developer"}</p>
          <p className="text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed break-words">{profile?.bio || "No bio available."}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 md:gap-3 text-[10px] xs:text-xs sm:text-sm text-gray-300">
            {profile?.residence && (
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <FaMapMarkerAlt className="text-designColor flex-shrink-0" />
                <span className="truncate">{profile.residence}</span>
              </div>
            )}
            {profile?.email && (
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <FaEnvelope className="text-designColor flex-shrink-0" />
                <a href={`mailto:${profile.email}`} className="hover:text-designColor transition truncate">
                  {profile.email}
                </a>
              </div>
            )}
            {profile?.phone && (
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <FaPhone className="text-designColor flex-shrink-0" />
                <span>{profile.phone}</span>
              </div>
            )}
            {profile?.freelance_status && (
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <FaCalendar className="text-designColor flex-shrink-0" />
                <span>{profile.freelance_status}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 xs:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="glass-card p-3 sm:p-4 md:p-6 text-center space-y-1 sm:space-y-1.5 md:space-y-2 hover:scale-105 transition duration-300">
            <p className="text-sm sm:text-base md:text-xl font-bold text-designColor break-words">{stat.value}</p>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-400 uppercase tracking-wide leading-tight">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default AboutMe;
