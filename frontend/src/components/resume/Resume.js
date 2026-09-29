import React, { useState } from "react";
import Education from "./Education";
import Skills from "./Skills";
import { FaGraduationCap, FaCode, FaBriefcase, FaGlobe } from "react-icons/fa";
import { portfolioData } from "../../data";

const Resume = ({ appData = portfolioData }) => {
  const [activeTab, setActiveTab] = useState("education");

  const tabs = [
    { id: "education", label: "Education", icon: FaGraduationCap },
    { id: "skills", label: "Skills", icon: FaCode },
    { id: "experience", label: "Experience", icon: FaBriefcase },
    { id: "languages", label: "Languages", icon: FaGlobe },
  ];

  return (
    <section id="resume" className="app-shell">
      <div className="section-header">
        <p className="section-label">Resume</p>
        <h1 className="section-title">My Background</h1>
        <p className="text-textSecondary max-w-2xl mx-auto text-sm sm:text-base px-2">
          Education, technical skills, and professional experience.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm md:text-base transition ${activeTab === tab.id
                ? "bg-designColor text-bodyColor shadow-glow"
                : "bg-surface text-textColor hover:border-designColor/30 border border-transparent"
                }`}
            >
              <Icon className="text-sm sm:text-base" />
              <span className="hidden xs:inline">{tab.label}</span>
              <span className="xs:hidden">{tab.label.substring(0, 3)}</span>
            </button>
          );
        })}
      </div>

      <div className="max-w-5xl mx-auto">
        {activeTab === "education" && <Education mode="education" appData={appData} />}
        {activeTab === "skills" && <Skills appData={appData} />}
        {activeTab === "experience" && <Education mode="experience" appData={appData} />}
        {activeTab === "languages" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
            {(appData?.languages || portfolioData.languages || []).map((lang) => (
              <div key={lang.id || lang.name} className="glass-card p-4 sm:p-5 text-center">
                <p className="font-semibold text-titleColor text-base mb-1">{lang.name}</p>
                <p className="text-xs text-designColor font-medium mb-3">{lang.level}</p>
                <div className="w-full bg-surfaceBorder/60 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-designColor h-full rounded-full transition-all duration-500"
                    style={{
                      width:
                        lang.level === "Native"
                          ? "100%"
                          : lang.level === "Professional"
                          ? "85%"
                          : lang.level === "Intermediate"
                          ? "65%"
                          : "45%",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Resume;
