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
    <div className="flex justify-center py-8 sm:py-12">
      <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-designColor border-t-transparent rounded-full animate-spin"></div>
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
