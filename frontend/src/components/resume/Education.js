import React, { useEffect, useState } from "react";
import ResumeTitle from "./ResumeTitle";
import { MdWork } from "react-icons/md";
import { GiGraduateCap } from "react-icons/gi";
import ResumeCard from "./ResumeCard";
import { getEducation } from "../../services/educationService";
import { getExperiences } from "../../services/experiencesService";

const Education = ({ mode = "all" }) => {
  const [education, setEducation] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eduData = await getEducation();
        const expData = await getExperiences();
        setEducation(Array.isArray(eduData) ? eduData : eduData.results || []);
        setExperiences(
          Array.isArray(expData) ? expData : expData.results || []
        );
      } catch (err) {
        console.error("Failed to fetch resume data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return (
    <div className="education-section space-y-6 sm:space-y-8">
      <div className="space-y-4 sm:space-y-6">
        <div className="skeleton h-8 w-1/3 mb-4"></div>
        <div className="education-list space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card p-6 space-y-3">
              <div className="skeleton h-6 w-1/2"></div>
              <div className="skeleton h-4 w-1/3"></div>
              <div className="skeleton h-4 w-full"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="education-section space-y-6 sm:space-y-8">
      {(mode === "all" || mode === "education") && (
        <div className="space-y-4 sm:space-y-6">
          <ResumeTitle title="Education" icon={<GiGraduateCap />} />
          <div className="education-list">
            {education.length ? (
              education.map((item) => (
                <ResumeCard key={item.id} item={item} type="education" />
              ))
            ) : (
              <p className="text-gray-400 text-sm sm:text-base text-center py-4">No education records.</p>
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
                <ResumeCard key={item.id} item={item} type="experience" />
              ))
            ) : (
              <p className="text-gray-400 text-sm sm:text-base text-center py-4">No experiences added.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Education;
