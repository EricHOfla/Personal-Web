import React, { useState } from "react";
import Title from "../home/Title";
import Education from "./Education";
import Skills from "./Skills";
import { FaGraduationCap, FaCode, FaBriefcase } from "react-icons/fa";

const Resume = ({ appData }) => {
  const [activeTab, setActiveTab] = useState("education");

  const tabs = [
    { id: "education", label: "Education", icon: FaGraduationCap },
    { id: "skills", label: "Skills", icon: FaCode },
    { id: "experience", label: "Experience", icon: FaBriefcase },
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
      </div>
    </section>
  );
};

export default Resume;
