import React, { useEffect, useState } from "react";
import { getProjects } from "../../services/projectsService";
import ProjectsCard from "./ProjectsCard";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const categories = ["all", ...new Set(projects.map((p) => p.category).filter(Boolean))];
  const filteredProjects = filter === "all" ? projects : projects.filter((p) => p.category === filter);

  if (loading) {
    return (
      <section className="app-shell">
        <div className="section-header">
          <p className="section-label">Projects</p>
          <h1 className="section-title">Featured Work</h1>
        </div>
        <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4">
              <div className="skeleton h-40 xs:h-48 sm:h-52 md:h-56 w-full"></div>
              <div className="skeleton h-3 sm:h-4 w-3/4"></div>
              <div className="skeleton h-3 sm:h-4 w-full"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="app-shell">
        <div className="glass-card p-4 sm:p-6 md:p-8 text-center">
          <p className="text-red-400 mb-3 sm:mb-4 text-sm sm:text-base">⚠️ Failed to load projects</p>
          <p className="text-textSecondary text-xs sm:text-sm">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="app-shell">
      <div className="section-header">
        <p className="section-label">Projects</p>
        <h1 className="section-title">Featured Work</h1>
        <p className="text-textSecondary max-w-2xl mx-auto mb-4 sm:mb-6 md:mb-8 text-sm sm:text-base px-2">
          A collection of my recent projects showcasing various technologies and solutions.
        </p>

        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 px-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition ${filter === cat
                  ? "bg-designColor text-bodyColor"
                  : "bg-surface text-textColor hover:border-designColor/30 border border-transparent"
                }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filteredProjects.length > 0 ? (
        <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectsCard key={project?.id || project?.title} project={project} />
          ))}
        </div>
      ) : (
        <div className="glass-card p-6 sm:p-8 md:p-12 text-center">
          <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">🚀</div>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-2">No projects found</p>
          <p className="text-textSecondary text-sm sm:text-base">Try selecting a different category</p>
        </div>
      )}
    </section>
  );
}

export default Projects;
