import React from "react";
import ResumeTitle from "./ResumeTitle";
import { MdWork } from "react-icons/md";
import { GiGraduateCap } from "react-icons/gi";
import ResumeCard from "./ResumeCard";
import { portfolioData } from "../../data";

const Education = ({ mode = "all", appData = portfolioData }) => {
  const education = appData?.education || portfolioData.education || [];
  const experiences = appData?.experiences || appData?.experience || portfolioData.experiences || [];

  return (
    <div className="education-section space-y-6 sm:space-y-8">
      {(mode === "all" || mode === "education") && (
        <div className="space-y-4 sm:space-y-6">
          <ResumeTitle title="Education" icon={<GiGraduateCap />} />
          <div className="education-list">
            {education.length ? (
              education.map((item) => (
                <ResumeCard key={item.id || item.degree} item={item} type="education" />
              ))
            ) : (
              <p className="text-textTertiary text-sm sm:text-base text-center py-4">No education records.</p>
            )}
          </div>
        </div>
      )}

      {(mode === "all" || mode === "experience") && (
        <div className="space-y-4 sm:space-y-6">
          <ResumeTitle title="Experience" icon={<MdWork />} />
          <div className="experience-list">
            {experiences.length ? (
              experiences.map((item) => (
                <ResumeCard key={item.id || item.job_title || item.title} item={item} type="experience" />
              ))
            ) : (
              <p className="text-textTertiary text-sm sm:text-base text-center py-4">No experiences added.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Education;

