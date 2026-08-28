import React from "react";
import { FaGithub, FaExternalLinkAlt, FaCode } from "react-icons/fa";

function ProjectsCard({ project }) {
  const [imgError, setImgError] = React.useState(false);
  if (!project) return null;

  const {
    title = "Untitled Project",
    description,
    image,
    image_url,
    githubUrl,
    github_url,
    liveUrl,
    project_url,
    technologies = [],
    category = "Other",
  } = project;

  const imageSrc = image || image_url;
  const projectGithub = githubUrl || github_url;
  const projectLive = liveUrl || project_url;

  return (
    <article className="glass-card group overflow-hidden flex flex-col h-full">
      <div className="relative overflow-hidden h-40 xs:h-48 sm:h-52 md:h-56 bg-black/20">
        {imageSrc && !imgError ? (
          <img
            src={imageSrc}
            alt={title}
            className="w-full h-full object-contain transition duration-500 group-hover:scale-105"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-designColor/20 to-cyan-500/20 flex items-center justify-center">
            <FaCode className="text-4xl sm:text-5xl md:text-6xl text-white/20" />
          </div>
        )}

        <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
          <span className="inline-block px-2 sm:px-3 py-0.5 sm:py-1 bg-surface backdrop-blur-sm text-designColor text-[10px] sm:text-xs font-semibold rounded-full border border-designColor/30">
            {category || "Other"}
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-5 md:p-6 flex flex-col flex-1">
        <h3 className="text-base sm:text-lg md:text-xl font-bold text-titleColor mb-2 sm:mb-3 group-hover:text-designColor transition line-clamp-1">
          {title}
        </h3>

        <p className="text-xs sm:text-sm text-textSecondary leading-relaxed mb-3 sm:mb-4 flex-1 line-clamp-2 sm:line-clamp-3">
          {description || "No description available for this project."}
        </p>

        {technologies?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
            {technologies.slice(0, 4).map((tech, idx) => (
              <span
                key={idx}
                className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-surface text-designColor text-[10px] sm:text-xs rounded-md border border-designColor/20"
              >
                {tech}
              </span>
            ))}
            {technologies.length > 4 && (
              <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-textTertiary text-[10px] sm:text-xs">
                +{technologies.length - 4} more
              </span>
            )}
          </div>
        )}

        <div className="flex gap-1.5 sm:gap-2 md:gap-3 pt-2 sm:pt-3 md:pt-4 border-t border-surfaceBorder">
          {projectGithub && (
            <a
              href={projectGithub}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1 sm:gap-1.5 md:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-surface hover:border-designColor/30 border border-transparent rounded-lg text-[10px] xs:text-xs sm:text-sm font-medium text-textColor hover:text-designColor transition min-w-0"
            >
              <FaGithub className="text-xs sm:text-sm md:text-base flex-shrink-0" /> <span className="hidden xs:inline truncate">Code</span>
            </a>
          )}
          {projectLive && (
            <a
              href={projectLive}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1 sm:gap-1.5 md:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-designColor hover:bg-designColor/90 rounded-lg text-[10px] xs:text-xs sm:text-sm font-medium text-black transition min-w-0"
            >
              <FaExternalLinkAlt className="text-xs sm:text-sm md:text-base flex-shrink-0" /> <span className="hidden xs:inline truncate">Live</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default React.memo(ProjectsCard);

