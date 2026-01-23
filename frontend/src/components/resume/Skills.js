import React, { useEffect, useState } from "react";
import { getSkills } from "../../services/skillsService";

function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await getSkills();
        setSkills(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        console.error("Failed to fetch skills:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="glass-card p-4 sm:p-6">
            <div className="skeleton h-4 w-24 mb-3"></div>
            <div className="skeleton h-2 w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {});

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {Object.entries(groupedSkills).map(([category, categorySkills]) => (
        <div key={category} className="glass-card p-4 sm:p-6 md:p-8">
          <h3 className="text-base sm:text-lg md:text-xl font-semibold text-designColor mb-4 sm:mb-6">{category}</h3>
          <div className="grid gap-4 sm:gap-5 md:gap-6">
            {categorySkills.map((skill) => (
              <div key={skill.id}>
                <div className="flex justify-between items-center mb-1.5 sm:mb-2">
                  <span className="text-titleColor font-medium text-sm sm:text-base">{skill.skill_name}</span>
                  <span className="text-xs sm:text-sm text-designColor font-semibold">
                    {skill.proficiency_level || 0}%
                  </span>
                </div>
                <div className="h-1.5 sm:h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-designColor to-cyan-500 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${skill.proficiency_level || 0}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {skills.length === 0 && (
        <div className="glass-card p-8 sm:p-12 text-center">
          <p className="text-gray-300 text-sm sm:text-base">No skills data available</p>
        </div>
      )}
    </div>
  );
}

export default Skills;
