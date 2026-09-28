import React, { useState, useEffect } from "react";
import { portfolioData as initialData } from "../../data";
import { commitPortfolioDataToGitHub, serializePortfolioData } from "../../utils/githubSync";
import {
  FaArrowLeft,
  FaGithub,
  FaKey,
  FaPlus,
  FaTrash,
  FaSave,
  FaCheck,
  FaSpinner,
  FaCode,
  FaBriefcase,
  FaGraduationCap,
  FaCertificate,
  FaNewspaper,
  FaUser,
  FaDownload,
  FaEye,
} from "react-icons/fa";

const Admin = () => {
  // Load stored data or fall back to portfolioData
  const [data, setData] = useState(() => {
    const cached = localStorage.getItem("admin_portfolio_data");
    return cached ? JSON.parse(cached) : initialData;
  });

  const [activeTab, setActiveTab] = useState("projects");
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [showJsonPreview, setShowJsonPreview] = useState(false);

  // GitHub Settings stored in localStorage
  const [githubSettings, setGithubSettings] = useState({
    token: localStorage.getItem("gh_token") || "",
    owner: localStorage.getItem("gh_owner") || "EricHOfla",
    repo: localStorage.getItem("gh_repo") || "Personal-Web",
    path: localStorage.getItem("gh_path") || "frontend/src/data/index.js",
    branch: localStorage.getItem("gh_branch") || "main",
  });

  // Save changes locally to localStorage
  const updateData = (newData) => {
    setData(newData);
    setHasUnsavedChanges(true);
    localStorage.setItem("admin_portfolio_data", JSON.stringify(newData));
  };

  const handleSettingsChange = (field, value) => {
    const updated = { ...githubSettings, [field]: value };
    setGithubSettings(updated);
    localStorage.setItem(`gh_${field}`, value);
  };

  // ================= Form States =================
  // 1. New Project Form
  const [newProject, setNewProject] = useState({
    title: "",
    category: "Web",
    description: "",
    liveUrl: "",
    githubUrl: "",
    technologies: "",
  });

  // 2. New Blog Post Form
  const [newBlog, setNewBlog] = useState({
    title: "",
    slug: "",
    category: "Development",
    excerpt: "",
    content: "",
    reading_time: 4,
    published_date: new Date().toISOString().split("T")[0],
  });

  // 3. New Skill Form
  const [newSkill, setNewSkill] = useState({
    name: "",
    category: "Coding",
    level: 90,
  });

  // 4. New Experience Form
  const [newExp, setNewExp] = useState({
    title: "",
    company: "",
    location: "Kigali, Rwanda",
    duration: "2024 - Present",
    description: "",
  });

  // 5. New Education Form
  const [newEdu, setNewEdu] = useState({
    degree: "",
    institution: "",
    location: "Rwanda",
    duration: "2023 - Present",
    description: "",
  });

  // 6. New Certification Form
  const [newCert, setNewCert] = useState({
    name: "",
    issuer: "",
    year: "2025",
  });

  // 7. Profile Form
  const [profileForm, setProfileForm] = useState(data.profile || {});

  useEffect(() => {
    setProfileForm(data.profile || {});
  }, [data.profile]);

  // ================= Add Handlers =================
  const handleAddProject = (e) => {
    e.preventDefault();
    if (!newProject.title) return;
    const techArray = newProject.technologies
      ? newProject.technologies.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    const item = {
      id: Date.now(),
      title: newProject.title,
      category: newProject.category,
      description: newProject.description,
      image: "",
      image_url: "",
      project_url: newProject.liveUrl,
      liveUrl: newProject.liveUrl,
      github_url: newProject.githubUrl,
      githubUrl: newProject.githubUrl,
      technologies: techArray,
    };

    updateData({
      ...data,
      projects: [item, ...(data.projects || [])],
    });

    setNewProject({
      title: "",
      category: "Web",
      description: "",
      liveUrl: "",
      githubUrl: "",
      technologies: "",
    });
    setStatusMsg({ type: "success", text: `Added project "${item.title}" successfully!` });
  };

  const handleDeleteProject = (id) => {
    if (!window.confirm("Delete this project?")) return;
    updateData({
      ...data,
      projects: (data.projects || []).filter((p) => p.id !== id),
    });
  };

  const handleAddBlog = (e) => {
    e.preventDefault();
    if (!newBlog.title) return;
    const slug =
      newBlog.slug ||
      newBlog.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

    const item = {
      id: Date.now(),
      title: newBlog.title,
      slug,
      category: newBlog.category,
      excerpt: newBlog.excerpt,
      content: newBlog.content,
      featured_image: "",
      published_date: newBlog.published_date,
      reading_time: Number(newBlog.reading_time) || 3,
      views_count: 1,
      user: {
        full_name: data.profile?.fullName || "HABUMUGISHA Eric",
        first_name: data.profile?.firstName || "Eric",
      },
    };

    updateData({
      ...data,
      blogPosts: [item, ...(data.blogPosts || [])],
    });

    setNewBlog({
      title: "",
      slug: "",
      category: "Development",
      excerpt: "",
      content: "",
      reading_time: 4,
      published_date: new Date().toISOString().split("T")[0],
    });
    setStatusMsg({ type: "success", text: `Added article "${item.title}" successfully!` });
  };

  const handleDeleteBlog = (id) => {
    if (!window.confirm("Delete this blog post?")) return;
    updateData({
      ...data,
      blogPosts: (data.blogPosts || []).filter((b) => b.id !== id),
    });
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkill.name) return;
    const item = {
      id: Date.now(),
      category: newSkill.category,
      skill_name: newSkill.name,
      name: newSkill.name,
      proficiency_level: Number(newSkill.level) || 85,
      level: Number(newSkill.level) || 85,
    };

    updateData({
      ...data,
      skills: [...(data.skills || []), item],
    });

    setNewSkill({ name: "", category: "Coding", level: 90 });
    setStatusMsg({ type: "success", text: `Added skill "${item.name}"!` });
  };

  const handleDeleteSkill = (id) => {
    updateData({
      ...data,
      skills: (data.skills || []).filter((s) => s.id !== id),
    });
  };

  const handleAddExperience = (e) => {
    e.preventDefault();
    if (!newExp.title || !newExp.company) return;
    const item = {
      id: Date.now(),
      job_title: newExp.title,
      title: newExp.title,
      company: newExp.company,
      location: newExp.location,
      time_period: newExp.duration,
      duration: newExp.duration,
      description: newExp.description,
    };

    updateData({
      ...data,
      experiences: [item, ...(data.experiences || [])],
    });

    setNewExp({
      title: "",
      company: "",
      location: "Kigali, Rwanda",
      duration: "2024 - Present",
      description: "",
    });
    setStatusMsg({ type: "success", text: `Added experience at "${item.company}"!` });
  };

  const handleDeleteExperience = (id) => {
    updateData({
      ...data,
      experiences: (data.experiences || []).filter((e) => e.id !== id),
    });
  };

  const handleAddEducation = (e) => {
    e.preventDefault();
    if (!newEdu.degree || !newEdu.institution) return;
    const item = {
      id: Date.now(),
      degree: newEdu.degree,
      institution: newEdu.institution,
      location: newEdu.location,
      time_period: newEdu.duration,
      duration: newEdu.duration,
      description: newEdu.description,
    };

    updateData({
      ...data,
      education: [item, ...(data.education || [])],
    });

    setNewEdu({
      degree: "",
      institution: "",
      location: "Rwanda",
      duration: "2023 - Present",
      description: "",
    });
    setStatusMsg({ type: "success", text: `Added education record!` });
  };

  const handleDeleteEducation = (id) => {
    updateData({
      ...data,
      education: (data.education || []).filter((e) => e.id !== id),
    });
  };

  const handleAddCertification = (e) => {
    e.preventDefault();
    if (!newCert.name) return;
    const item = {
      id: Date.now(),
      name: newCert.name,
      issuer: newCert.issuer,
      year: newCert.year,
    };

    updateData({
      ...data,
      certifications: [...(data.certifications || []), item],
    });

    setNewCert({ name: "", issuer: "", year: "2025" });
    setStatusMsg({ type: "success", text: `Added certification "${item.name}"!` });
  };

  const handleDeleteCertification = (id) => {
    updateData({
      ...data,
      certifications: (data.certifications || []).filter((c) => c.id !== id),
    });
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateData({
      ...data,
      profile: {
        ...data.profile,
        ...profileForm,
        fullName: profileForm.fullName || profileForm.full_name,
        full_name: profileForm.fullName || profileForm.full_name,
      },
    });
    setStatusMsg({ type: "success", text: "Profile updated in working memory!" });
  };

  // ================= GitHub Save / Deploy =================
  const handleSaveToGitHub = async () => {
    if (!githubSettings.token) {
      setShowConfig(true);
      setStatusMsg({
        type: "error",
        text: "Please enter your GitHub Personal Access Token in Settings below to save & deploy.",
      });
      return;
    }

    setIsSaving(true);
    setStatusMsg({ type: "info", text: "Saving to GitHub repository and triggering Vercel build..." });

    try {
      const result = await commitPortfolioDataToGitHub({
        token: githubSettings.token,
        owner: githubSettings.owner,
        repo: githubSettings.repo,
        path: githubSettings.path,
        branch: githubSettings.branch,
        data: data,
        commitMessage: `Admin: Update portfolio data via Admin Panel (${new Date().toLocaleDateString()})`,
      });

      setIsSaving(false);
      setHasUnsavedChanges(false);
      setStatusMsg({
        type: "success",
        text: `🚀 Saved successfully to GitHub (Commit: ${result.commit?.sha?.substring(0, 7) || "ok"})! Vercel is building your live static update now (takes ~20s).`,
      });
    } catch (err) {
      setIsSaving(false);
      setStatusMsg({
        type: "error",
        text: `Error committing to GitHub: ${err.message}`,
      });
    }
  };

  const handleDownloadFile = () => {
    const code = serializePortfolioData(data);
    const blob = new Blob([code], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "index.js";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#0f1117] text-gray-100 font-sans p-4 sm:p-8">
      {/* Top Header */}
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-800">
        <div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="p-2 rounded-xl bg-gray-800/80 hover:bg-gray-700 text-purple-400 hover:text-purple-300 transition-all flex items-center gap-2 text-sm"
              title="Return to Portfolio"
            >
              <FaArrowLeft /> Back to Website
            </a>
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Portfolio Admin Panel
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Add & manage content without databases. Saves directly to <code className="text-purple-300">src/data/index.js</code>.
          </p>
        </div>

        {/* Global Actions */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="px-3 py-2 text-xs sm:text-sm bg-gray-800 hover:bg-gray-700 rounded-xl border border-gray-700 flex items-center gap-2 transition"
          >
            <FaKey className="text-yellow-400" />
            GitHub Settings
          </button>

          <button
            onClick={handleDownloadFile}
            className="px-3 py-2 text-xs sm:text-sm bg-gray-800 hover:bg-gray-700 rounded-xl border border-gray-700 flex items-center gap-2 transition"
            title="Download index.js file"
          >
            <FaDownload />
            Download index.js
          </button>

          <button
            onClick={handleSaveToGitHub}
            disabled={isSaving}
            className={`px-4 py-2 text-xs sm:text-sm rounded-xl font-medium flex items-center gap-2 shadow-lg transition-all ${
              hasUnsavedChanges
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-900/40 animate-pulse"
                : "bg-purple-700 hover:bg-purple-600 text-white"
            } disabled:opacity-50`}
          >
            {isSaving ? <FaSpinner className="animate-spin" /> : <FaSave />}
            {isSaving ? "Publishing..." : hasUnsavedChanges ? "Save & Deploy to Live Site *" : "Save & Deploy"}
          </button>
        </div>
      </div>

      {/* Status Notifications */}
      {statusMsg.text && (
        <div className="max-w-6xl mx-auto mt-4">
          <div
            className={`p-3 sm:p-4 rounded-xl text-sm flex items-center justify-between border ${
              statusMsg.type === "success"
                ? "bg-green-950/50 border-green-700/60 text-green-200"
                : statusMsg.type === "error"
                ? "bg-red-950/50 border-red-700/60 text-red-200"
                : "bg-blue-950/50 border-blue-700/60 text-blue-200"
            }`}
          >
            <div className="flex items-center gap-2">
              {statusMsg.type === "success" && <FaCheck className="text-green-400" />}
              <span>{statusMsg.text}</span>
            </div>
            <button
              onClick={() => setStatusMsg({ type: "", text: "" })}
              className="text-xs underline opacity-70 hover:opacity-100"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* GitHub Settings Modal / Dropdown */}
      {showConfig && (
        <div className="max-w-6xl mx-auto mt-4 p-5 bg-gray-900/90 border border-purple-900/50 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-800">
            <h3 className="text-sm font-semibold flex items-center gap-2 text-purple-300">
              <FaGithub /> GitHub Repository Configuration
            </h3>
            <span className="text-xs text-gray-400">Stored safely in your browser only</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-gray-400 mb-1">GitHub Personal Access Token</label>
              <input
                type="password"
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                value={githubSettings.token}
                onChange={(e) => handleSettingsChange("token", e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 outline-none"
              />
              <a
                href="https://github.com/settings/tokens/new?scopes=repo&description=Portfolio%20Admin%20Panel"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-purple-400 hover:underline mt-1 inline-block"
              >
                Create a classic token with 'repo' scope →
              </a>
            </div>

            <div>
              <label className="block text-gray-400 mb-1">Repository Owner</label>
              <input
                type="text"
                value={githubSettings.owner}
                onChange={(e) => handleSettingsChange("owner", e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1">Repository Name</label>
              <input
                type="text"
                value={githubSettings.repo}
                onChange={(e) => handleSettingsChange("repo", e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1">File Path</label>
              <input
                type="text"
                value={githubSettings.path}
                onChange={(e) => handleSettingsChange("path", e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1">Branch</label>
              <input
                type="text"
                value={githubSettings.branch}
                onChange={(e) => handleSettingsChange("branch", e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation Tabs */}
      <div className="max-w-6xl mx-auto mt-6 flex flex-wrap gap-2 pb-2 border-b border-gray-800 text-xs sm:text-sm">
        {[
          { id: "projects", label: "Projects", count: data.projects?.length || 0, icon: FaCode },
          { id: "blog", label: "Blog Posts", count: data.blogPosts?.length || 0, icon: FaNewspaper },
          { id: "skills", label: "Skills", count: data.skills?.length || 0, icon: FaCode },
          { id: "experience", label: "Experience", count: data.experiences?.length || 0, icon: FaBriefcase },
          { id: "education", label: "Education", count: data.education?.length || 0, icon: FaGraduationCap },
          { id: "certifications", label: "Certificates", count: data.certifications?.length || 0, icon: FaCertificate },
          { id: "profile", label: "Profile / Bio", icon: FaUser },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all ${
                isActive
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-900/30"
                  : "bg-gray-900/80 text-gray-400 hover:text-gray-200 hover:bg-gray-800"
              }`}
            >
              <Icon />
              {tab.label}
              {tab.count !== undefined && (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-black/40 text-gray-300">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="max-w-6xl mx-auto mt-6">
        {/* ======================= TAB 1: PROJECTS ======================= */}
        {activeTab === "projects" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Add Project Form */}
            <div className="lg:col-span-1 bg-gray-900/90 border border-gray-800 p-5 rounded-2xl shadow-xl">
              <h2 className="text-base font-semibold flex items-center gap-2 mb-4 text-purple-300">
                <FaPlus /> Add New Project
              </h2>
              <form onSubmit={handleAddProject} className="space-y-3 text-xs">
                <div>
                  <label className="block text-gray-400 mb-1">Project Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AI Content Platform"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">Category</label>
                  <select
                    value={newProject.category}
                    onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500"
                  >
                    <option value="Web">Web Application</option>
                    <option value="Mobile">Mobile Application</option>
                    <option value="Portfolio">Portfolio / Showcase</option>
                    <option value="Backend">Backend / API</option>
                    <option value="AI">AI / Machine Learning</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">Description *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Brief summary of the project features and architecture..."
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">Live URL (Demo)</label>
                  <input
                    type="url"
                    placeholder="https://my-app.vercel.app"
                    value={newProject.liveUrl}
                    onChange={(e) => setNewProject({ ...newProject, liveUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">GitHub Repo URL</label>
                  <input
                    type="url"
                    placeholder="https://github.com/EricHOfla/my-app"
                    value={newProject.githubUrl}
                    onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">Technologies (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="React, Node.js, Tailwind CSS, TypeScript"
                    value={newProject.technologies}
                    onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 mt-2 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-xl transition flex items-center justify-center gap-2"
                >
                  <FaPlus /> Add to Projects
                </button>
              </form>
            </div>

            {/* Existing Projects List */}
            <div className="lg:col-span-2 space-y-3">
              <h2 className="text-base font-semibold text-gray-300">
                Current Projects ({data.projects?.length || 0})
              </h2>
              {data.projects?.map((proj) => (
                <div
                  key={proj.id}
                  className="p-4 bg-gray-900/70 border border-gray-800 rounded-2xl flex items-start justify-between gap-4 hover:border-gray-700 transition"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded bg-purple-900/50 text-purple-300 border border-purple-800/50">
                        {proj.category}
                      </span>
                      <h3 className="font-semibold text-sm text-white">{proj.title}</h3>
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-2">{proj.description}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {proj.technologies?.map((tech, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 bg-gray-800 rounded text-gray-300">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-3 text-xs pt-1 text-purple-400">
                      {proj.liveUrl && (
                        <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="hover:underline">
                          Live Demo ↗
                        </a>
                      )}
                      {proj.githubUrl && (
                        <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="hover:underline">
                          GitHub ↗
                        </a>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteProject(proj.id)}
                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition"
                    title="Delete project"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================= TAB 2: BLOG ======================= */}
        {activeTab === "blog" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-gray-900/90 border border-gray-800 p-5 rounded-2xl shadow-xl">
              <h2 className="text-base font-semibold flex items-center gap-2 mb-4 text-purple-300">
                <FaPlus /> Write New Blog Post
              </h2>
              <form onSubmit={handleAddBlog} className="space-y-3 text-xs">
                <div>
                  <label className="block text-gray-400 mb-1">Article Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Modern Web Architecture in 2026"
                    value={newBlog.title}
                    onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">Category</label>
                  <input
                    type="text"
                    placeholder="Development, AI, Tutorial"
                    value={newBlog.category}
                    onChange={(e) => setNewBlog({ ...newBlog, category: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">Excerpt / Short Summary *</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Short overview shown on blog cards..."
                    value={newBlog.excerpt}
                    onChange={(e) => setNewBlog({ ...newBlog, excerpt: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">Full Content (Paragraphs) *</label>
                  <textarea
                    rows={6}
                    required
                    placeholder="Full article body content..."
                    value={newBlog.content}
                    onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 font-mono text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-gray-400 mb-1">Read Time (min)</label>
                    <input
                      type="number"
                      value={newBlog.reading_time}
                      onChange={(e) => setNewBlog({ ...newBlog, reading_time: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Publish Date</label>
                    <input
                      type="date"
                      value={newBlog.published_date}
                      onChange={(e) => setNewBlog({ ...newBlog, published_date: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 mt-2 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-xl transition flex items-center justify-center gap-2"
                >
                  <FaPlus /> Add Blog Post
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 space-y-3">
              <h2 className="text-base font-semibold text-gray-300">
                Published Articles ({data.blogPosts?.length || 0})
              </h2>
              {data.blogPosts?.map((post) => (
                <div
                  key={post.id}
                  className="p-4 bg-gray-900/70 border border-gray-800 rounded-2xl flex items-start justify-between gap-4"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2 py-0.5 rounded bg-indigo-900/50 text-indigo-300 border border-indigo-800/50">
                        {post.category}
                      </span>
                      <span className="text-gray-400">{post.published_date}</span>
                      <span className="text-gray-500">• {post.reading_time} min read</span>
                    </div>
                    <h3 className="font-semibold text-sm text-white">{post.title}</h3>
                    <p className="text-xs text-gray-400 line-clamp-2">{post.excerpt}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteBlog(post.id)}
                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition"
                    title="Delete post"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================= TAB 3: SKILLS ======================= */}
        {activeTab === "skills" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-gray-900/90 border border-gray-800 p-5 rounded-2xl shadow-xl">
              <h2 className="text-base font-semibold flex items-center gap-2 mb-4 text-purple-300">
                <FaPlus /> Add Skill
              </h2>
              <form onSubmit={handleAddSkill} className="space-y-3 text-xs">
                <div>
                  <label className="block text-gray-400 mb-1">Skill Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Next.js, Docker, Python"
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">Category</label>
                  <select
                    value={newSkill.category}
                    onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500"
                  >
                    <option value="Coding">Coding / Frameworks</option>
                    <option value="Languages">Languages</option>
                    <option value="Design">Design / UI</option>
                    <option value="Knowledge">Knowledge / Cloud</option>
                    <option value="Tools">Tools & DevOps</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">Proficiency Level: {newSkill.level}%</label>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={newSkill.level}
                    onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 mt-2 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-xl transition flex items-center justify-center gap-2"
                >
                  <FaPlus /> Add Skill
                </button>
              </form>
            </div>

            <div className="lg:col-span-2">
              <h2 className="text-base font-semibold text-gray-300 mb-3">
                Skills List ({data.skills?.length || 0})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.skills?.map((skill) => (
                  <div
                    key={skill.id}
                    className="p-3 bg-gray-900/70 border border-gray-800 rounded-xl flex items-center justify-between"
                  >
                    <div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-gray-800 text-purple-300">
                        {skill.category}
                      </span>
                      <h4 className="font-semibold text-sm text-white mt-1">{skill.name || skill.skill_name}</h4>
                      <p className="text-xs text-gray-400">{skill.proficiency_level || skill.level}% proficiency</p>
                    </div>
                    <button
                      onClick={() => handleDeleteSkill(skill.id)}
                      className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB 4: EXPERIENCE ======================= */}
        {activeTab === "experience" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-gray-900/90 border border-gray-800 p-5 rounded-2xl shadow-xl">
              <h2 className="text-base font-semibold flex items-center gap-2 mb-4 text-purple-300">
                <FaPlus /> Add Work Experience
              </h2>
              <form onSubmit={handleAddExperience} className="space-y-3 text-xs">
                <div>
                  <label className="block text-gray-400 mb-1">Job Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Full Stack Engineer"
                    value={newExp.title}
                    onChange={(e) => setNewExp({ ...newExp, title: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">Company / Organization *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. TechCorp Solutions"
                    value={newExp.company}
                    onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">Time Period *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2024 - Present or 2022 - 2024"
                    value={newExp.duration}
                    onChange={(e) => setNewExp({ ...newExp, duration: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="Kigali, Rwanda or Remote"
                    value={newExp.location}
                    onChange={(e) => setNewExp({ ...newExp, location: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">Description / Responsibilities *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Key accomplishments, technologies used, responsibilities..."
                    value={newExp.description}
                    onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 mt-2 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-xl transition flex items-center justify-center gap-2"
                >
                  <FaPlus /> Add Experience
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 space-y-3">
              <h2 className="text-base font-semibold text-gray-300">
                Work Experience ({data.experiences?.length || 0})
              </h2>
              {data.experiences?.map((exp) => (
                <div
                  key={exp.id}
                  className="p-4 bg-gray-900/70 border border-gray-800 rounded-2xl flex items-start justify-between gap-4"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm text-white">{exp.job_title || exp.title}</h3>
                      <span className="text-xs text-purple-300">{exp.time_period || exp.duration}</span>
                    </div>
                    <p className="text-xs text-gray-400 font-medium">{exp.company} — {exp.location}</p>
                    <p className="text-xs text-gray-400 pt-1">{exp.description}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteExperience(exp.id)}
                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================= TAB 5: EDUCATION ======================= */}
        {activeTab === "education" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-gray-900/90 border border-gray-800 p-5 rounded-2xl shadow-xl">
              <h2 className="text-base font-semibold flex items-center gap-2 mb-4 text-purple-300">
                <FaPlus /> Add Education
              </h2>
              <form onSubmit={handleAddEducation} className="space-y-3 text-xs">
                <div>
                  <label className="block text-gray-400 mb-1">Degree / Qualification *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bachelor of Science in Software Engineering"
                    value={newEdu.degree}
                    onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">Institution / University *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. UNILAK"
                    value={newEdu.institution}
                    onChange={(e) => setNewEdu({ ...newEdu, institution: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">Time Period</label>
                  <input
                    type="text"
                    placeholder="e.g. 2023 - Present"
                    value={newEdu.duration}
                    onChange={(e) => setNewEdu({ ...newEdu, duration: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">Description / Major</label>
                  <textarea
                    rows={3}
                    placeholder="Coursework, honors, major subjects..."
                    value={newEdu.description}
                    onChange={(e) => setNewEdu({ ...newEdu, description: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 mt-2 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-xl transition flex items-center justify-center gap-2"
                >
                  <FaPlus /> Add Education
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 space-y-3">
              <h2 className="text-base font-semibold text-gray-300">
                Education History ({data.education?.length || 0})
              </h2>
              {data.education?.map((edu) => (
                <div
                  key={edu.id}
                  className="p-4 bg-gray-900/70 border border-gray-800 rounded-2xl flex items-start justify-between gap-4"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm text-white">{edu.degree}</h3>
                      <span className="text-xs text-purple-300">{edu.time_period || edu.duration}</span>
                    </div>
                    <p className="text-xs text-gray-400 font-medium">{edu.institution} — {edu.location}</p>
                    <p className="text-xs text-gray-400 pt-1">{edu.description}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteEducation(edu.id)}
                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================= TAB 6: CERTIFICATES ======================= */}
        {activeTab === "certifications" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-gray-900/90 border border-gray-800 p-5 rounded-2xl shadow-xl">
              <h2 className="text-base font-semibold flex items-center gap-2 mb-4 text-purple-300">
                <FaPlus /> Add Certificate
              </h2>
              <form onSubmit={handleAddCertification} className="space-y-3 text-xs">
                <div>
                  <label className="block text-gray-400 mb-1">Certificate Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AWS Certified Solutions Architect"
                    value={newCert.name}
                    onChange={(e) => setNewCert({ ...newCert, name: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">Issuer Organization *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Amazon Web Services, Meta, Coursera"
                    value={newCert.issuer}
                    onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">Year</label>
                  <input
                    type="text"
                    placeholder="2025"
                    value={newCert.year}
                    onChange={(e) => setNewCert({ ...newCert, year: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 mt-2 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-xl transition flex items-center justify-center gap-2"
                >
                  <FaPlus /> Add Certificate
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 space-y-3">
              <h2 className="text-base font-semibold text-gray-300">
                Certificates ({data.certifications?.length || 0})
              </h2>
              {data.certifications?.map((cert) => (
                <div
                  key={cert.id}
                  className="p-4 bg-gray-900/70 border border-gray-800 rounded-2xl flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-semibold text-sm text-white">{cert.name}</h3>
                    <p className="text-xs text-gray-400">{cert.issuer} • {cert.year}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteCertification(cert.id)}
                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================= TAB 7: PROFILE ======================= */}
        {activeTab === "profile" && (
          <div className="max-w-2xl bg-gray-900/90 border border-gray-800 p-6 rounded-2xl shadow-xl">
            <h2 className="text-base font-semibold text-purple-300 mb-4 flex items-center gap-2">
              <FaUser /> Edit Profile & Bio
            </h2>
            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profileForm.fullName || profileForm.full_name || ""}
                    onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value, full_name: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Primary Title</label>
                  <input
                    type="text"
                    value={profileForm.title || ""}
                    onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 mb-1">Email</label>
                  <input
                    type="email"
                    value={profileForm.email || ""}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Phone</label>
                  <input
                    type="text"
                    value={profileForm.phone || ""}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Location / Residence</label>
                <input
                  type="text"
                  value={profileForm.location || profileForm.address || ""}
                  onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value, address: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Bio & Summary (Included in Website & CV)</label>
                <textarea
                  rows={5}
                  value={profileForm.bio || ""}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-xl transition flex items-center gap-2"
              >
                <FaCheck /> Apply Profile Changes
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="max-w-6xl mx-auto mt-12 pt-6 border-t border-gray-800/80 text-center text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>Portfolio Admin Panel • Static Flat-File Architecture</span>
        <button
          onClick={() => setShowJsonPreview(!showJsonPreview)}
          className="text-purple-400 hover:underline flex items-center gap-1"
        >
          <FaEye /> {showJsonPreview ? "Hide Data Code" : "Preview Generated Data Code"}
        </button>
      </div>

      {showJsonPreview && (
        <div className="max-w-6xl mx-auto mt-4 p-4 bg-gray-950 border border-gray-800 rounded-xl overflow-x-auto text-[11px] font-mono text-gray-300">
          <pre>{serializePortfolioData(data)}</pre>
        </div>
      )}
    </div>
  );
};

export default Admin;
