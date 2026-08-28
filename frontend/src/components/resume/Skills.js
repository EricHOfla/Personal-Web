import React from "react";
import { portfolioData } from "../../data";

function Skills({ appData = portfolioData }) {
  const skills = appData?.skills || portfolioData.skills || [];

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
            {categorySkills.map((skill) => {
              const skillName = skill.skill_name || skill.name || "Skill";
              const level = skill.proficiency_level ?? skill.level ?? 0;
              return (
                <div key={skill.id || skillName}>
                  <div className="flex justify-between items-center mb-1.5 sm:mb-2">
                    <span className="text-titleColor font-medium text-sm sm:text-base">{skillName}</span>
                    <span className="text-xs sm:text-sm text-designColor font-semibold">
                      {level}%
                    </span>
                  </div>
                  <div className="h-1.5 sm:h-2 bg-surface rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-designColor to-cyan-500 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${level}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {skills.length === 0 && (
        <div className="glass-card p-8 sm:p-12 text-center">
          <p className="text-textSecondary text-sm sm:text-base">No skills data available</p>
        </div>
      )}
    </div>
  );
}

export default Skills;

