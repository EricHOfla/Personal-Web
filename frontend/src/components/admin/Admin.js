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
  FaEyeSlash,
  FaLock,
  FaSignOutAlt,
  FaShieldAlt,
  FaEdit,
  FaTimes,
  FaShareAlt,
  FaToolbox,
  FaTrophy,
  FaQuoteLeft,
  FaGlobe,
} from "react-icons/fa";

// Cryptographic SHA-256 helper
const hashPassword = async (str) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};

const Admin = () => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("admin_authenticated") === "true";
  });
  const [passwordInput, setPasswordInput] = useState("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");

  const [tokenResetInput, setTokenResetInput] = useState("");
  const [isVerifyingToken, setIsVerifyingToken] = useState(false);
  const [showTokenReset, setShowTokenReset] = useState(false);

  // Check if returning from GitHub OAuth redirect
  useEffect(() => {
    const fullHash = window.location.hash || "";
    const fullSearch = window.location.search || "";
    const combined = fullHash + "&" + fullSearch;

    if (combined.includes("token=")) {
      const cleaned = combined.replace(/^#admin\??/, "").replace(/^\?/, "");
      const params = new URLSearchParams(cleaned);
      const urlToken = params.get("token");
      const urlUser = params.get("user");

      if (urlToken) {
        localStorage.setItem("gh_token", urlToken);
        setGithubSettings((prev) => ({ ...prev, token: urlToken }));
        sessionStorage.setItem("admin_authenticated", "true");
        setIsAuthenticated(true);
        setStatusMsg({
          type: "success",
          text: `🎉 Successfully signed in with GitHub as @${urlUser || "EricHOfla"}!`,
        });
        window.history.replaceState({}, document.title, window.location.pathname + "#admin");
      }
    }
  }, []);

  const handleGitHubOAuthLogin = () => {
    const clientId = process.env.REACT_APP_GITHUB_CLIENT_ID || "Ov23libr3bYt8U1NwM9j";
    const scope = "repo,user";
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=${scope}`;
  };

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
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showTokenText, setShowTokenText] = useState(false);

  // GitHub Settings stored in localStorage
  const [githubSettings, setGithubSettings] = useState({
    token: localStorage.getItem("gh_token") || "",
    owner: localStorage.getItem("gh_owner") || "EricHOfla",
    repo: localStorage.getItem("gh_repo") || "Personal-Web",
    path: localStorage.getItem("gh_path") || "frontend/src/data/index.js",
    branch: localStorage.getItem("gh_branch") || "main",
  });

  // ================= Password & Token Handlers =================
  const handleLogin = async (e) => {
    e.preventDefault();
    const storedHash = localStorage.getItem("admin_pass_hash");
    const inputHash = await hashPassword(passwordInput);

    if (storedHash && inputHash === storedHash) {
      sessionStorage.setItem("admin_authenticated", "true");
      setIsAuthenticated(true);
      setPasswordInput("");
      setAuthError("");
    } else if (!storedHash) {
      localStorage.setItem("admin_pass_hash", inputHash);
      sessionStorage.setItem("admin_authenticated", "true");
      setIsAuthenticated(true);
      setPasswordInput("");
      setAuthError("");
    } else {
      setAuthError("Incorrect password. Access denied.");
    }
  };

  const handleResetWithToken = async (e) => {
    e.preventDefault();
    const trimmed = tokenResetInput.trim();
    if (!trimmed) {
      setAuthError("Please enter your GitHub Personal Access Token.");
      return;
    }

    setIsVerifyingToken(true);
    setAuthError("");

    try {
      const res = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `token ${trimmed}`,
          Accept: "application/vnd.github.v3+json",
        },
      });

      if (!res.ok) {
        throw new Error("Invalid GitHub Token or token expired. Please check your token.");
      }

      const user = await res.json();
      const expectedOwner = (githubSettings.owner || "EricHOfla").toLowerCase();

      if (user.login?.toLowerCase() !== expectedOwner) {
        throw new Error(`Unauthorized GitHub user (@${user.login}). Only the owner (@${githubSettings.owner}) can unlock this portfolio.`);
      }

      localStorage.setItem("gh_token", trimmed);
      setGithubSettings((prev) => ({ ...prev, token: trimmed }));
      sessionStorage.setItem("admin_authenticated", "true");
      setIsAuthenticated(true);
      setIsVerifyingToken(false);
      setTokenResetInput("");
      setShowTokenReset(false);
      setStatusMsg({
        type: "success",
        text: `🎉 Verified as @${user.login}! You have full admin access. You can now set or update your Master Password in Settings.`,
      });
    } catch (err) {
      setIsVerifyingToken(false);
      setAuthError(err.message || "Failed to verify GitHub token.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_authenticated");
    setIsAuthenticated(false);
    setPasswordInput("");
    setStatusMsg({ type: "", text: "" });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!passwordInput || passwordInput.length < 4) {
      setStatusMsg({ type: "error", text: "New password must be at least 4 characters long." });
      return;
    }
    if (passwordInput !== confirmPasswordInput) {
      setStatusMsg({ type: "error", text: "Passwords do not match." });
      return;
    }

    const hash = await hashPassword(passwordInput);
    localStorage.setItem("admin_pass_hash", hash);
    setPasswordInput("");
    setConfirmPasswordInput("");
    setShowChangePassword(false);
    setStatusMsg({ type: "success", text: "Admin password changed successfully!" });
  };

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
  const [newProject, setNewProject] = useState({
    title: "",
    category: "Web",
    description: "",
    imageUrl: "",
    liveUrl: "",
    githubUrl: "",
    technologies: "",
  });

  const [newBlog, setNewBlog] = useState({
    title: "",
    slug: "",
    category: "Development",
    excerpt: "",
    content: "",
    reading_time: 4,
    published_date: new Date().toISOString().split("T")[0],
  });

  const [newSkill, setNewSkill] = useState({
    name: "",
    category: "Coding",
    level: 90,
  });

  const [newExp, setNewExp] = useState({
    title: "",
    company: "",
    location: "Kigali, Rwanda",
    duration: "2024 - Present",
    description: "",
  });

  const [newEdu, setNewEdu] = useState({
    degree: "",
    institution: "",
    location: "Rwanda",
    duration: "2023 - Present",
    description: "",
  });

  const [newCert, setNewCert] = useState({
    name: "",
    issuer: "",
    year: "2025",
  });

  const [newSocial, setNewSocial] = useState({
    platform: "LinkedIn",
    name: "LinkedIn",
    url: "",
  });

  const [newService, setNewService] = useState({
    title: "",
    description: "",
    icon: "web",
  });

  const [newFunFact, setNewFunFact] = useState({
    description: "",
    value: 0,
    icon: "trophy",
  });

  const [newTestimonial, setNewTestimonial] = useState({
    name: "",
    role: "",
    company: "",
    message: "",
  });

  const [newLanguage, setNewLanguage] = useState({
    name: "",
    level: "Professional",
  });

  const [profileForm, setProfileForm] = useState(data.profile || {});

  // ================= Edit Modal State =================
  const [editItem, setEditItem] = useState(null);   // the item being edited (copy)
  const [editType, setEditType] = useState(null);   // "project" | "blog" | "skill" | "experience" | "education" | "certification"

  const openEdit = (type, item) => {
    setEditType(type);
    // For projects, flatten technologies array to comma string for editing
    if (type === "project") {
      setEditItem({
        ...item,
        technologies: Array.isArray(item.technologies) ? item.technologies.join(", ") : (item.technologies || ""),
      });
    } else {
      setEditItem({ ...item });
    }
  };

  const closeEdit = () => {
    setEditItem(null);
    setEditType(null);
  };

  const handleSaveEdit = () => {
    if (!editItem || !editType) return;

    if (editType === "project") {
      const techArray = editItem.technologies
        ? (Array.isArray(editItem.technologies) ? editItem.technologies : editItem.technologies.split(",").map((t) => t.trim()).filter(Boolean))
        : [];
      const updated = {
        ...editItem,
        technologies: techArray,
        image: editItem.imageUrl || editItem.image_url || editItem.image || "",
        image_url: editItem.imageUrl || editItem.image_url || editItem.image || "",
        project_url: editItem.liveUrl,
        github_url: editItem.githubUrl,
      };
      updateData({ ...data, projects: data.projects.map((p) => (p.id === updated.id ? updated : p)) });
    } else if (editType === "blog") {
      const updated = { ...editItem };
      updateData({ ...data, blogPosts: data.blogPosts.map((b) => (b.id === updated.id ? updated : b)) });
    } else if (editType === "skill") {
      const updated = {
        ...editItem,
        skill_name: editItem.name || editItem.skill_name,
        proficiency_level: Number(editItem.level || editItem.proficiency_level) || 85,
        level: Number(editItem.level || editItem.proficiency_level) || 85,
      };
      updateData({ ...data, skills: data.skills.map((s) => (s.id === updated.id ? updated : s)) });
    } else if (editType === "experience") {
      const updated = {
        ...editItem,
        job_title: editItem.title || editItem.job_title,
        time_period: editItem.duration || editItem.time_period,
      };
      updateData({ ...data, experiences: data.experiences.map((e) => (e.id === updated.id ? updated : e)) });
    } else if (editType === "education") {
      const updated = {
        ...editItem,
        time_period: editItem.duration || editItem.time_period,
      };
      updateData({ ...data, education: data.education.map((e) => (e.id === updated.id ? updated : e)) });
    } else if (editType === "certification") {
      updateData({ ...data, certifications: data.certifications.map((c) => (c.id === editItem.id ? { ...editItem } : c)) });
    } else if (editType === "social") {
      const updated = {
        ...editItem,
        name: editItem.name || editItem.platform,
        icon: (editItem.platform || "globe").toLowerCase(),
      };
      updateData({ ...data, socialLinks: (data.socialLinks || []).map((s) => (s.id === editItem.id ? updated : s)) });
    } else if (editType === "service") {
      updateData({ ...data, services: (data.services || []).map((s) => (s.id === editItem.id ? { ...editItem } : s)) });
    } else if (editType === "funfact") {
      const updated = { ...editItem, value: Number(editItem.value) || 0 };
      updateData({ ...data, funFacts: (data.funFacts || []).map((f) => (f.id === editItem.id ? updated : f)) });
    } else if (editType === "testimonial") {
      updateData({ ...data, testimonials: (data.testimonials || []).map((t) => (t.id === editItem.id ? { ...editItem } : t)) });
    } else if (editType === "language") {
      updateData({ ...data, languages: (data.languages || []).map((l) => (l.id === editItem.id ? { ...editItem } : l)) });
    }

    setStatusMsg({ type: "success", text: `Updated successfully!` });
    closeEdit();
  };

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
      image: newProject.imageUrl || "",
      image_url: newProject.imageUrl || "",
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
      imageUrl: "",
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

  // Social Links
  const handleAddSocial = (e) => {
    e.preventDefault();
    if (!newSocial.platform || !newSocial.url) return;
    const item = {
      id: Date.now(),
      platform: newSocial.platform,
      name: newSocial.name || newSocial.platform,
      url: newSocial.url,
      icon: (newSocial.platform || "globe").toLowerCase(),
    };
    updateData({ ...data, socialLinks: [...(data.socialLinks || []), item] });
    setNewSocial({ platform: "LinkedIn", name: "LinkedIn", url: "" });
    setStatusMsg({ type: "success", text: `Added social link for "${item.platform}"!` });
  };

  const handleDeleteSocial = (id) => {
    if (!window.confirm("Delete this social link?")) return;
    updateData({ ...data, socialLinks: (data.socialLinks || []).filter((s) => s.id !== id) });
  };

  // Services
  const handleAddService = (e) => {
    e.preventDefault();
    if (!newService.title) return;
    const item = {
      id: Date.now(),
      title: newService.title,
      description: newService.description,
      icon: newService.icon || "web",
    };
    updateData({ ...data, services: [...(data.services || []), item] });
    setNewService({ title: "", description: "", icon: "web" });
    setStatusMsg({ type: "success", text: `Added service "${item.title}"!` });
  };

  const handleDeleteService = (id) => {
    if (!window.confirm("Delete this service?")) return;
    updateData({ ...data, services: (data.services || []).filter((s) => s.id !== id) });
  };

  // Fun Facts
  const handleAddFunFact = (e) => {
    e.preventDefault();
    if (!newFunFact.description) return;
    const item = {
      id: Date.now(),
      description: newFunFact.description,
      value: Number(newFunFact.value) || 0,
      icon: newFunFact.icon || "trophy",
    };
    updateData({ ...data, funFacts: [...(data.funFacts || []), item] });
    setNewFunFact({ description: "", value: 0, icon: "trophy" });
    setStatusMsg({ type: "success", text: `Added fun fact "${item.description}"!` });
  };

  const handleDeleteFunFact = (id) => {
    updateData({ ...data, funFacts: (data.funFacts || []).filter((f) => f.id !== id) });
  };

  // Testimonials
  const handleAddTestimonial = (e) => {
    e.preventDefault();
    if (!newTestimonial.name || !newTestimonial.message) return;
    const item = {
      id: Date.now(),
      name: newTestimonial.name,
      role: newTestimonial.role,
      company: newTestimonial.company,
      message: newTestimonial.message,
      image: "",
    };
    updateData({ ...data, testimonials: [...(data.testimonials || []), item] });
    setNewTestimonial({ name: "", role: "", company: "", message: "" });
    setStatusMsg({ type: "success", text: `Added testimonial from "${item.name}"!` });
  };

  const handleDeleteTestimonial = (id) => {
    if (!window.confirm("Delete this testimonial?")) return;
    updateData({ ...data, testimonials: (data.testimonials || []).filter((t) => t.id !== id) });
  };

  // Languages
  const handleAddLanguage = (e) => {
    e.preventDefault();
    if (!newLanguage.name) return;
    const item = {
      id: Date.now(),
      name: newLanguage.name,
      level: newLanguage.level || "Professional",
    };
    updateData({ ...data, languages: [...(data.languages || []), item] });
    setNewLanguage({ name: "", level: "Professional" });
    setStatusMsg({ type: "success", text: `Added language "${item.name}"!` });
  };

  const handleDeleteLanguage = (id) => {
    updateData({ ...data, languages: (data.languages || []).filter((l) => l.id !== id) });
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

  // =========================================================
  // RENDER LOCK SCREEN IF NOT AUTHENTICATED
  // =========================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0c10] text-gray-100 flex items-center justify-center p-3 xs:p-4 sm:p-6 font-sans relative overflow-hidden">
        {/* Glow background effects */}
        <div className="absolute top-1/4 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-gray-900/95 border border-purple-900/50 p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl backdrop-blur-xl relative z-10">
          <div className="flex flex-col items-center text-center mb-5 sm:mb-6">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white text-xl sm:text-2xl shadow-lg shadow-purple-900/40 mb-3 sm:mb-4">
              {showTokenReset ? <FaGithub /> : <FaLock />}
            </div>
            <h1 className="text-lg sm:text-2xl font-bold text-white">
              {showTokenReset ? "Verify GitHub Ownership" : "Admin Portal Access"}
            </h1>
            <p className="text-xs text-gray-400 mt-1 max-w-xs">
              {showTokenReset
                ? "Enter your GitHub Personal Access Token to verify ownership and unlock."
                : "Enter your secret Admin Password to manage your portfolio."}
            </p>
          </div>

          {authError && (
            <div className="mb-4 p-3 bg-red-950/60 border border-red-800 text-red-300 text-xs rounded-xl text-center">
              {authError}
            </div>
          )}

          {!showTokenReset ? (
            <div>
              {/* 1-Click Sign in with GitHub */}
              <button
                type="button"
                onClick={handleGitHubOAuthLogin}
                className="w-full py-3 sm:py-3.5 bg-[#24292e] hover:bg-[#2f363d] text-white border border-gray-700/80 font-medium rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2.5 shadow-lg mb-4 hover:border-purple-500/50"
              >
                <FaGithub className="text-base sm:text-lg" /> Sign in with GitHub
              </button>

              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-[1px] bg-gray-800" />
                <span className="text-[11px] text-gray-500 uppercase tracking-wider">or with password</span>
                <div className="flex-1 h-[1px] bg-gray-800" />
              </div>

              <form onSubmit={handleLogin} className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Admin Password</label>
                  <input
                    type="password"
                    required
                    autoFocus
                    placeholder="••••••••••••"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 sm:py-3 bg-gray-800/80 border border-gray-700 rounded-xl text-white text-sm outline-none focus:border-purple-500 transition"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium rounded-xl text-xs sm:text-sm transition-all shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2"
                >
                  <FaKey /> Unlock with Password
                </button>
              </form>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setShowTokenReset(true);
                    setAuthError("");
                  }}
                  className="text-xs text-purple-400 hover:text-purple-300 transition flex items-center justify-center gap-1.5 mx-auto"
                >
                  <FaKey /> Enter GitHub Token Manually
                </button>
              </div>
            </div>
          ) : (
            <div>
              <form onSubmit={handleResetWithToken} className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">GitHub Personal Access Token</label>
                  <input
                    type="password"
                    required
                    autoFocus
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                    value={tokenResetInput}
                    onChange={(e) => setTokenResetInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 sm:py-3 bg-gray-800/80 border border-gray-700 rounded-xl text-white text-xs sm:text-sm outline-none focus:border-purple-500 transition font-mono"
                  />
                  <span className="text-[11px] text-gray-500 mt-1 block">
                    Must belong to owner account: <strong>@EricHOfla</strong>
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isVerifyingToken}
                  className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium rounded-xl text-xs sm:text-sm transition-all shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isVerifyingToken ? <FaSpinner className="animate-spin" /> : <FaShieldAlt />}
                  {isVerifyingToken ? "Verifying with GitHub..." : "Verify & Unlock"}
                </button>
              </form>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setShowTokenReset(false);
                    setAuthError("");
                  }}
                  className="text-xs text-gray-400 hover:text-white transition"
                >
                  ← Back to Password Login
                </button>
              </div>
            </div>
          )}

          <div className="mt-5 pt-4 border-t border-gray-800/80 text-center">
            <a
              href="/"
              className="text-xs text-gray-500 hover:text-purple-400 transition flex items-center justify-center gap-1.5"
            >
              <FaArrowLeft className="text-[10px]" /> Back to Public Website
            </a>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // RENDER UNLOCKED ADMIN PANEL
  // =========================================================
  return (
    <div className="min-h-screen bg-[#0f1117] text-gray-100 font-sans p-3 xs:p-4 sm:p-6 md:p-8 pb-20 sm:pb-8">
      {/* Top Header */}
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 sm:pb-6 border-b border-gray-800">
        <div className="w-full sm:w-auto">
          <div className="flex flex-wrap items-center justify-between sm:justify-start gap-2 sm:gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <a
                href="/"
                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-gray-800/80 hover:bg-gray-700 text-purple-400 hover:text-purple-300 transition-all flex items-center gap-1.5 text-xs sm:text-sm"
                title="Return to Portfolio"
              >
                <FaArrowLeft /> <span className="hidden xs:inline">Website</span>
              </a>
              <h1 className="text-lg xs:text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Admin Panel
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-950 border border-green-700/60 text-green-300 flex items-center gap-1">
                <FaShieldAlt /> <span className="hidden xs:inline">Authenticated</span>
              </span>
              <button
                onClick={handleLogout}
                className="sm:hidden p-2 text-xs bg-gray-800 hover:bg-red-950/60 hover:text-red-300 rounded-xl border border-gray-700 hover:border-red-800 text-gray-400 transition"
                title="Lock / Log Out"
              >
                <FaSignOutAlt />
              </button>
            </div>
          </div>
          <p className="text-[11px] sm:text-xs text-gray-400 mt-1">
            Flat-File data management for <code className="text-purple-300 break-all">frontend/src/data/index.js</code>.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="grid grid-cols-2 xs:flex xs:flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="px-3 py-2 text-xs sm:text-sm bg-gray-800/90 hover:bg-gray-700 rounded-xl border border-gray-700 flex items-center justify-center gap-1.5 transition"
          >
            <FaKey className="text-yellow-400 text-xs" />
            <span>Settings</span>
          </button>

          <button
            onClick={handleDownloadFile}
            className="px-3 py-2 text-xs sm:text-sm bg-gray-800/90 hover:bg-gray-700 rounded-xl border border-gray-700 flex items-center justify-center gap-1.5 transition"
            title="Download index.js file"
          >
            <FaDownload className="text-xs" />
            <span>Export JS</span>
          </button>

          <button
            onClick={handleSaveToGitHub}
            disabled={isSaving}
            className={`col-span-2 xs:col-auto px-4 py-2 sm:py-2.5 text-xs sm:text-sm rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg transition-all ${
              hasUnsavedChanges
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-900/40 animate-pulse"
                : "bg-purple-700 hover:bg-purple-600 text-white"
            } disabled:opacity-50`}
          >
            {isSaving ? <FaSpinner className="animate-spin" /> : <FaSave />}
            <span>{isSaving ? "Publishing..." : hasUnsavedChanges ? "Save & Deploy *" : "Save & Deploy"}</span>
          </button>

          <button
            onClick={handleLogout}
            className="hidden sm:flex p-2.5 text-xs sm:text-sm bg-gray-800 hover:bg-red-950/60 hover:text-red-300 rounded-xl border border-gray-700 hover:border-red-800 text-gray-400 transition items-center justify-center"
            title="Lock / Log Out"
          >
            <FaSignOutAlt />
          </button>
        </div>
      </div>

      {/* Status Notifications */}
      {statusMsg.text && (
        <div className="max-w-6xl mx-auto mt-3 sm:mt-4">
          <div
            className={`p-3 sm:p-4 rounded-xl text-xs sm:text-sm flex items-start sm:items-center justify-between gap-2 border ${
              statusMsg.type === "success"
                ? "bg-green-950/50 border-green-700/60 text-green-200"
                : statusMsg.type === "error"
                ? "bg-red-950/50 border-red-700/60 text-red-200"
                : "bg-blue-950/50 border-blue-700/60 text-blue-200"
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              {statusMsg.type === "success" && <FaCheck className="text-green-400 flex-shrink-0" />}
              <span className="break-words">{statusMsg.text}</span>
            </div>
            <button
              onClick={() => setStatusMsg({ type: "", text: "" })}
              className="text-xs underline opacity-70 hover:opacity-100 flex-shrink-0 ml-2"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* GitHub Settings Modal / Dropdown */}
      {showConfig && (
        <div className="max-w-6xl mx-auto mt-3 sm:mt-4 p-4 sm:p-5 bg-gray-900/90 border border-purple-900/50 rounded-2xl shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-gray-800 gap-2">
            <h3 className="text-sm font-semibold flex items-center gap-2 text-purple-300">
              <FaGithub /> GitHub Repository Configuration
            </h3>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowChangePassword(!showChangePassword)}
                className="text-xs text-yellow-400 hover:underline flex items-center gap-1"
              >
                <FaLock /> Change Admin Password
              </button>
              <span className="text-[11px] text-gray-400">Stored safely in browser</span>
            </div>
          </div>

          {showChangePassword && (
            <form onSubmit={handleChangePassword} className="p-3 sm:p-4 bg-gray-950/80 border border-gray-800 rounded-xl mb-4 space-y-3">
              <h4 className="text-xs font-semibold text-gray-200">Change Master Password</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <input
                  type="password"
                  required
                  placeholder="New Password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500"
                />
                <input
                  type="password"
                  required
                  placeholder="Confirm New Password"
                  value={confirmPasswordInput}
                  onChange={(e) => setConfirmPasswordInput(e.target.value)}
                  className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-medium"
                >
                  Update Password
                </button>
                <button
                  type="button"
                  onClick={() => setShowChangePassword(false)}
                  className="px-3 py-1.5 bg-gray-800 text-gray-400 hover:text-white rounded-lg text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-gray-400 mb-1">GitHub Personal Access Token</label>
              <div className="relative flex items-center">
                <input
                  type={showTokenText ? "text" : "password"}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                  value={githubSettings.token}
                  onChange={(e) => handleSettingsChange("token", e.target.value)}
                  className="w-full pr-9 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 outline-none font-mono text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowTokenText(!showTokenText)}
                  className="absolute right-2.5 p-1 text-gray-400 hover:text-purple-300 transition"
                  title={showTokenText ? "Hide token" : "Show token"}
                >
                  {showTokenText ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                </button>
              </div>
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
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 outline-none font-mono text-[11px]"
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
      <div className="max-w-6xl mx-auto mt-6 border-b border-gray-800">
        <nav className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2">
          {[
            { id: "projects", label: "Projects", count: data.projects?.length || 0, icon: FaCode },
            { id: "blog", label: "Blog", count: data.blogPosts?.length || 0, icon: FaNewspaper },
            { id: "skills", label: "Skills", count: data.skills?.length || 0, icon: FaCode },
            { id: "experience", label: "Experience", count: data.experiences?.length || 0, icon: FaBriefcase },
            { id: "education", label: "Education", count: data.education?.length || 0, icon: FaGraduationCap },
            { id: "certifications", label: "Certificates", count: data.certifications?.length || 0, icon: FaCertificate },
            { id: "social", label: "Social", count: data.socialLinks?.length || 0, icon: FaShareAlt },
            { id: "services", label: "Services", count: data.services?.length || 0, icon: FaToolbox },
            { id: "funfacts", label: "Fun Facts", count: data.funFacts?.length || 0, icon: FaTrophy },
            { id: "testimonials", label: "Testimonials", count: data.testimonials?.length || 0, icon: FaQuoteLeft },
            { id: "languages", label: "Languages", count: data.languages?.length || 0, icon: FaGlobe },
            { id: "profile", label: "Profile", icon: FaUser },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2 transition-all flex-shrink-0 whitespace-nowrap ${
                  isActive
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-900/40"
                    : "bg-gray-900/90 text-gray-400 hover:text-gray-200 hover:bg-gray-800 border border-gray-800/80"
                }`}
              >
                <Icon className="text-xs sm:text-sm" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      isActive
                        ? "bg-black/30 text-purple-100"
                        : "bg-gray-800 text-gray-300 border border-gray-700/60"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Contents */}
      <div className="max-w-6xl mx-auto mt-4 sm:mt-6">
        {/* ======================= TAB 1: PROJECTS ======================= */}
        {activeTab === "projects" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Add Project Form */}
            <div className="lg:col-span-1 bg-gray-900/90 border border-gray-800 p-4 sm:p-5 rounded-2xl shadow-xl">
              <h2 className="text-sm sm:text-base font-semibold flex items-center gap-2 mb-3 sm:mb-4 text-purple-300">
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
                    className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">Category</label>
                  <select
                    value={newProject.category}
                    onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs sm:text-sm"
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
                    placeholder="Brief summary of the project features..."
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">Live Demo URL</label>
                  <input
                    type="url"
                    placeholder="https://my-app.vercel.app"
                    value={newProject.liveUrl}
                    onChange={(e) => setNewProject({ ...newProject, liveUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">GitHub Repo URL</label>
                  <input
                    type="url"
                    placeholder="https://github.com/EricHOfla/my-app"
                    value={newProject.githubUrl}
                    onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">Image URL (optional)</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/... or /project-thumb.png"
                    value={newProject.imageUrl}
                    onChange={(e) => setNewProject({ ...newProject, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">Technologies (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="React, Node.js, Tailwind CSS"
                    value={newProject.technologies}
                    onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 sm:py-3 mt-2 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-xl transition flex items-center justify-center gap-2 text-xs sm:text-sm"
                >
                  <FaPlus /> Add to Projects
                </button>
              </form>
            </div>

            {/* Existing Projects List */}
            <div className="lg:col-span-2 space-y-2.5 sm:space-y-3">
              <h2 className="text-sm sm:text-base font-semibold text-gray-300">
                Current Projects ({data.projects?.length || 0})
              </h2>
              {data.projects?.map((proj) => (
                <div
                  key={proj.id}
                  className="p-3.5 sm:p-4 bg-gray-900/70 border border-gray-800 rounded-2xl flex items-start justify-between gap-3 hover:border-gray-700 transition"
                >
                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-purple-900/50 text-purple-300 border border-purple-800/50">
                        {proj.category}
                      </span>
                      <h3 className="font-semibold text-xs sm:text-sm text-white truncate">{proj.title}</h3>
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-2">{proj.description}</p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {proj.technologies?.map((tech, idx) => (
                        <span key={idx} className="text-[10px] px-1.5 py-0.5 bg-gray-800 rounded text-gray-300">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs pt-1 text-purple-400">
                      {proj.liveUrl && (
                        <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">
                          Live Demo ↗
                        </a>
                      )}
                      {proj.githubUrl && (
                        <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">
                          GitHub ↗
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => openEdit("project", proj)}
                      className="p-2.5 text-gray-500 hover:text-purple-400 hover:bg-purple-950/40 rounded-xl transition"
                      title="Edit project"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteProject(proj.id)}
                      className="p-2.5 text-gray-500 hover:text-red-400 hover:bg-red-950/40 rounded-xl transition"
                      title="Delete project"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================= TAB 2: BLOG ======================= */}
        {activeTab === "blog" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="lg:col-span-1 bg-gray-900/90 border border-gray-800 p-4 sm:p-5 rounded-2xl shadow-xl">
              <h2 className="text-sm sm:text-base font-semibold flex items-center gap-2 mb-3 sm:mb-4 text-purple-300">
                <FaPlus /> Write Blog Post
              </h2>
              <form onSubmit={handleAddBlog} className="space-y-3 text-xs">
                <div>
                  <label className="block text-gray-400 mb-1">Article Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Modern Web Architecture"
                    value={newBlog.title}
                    onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">Category</label>
                  <input
                    type="text"
                    placeholder="Development, AI, Tutorial"
                    value={newBlog.category}
                    onChange={(e) => setNewBlog({ ...newBlog, category: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">Short Excerpt *</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Brief overview..."
                    value={newBlog.excerpt}
                    onChange={(e) => setNewBlog({ ...newBlog, excerpt: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">Article Content *</label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Full article text..."
                    value={newBlog.content}
                    onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 font-mono text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-gray-400 mb-1">Read (min)</label>
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
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 sm:py-3 mt-2 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-xl transition flex items-center justify-center gap-2 text-xs sm:text-sm"
                >
                  <FaPlus /> Add Blog Post
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 space-y-2.5 sm:space-y-3">
              <h2 className="text-sm sm:text-base font-semibold text-gray-300">
                Published Articles ({data.blogPosts?.length || 0})
              </h2>
              {data.blogPosts?.map((post) => (
                <div
                  key={post.id}
                  className="p-3.5 sm:p-4 bg-gray-900/70 border border-gray-800 rounded-2xl flex items-start justify-between gap-3"
                >
                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="px-2 py-0.5 rounded bg-indigo-900/50 text-indigo-300 border border-indigo-800/50 text-[10px]">
                        {post.category}
                      </span>
                      <span className="text-gray-400 text-[11px]">{post.published_date}</span>
                      <span className="text-gray-500 text-[11px]">• {post.reading_time} min</span>
                    </div>
                    <h3 className="font-semibold text-xs sm:text-sm text-white truncate">{post.title}</h3>
                    <p className="text-xs text-gray-400 line-clamp-2">{post.excerpt}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => openEdit("blog", post)}
                      className="p-2.5 text-gray-500 hover:text-purple-400 hover:bg-purple-950/40 rounded-xl transition"
                      title="Edit post"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteBlog(post.id)}
                      className="p-2.5 text-gray-500 hover:text-red-400 hover:bg-red-950/40 rounded-xl transition"
                      title="Delete post"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================= TAB 3: SKILLS ======================= */}
        {activeTab === "skills" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="lg:col-span-1 bg-gray-900/90 border border-gray-800 p-4 sm:p-5 rounded-2xl shadow-xl">
              <h2 className="text-sm sm:text-base font-semibold flex items-center gap-2 mb-3 sm:mb-4 text-purple-300">
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
                    className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">Category</label>
                  <select
                    value={newSkill.category}
                    onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs sm:text-sm"
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
                    className="w-full accent-purple-500 cursor-pointer h-2 bg-gray-700 rounded-lg"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 sm:py-3 mt-2 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-xl transition flex items-center justify-center gap-2 text-xs sm:text-sm"
                >
                  <FaPlus /> Add Skill
                </button>
              </form>
            </div>

            <div className="lg:col-span-2">
              <h2 className="text-sm sm:text-base font-semibold text-gray-300 mb-3">
                Skills List ({data.skills?.length || 0})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                {data.skills?.map((skill) => (
                  <div
                    key={skill.id}
                    className="p-3 bg-gray-900/70 border border-gray-800 rounded-xl flex items-center justify-between"
                  >
                    <div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-gray-800 text-purple-300">
                        {skill.category}
                      </span>
                      <h4 className="font-semibold text-xs sm:text-sm text-white mt-1">{skill.name || skill.skill_name}</h4>
                      <p className="text-[11px] text-gray-400">{skill.proficiency_level || skill.level}% proficiency</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEdit("skill", skill)}
                        className="p-2 text-gray-500 hover:text-purple-400 hover:bg-purple-950/40 rounded-lg transition"
                        title="Edit skill"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteSkill(skill.id)}
                        className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition"
                        title="Delete skill"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB 4: EXPERIENCE ======================= */}
        {activeTab === "experience" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="lg:col-span-1 bg-gray-900/90 border border-gray-800 p-4 sm:p-5 rounded-2xl shadow-xl">
              <h2 className="text-sm sm:text-base font-semibold flex items-center gap-2 mb-3 sm:mb-4 text-purple-300">
                <FaPlus /> Add Experience
              </h2>
              <form onSubmit={handleAddExperience} className="space-y-3 text-xs">
                <div>
                  <label className="block text-gray-400 mb-1">Job Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Software Engineer"
                    value={newExp.title}
                    onChange={(e) => setNewExp({ ...newExp, title: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">Company *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. TechCorp"
                    value={newExp.company}
                    onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">Time Period *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2024 - Present"
                    value={newExp.duration}
                    onChange={(e) => setNewExp({ ...newExp, duration: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="Kigali, Rwanda"
                    value={newExp.location}
                    onChange={(e) => setNewExp({ ...newExp, location: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">Description *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Accomplishments and responsibilities..."
                    value={newExp.description}
                    onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 sm:py-3 mt-2 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-xl transition flex items-center justify-center gap-2 text-xs sm:text-sm"
                >
                  <FaPlus /> Add Experience
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 space-y-2.5 sm:space-y-3">
              <h2 className="text-sm sm:text-base font-semibold text-gray-300">
                Work History ({data.experiences?.length || 0})
              </h2>
              {data.experiences?.map((exp) => (
                <div
                  key={exp.id}
                  className="p-3.5 sm:p-4 bg-gray-900/70 border border-gray-800 rounded-2xl flex items-start justify-between gap-3"
                >
                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <h3 className="font-semibold text-xs sm:text-sm text-white">{exp.job_title || exp.title}</h3>
                      <span className="text-[11px] text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-900/50">
                        {exp.time_period || exp.duration}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 font-medium">{exp.company} — {exp.location}</p>
                    <p className="text-xs text-gray-400 pt-1">{exp.description}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => openEdit("experience", exp)}
                      className="p-2 text-gray-500 hover:text-purple-400 hover:bg-purple-950/40 rounded-lg transition"
                      title="Edit experience"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteExperience(exp.id)}
                      className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition"
                      title="Delete experience"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================= TAB 5: EDUCATION ======================= */}
        {activeTab === "education" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="lg:col-span-1 bg-gray-900/90 border border-gray-800 p-4 sm:p-5 rounded-2xl shadow-xl">
              <h2 className="text-sm sm:text-base font-semibold flex items-center gap-2 mb-3 sm:mb-4 text-purple-300">
                <FaPlus /> Add Education
              </h2>
              <form onSubmit={handleAddEducation} className="space-y-3 text-xs">
                <div>
                  <label className="block text-gray-400 mb-1">Degree *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. A0 in Software Engineering"
                    value={newEdu.degree}
                    onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">Institution *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. UNILAK"
                    value={newEdu.institution}
                    onChange={(e) => setNewEdu({ ...newEdu, institution: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">Time Period</label>
                  <input
                    type="text"
                    placeholder="e.g. 2023 - Present"
                    value={newEdu.duration}
                    onChange={(e) => setNewEdu({ ...newEdu, duration: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Coursework, honors..."
                    value={newEdu.description}
                    onChange={(e) => setNewEdu({ ...newEdu, description: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 sm:py-3 mt-2 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-xl transition flex items-center justify-center gap-2 text-xs sm:text-sm"
                >
                  <FaPlus /> Add Education
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 space-y-2.5 sm:space-y-3">
              <h2 className="text-sm sm:text-base font-semibold text-gray-300">
                Education Records ({data.education?.length || 0})
              </h2>
              {data.education?.map((edu) => (
                <div
                  key={edu.id}
                  className="p-3.5 sm:p-4 bg-gray-900/70 border border-gray-800 rounded-2xl flex items-start justify-between gap-3"
                >
                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <h3 className="font-semibold text-xs sm:text-sm text-white">{edu.degree}</h3>
                      <span className="text-[11px] text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-900/50">
                        {edu.time_period || edu.duration}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 font-medium">{edu.institution} — {edu.location}</p>
                    <p className="text-xs text-gray-400 pt-1">{edu.description}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => openEdit("education", edu)}
                      className="p-2 text-gray-500 hover:text-purple-400 hover:bg-purple-950/40 rounded-lg transition"
                      title="Edit education"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteEducation(edu.id)}
                      className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition"
                      title="Delete education"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================= TAB 6: CERTIFICATES ======================= */}
        {activeTab === "certifications" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="lg:col-span-1 bg-gray-900/90 border border-gray-800 p-4 sm:p-5 rounded-2xl shadow-xl">
              <h2 className="text-sm sm:text-base font-semibold flex items-center gap-2 mb-3 sm:mb-4 text-purple-300">
                <FaPlus /> Add Certificate
              </h2>
              <form onSubmit={handleAddCertification} className="space-y-3 text-xs">
                <div>
                  <label className="block text-gray-400 mb-1">Certificate Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AWS Certified Developer"
                    value={newCert.name}
                    onChange={(e) => setNewCert({ ...newCert, name: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">Issuer Organization *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Meta, AWS, Coursera"
                    value={newCert.issuer}
                    onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">Year</label>
                  <input
                    type="text"
                    placeholder="2025"
                    value={newCert.year}
                    onChange={(e) => setNewCert({ ...newCert, year: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 sm:py-3 mt-2 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-xl transition flex items-center justify-center gap-2 text-xs sm:text-sm"
                >
                  <FaPlus /> Add Certificate
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 space-y-2.5 sm:space-y-3">
              <h2 className="text-sm sm:text-base font-semibold text-gray-300">
                Certifications ({data.certifications?.length || 0})
              </h2>
              {data.certifications?.map((cert) => (
                <div
                  key={cert.id}
                  className="p-3.5 sm:p-4 bg-gray-900/70 border border-gray-800 rounded-2xl flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <h3 className="font-semibold text-xs sm:text-sm text-white truncate">{cert.name}</h3>
                    <p className="text-xs text-gray-400">{cert.issuer} • {cert.year}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => openEdit("certification", cert)}
                      className="p-2 text-gray-500 hover:text-purple-400 hover:bg-purple-950/40 rounded-lg transition"
                      title="Edit certificate"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteCertification(cert.id)}
                      className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition"
                      title="Delete certificate"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================= TAB 7: SOCIAL LINKS ======================= */}
        {activeTab === "social" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="lg:col-span-1 bg-gray-900/90 border border-gray-800 p-4 sm:p-5 rounded-2xl shadow-xl">
              <h2 className="text-sm sm:text-base font-semibold flex items-center gap-2 mb-3 sm:mb-4 text-purple-300">
                <FaPlus /> Add Social Link
              </h2>
              <form onSubmit={handleAddSocial} className="space-y-3 text-xs">
                <div>
                  <label className="block text-gray-400 mb-1">Platform *</label>
                  <select
                    value={newSocial.platform}
                    onChange={(e) => setNewSocial({ ...newSocial, platform: e.target.value, name: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs sm:text-sm"
                  >
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Github">GitHub</option>
                    <option value="Twitter">Twitter / X</option>
                    <option value="Instagram">Instagram</option>
                    <option value="YouTube">YouTube</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Website">Personal Website</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Display Label</label>
                  <input
                    type="text"
                    placeholder="e.g. LinkedIn"
                    value={newSocial.name}
                    onChange={(e) => setNewSocial({ ...newSocial, name: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">URL *</label>
                  <input
                    type="url"
                    required
                    placeholder="https://..."
                    value={newSocial.url}
                    onChange={(e) => setNewSocial({ ...newSocial, url: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 font-mono text-[11px]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 sm:py-3 mt-2 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-xl transition flex items-center justify-center gap-2 text-xs sm:text-sm"
                >
                  <FaPlus /> Add Social Link
                </button>
              </form>
            </div>
            <div className="lg:col-span-2 space-y-2.5 sm:space-y-3">
              <h2 className="text-sm sm:text-base font-semibold text-gray-300">
                Social Profiles ({data.socialLinks?.length || 0})
              </h2>
              {data.socialLinks?.map((link) => (
                <div
                  key={link.id}
                  className="p-3.5 sm:p-4 bg-gray-900/70 border border-gray-800 rounded-2xl flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <h3 className="font-semibold text-xs sm:text-sm text-white">{link.name || link.platform}</h3>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-purple-400 hover:underline truncate block"
                    >
                      {link.url}
                    </a>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => openEdit("social", link)}
                      className="p-2 text-gray-500 hover:text-purple-400 hover:bg-purple-950/40 rounded-lg transition"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteSocial(link.id)}
                      className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================= TAB 8: SERVICES ======================= */}
        {activeTab === "services" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="lg:col-span-1 bg-gray-900/90 border border-gray-800 p-4 sm:p-5 rounded-2xl shadow-xl">
              <h2 className="text-sm sm:text-base font-semibold flex items-center gap-2 mb-3 sm:mb-4 text-purple-300">
                <FaPlus /> Add Service
              </h2>
              <form onSubmit={handleAddService} className="space-y-3 text-xs">
                <div>
                  <label className="block text-gray-400 mb-1">Service Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mobile Application Development"
                    value={newService.title}
                    onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Description</label>
                  <textarea
                    rows={3}
                    placeholder="What this service involves..."
                    value={newService.description}
                    onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Icon Type</label>
                  <select
                    value={newService.icon}
                    onChange={(e) => setNewService({ ...newService, icon: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs sm:text-sm"
                  >
                    <option value="web">Web Development</option>
                    <option value="mobile">Mobile Application</option>
                    <option value="design">UI/UX Design</option>
                    <option value="cloud">Cloud & DevOps</option>
                    <option value="api">Backend & API</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 sm:py-3 mt-2 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-xl transition flex items-center justify-center gap-2 text-xs sm:text-sm"
                >
                  <FaPlus /> Add Service
                </button>
              </form>
            </div>
            <div className="lg:col-span-2 space-y-2.5 sm:space-y-3">
              <h2 className="text-sm sm:text-base font-semibold text-gray-300">Services ({data.services?.length || 0})</h2>
              {data.services?.map((svc) => (
                <div
                  key={svc.id}
                  className="p-3.5 sm:p-4 bg-gray-900/70 border border-gray-800 rounded-2xl flex items-start justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-xs sm:text-sm text-white">{svc.title}</h3>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{svc.description}</p>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-gray-800 text-purple-300 mt-1 inline-block">
                      {svc.icon}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => openEdit("service", svc)}
                      className="p-2 text-gray-500 hover:text-purple-400 hover:bg-purple-950/40 rounded-lg transition"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteService(svc.id)}
                      className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================= TAB 9: FUN FACTS ======================= */}
        {activeTab === "funfacts" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="lg:col-span-1 bg-gray-900/90 border border-gray-800 p-4 sm:p-5 rounded-2xl shadow-xl">
              <h2 className="text-sm sm:text-base font-semibold flex items-center gap-2 mb-3 sm:mb-4 text-purple-300">
                <FaPlus /> Add Fun Fact
              </h2>
              <form onSubmit={handleAddFunFact} className="space-y-3 text-xs">
                <div>
                  <label className="block text-gray-400 mb-1">Description *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Finished Projects"
                    value={newFunFact.description}
                    onChange={(e) => setNewFunFact({ ...newFunFact, description: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Value (number)</label>
                  <input
                    type="number"
                    min="0"
                    value={newFunFact.value}
                    onChange={(e) => setNewFunFact({ ...newFunFact, value: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 sm:py-3 mt-2 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-xl transition flex items-center justify-center gap-2 text-xs sm:text-sm"
                >
                  <FaPlus /> Add Fun Fact
                </button>
              </form>
            </div>
            <div className="lg:col-span-2">
              <h2 className="text-sm sm:text-base font-semibold text-gray-300 mb-3">
                Fun Facts ({data.funFacts?.length || 0})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.funFacts?.map((fact) => (
                  <div
                    key={fact.id}
                    className="p-3.5 sm:p-4 bg-gray-900/70 border border-gray-800 rounded-2xl flex items-center justify-between gap-3"
                  >
                    <div>
                      <p className="text-xl sm:text-2xl font-bold text-purple-300">
                        {Number(fact.value)?.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-400">{fact.description}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => openEdit("funfact", fact)}
                        className="p-2 text-gray-500 hover:text-purple-400 hover:bg-purple-950/40 rounded-lg transition"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteFunFact(fact.id)}
                        className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB 10: TESTIMONIALS ======================= */}
        {activeTab === "testimonials" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="lg:col-span-1 bg-gray-900/90 border border-gray-800 p-4 sm:p-5 rounded-2xl shadow-xl">
              <h2 className="text-sm sm:text-base font-semibold flex items-center gap-2 mb-3 sm:mb-4 text-purple-300">
                <FaPlus /> Add Testimonial
              </h2>
              <form onSubmit={handleAddTestimonial} className="space-y-3 text-xs">
                <div>
                  <label className="block text-gray-400 mb-1">Client Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={newTestimonial.name}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Role / Job Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Product Manager"
                    value={newTestimonial.role}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, role: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Company</label>
                  <input
                    type="text"
                    placeholder="e.g. TechCorp"
                    value={newTestimonial.company}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, company: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Feedback / Message *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Client's review..."
                    value={newTestimonial.message}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, message: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 sm:py-3 mt-2 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-xl transition flex items-center justify-center gap-2 text-xs sm:text-sm"
                >
                  <FaPlus /> Add Testimonial
                </button>
              </form>
            </div>
            <div className="lg:col-span-2 space-y-2.5 sm:space-y-3">
              <h2 className="text-sm sm:text-base font-semibold text-gray-300">
                Testimonials ({data.testimonials?.length || 0})
              </h2>
              {data.testimonials?.map((t) => (
                <div
                  key={t.id}
                  className="p-3.5 sm:p-4 bg-gray-900/70 border border-gray-800 rounded-2xl flex items-start justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-xs sm:text-sm text-white">{t.name}</h3>
                    <p className="text-[11px] text-purple-300">
                      {t.role}
                      {t.company ? ` @ ${t.company}` : ""}
                    </p>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-3">"{t.message}"</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => openEdit("testimonial", t)}
                      className="p-2 text-gray-500 hover:text-purple-400 hover:bg-purple-950/40 rounded-lg transition"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteTestimonial(t.id)}
                      className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================= TAB 11: LANGUAGES ======================= */}
        {activeTab === "languages" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="lg:col-span-1 bg-gray-900/90 border border-gray-800 p-4 sm:p-5 rounded-2xl shadow-xl">
              <h2 className="text-sm sm:text-base font-semibold flex items-center gap-2 mb-3 sm:mb-4 text-purple-300">
                <FaPlus /> Add Language
              </h2>
              <form onSubmit={handleAddLanguage} className="space-y-3 text-xs">
                <div>
                  <label className="block text-gray-400 mb-1">Language Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. French"
                    value={newLanguage.name}
                    onChange={(e) => setNewLanguage({ ...newLanguage, name: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Proficiency Level</label>
                  <select
                    value={newLanguage.level}
                    onChange={(e) => setNewLanguage({ ...newLanguage, level: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs sm:text-sm"
                  >
                    <option value="Native">Native</option>
                    <option value="Professional">Professional</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Basic">Basic</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 sm:py-3 mt-2 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-xl transition flex items-center justify-center gap-2 text-xs sm:text-sm"
                >
                  <FaPlus /> Add Language
                </button>
              </form>
            </div>
            <div className="lg:col-span-2">
              <h2 className="text-sm sm:text-base font-semibold text-gray-300 mb-3">
                Languages ({data.languages?.length || 0})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.languages?.map((lang) => (
                  <div
                    key={lang.id}
                    className="p-3.5 sm:p-4 bg-gray-900/70 border border-gray-800 rounded-2xl flex items-center justify-between gap-3"
                  >
                    <div>
                      <h3 className="font-semibold text-xs sm:text-sm text-white">{lang.name}</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-900/50 text-purple-300 border border-purple-800/50">
                        {lang.level}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => openEdit("language", lang)}
                        className="p-2 text-gray-500 hover:text-purple-400 hover:bg-purple-950/40 rounded-lg transition"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteLanguage(lang.id)}
                        className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB 12: PROFILE ======================= */}
        {activeTab === "profile" && (
          <div className="max-w-3xl bg-gray-900/90 border border-gray-800 p-4 sm:p-6 rounded-2xl shadow-xl">
            <h2 className="text-sm sm:text-base font-semibold text-purple-300 mb-3 sm:mb-4 flex items-center gap-2">
              <FaUser /> Edit Profile & Bio
            </h2>
            <form onSubmit={handleSaveProfile} className="space-y-3 sm:space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profileForm.fullName || profileForm.full_name || ""}
                    onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value, full_name: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Primary Title</label>
                  <input
                    type="text"
                    value={profileForm.title || ""}
                    onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 mb-1">Subtitle / Tagline</label>
                  <input
                    type="text"
                    placeholder="Full Stack Developer"
                    value={profileForm.subtitle || ""}
                    onChange={(e) => setProfileForm({ ...profileForm, subtitle: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Freelance / Availability Status</label>
                  <select
                    value={profileForm.freelanceStatus || profileForm.freelance_status || "Available"}
                    onChange={(e) => setProfileForm({ ...profileForm, freelanceStatus: e.target.value, freelance_status: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs sm:text-sm"
                  >
                    <option value="Available">Available (Open to Work)</option>
                    <option value="Busy">Busy</option>
                    <option value="Not Available">Not Available</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 mb-1">Email</label>
                  <input
                    type="email"
                    value={profileForm.email || ""}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Phone</label>
                  <input
                    type="text"
                    value={profileForm.phone || ""}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-400 mb-1">Location</label>
                  <input
                    type="text"
                    value={profileForm.location || profileForm.address || ""}
                    onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value, address: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Qualification</label>
                  <input
                    type="text"
                    placeholder="Bachelor Degree"
                    value={profileForm.qualification || ""}
                    onChange={(e) => setProfileForm({ ...profileForm, qualification: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Years of Experience</label>
                  <input
                    type="number"
                    min="0"
                    value={profileForm.yearsOfExperience || 3}
                    onChange={(e) => setProfileForm({ ...profileForm, yearsOfExperience: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 mb-1">Profile Image Path / URL</label>
                  <input
                    type="text"
                    placeholder="/bannerImg.png or https://..."
                    value={profileForm.profileImage || profileForm.profile_image || ""}
                    onChange={(e) => setProfileForm({ ...profileForm, profileImage: e.target.value, profile_image: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">CV / Resume File Path</label>
                  <input
                    type="text"
                    placeholder="/Eric_H_Resume.pdf"
                    value={profileForm.cvUrl || profileForm.cv_file || ""}
                    onChange={(e) => setProfileForm({ ...profileForm, cvUrl: e.target.value, cv_file: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 font-mono text-[11px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Bio / Summary</label>
                <textarea
                  rows={4}
                  value={profileForm.bio || ""}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs sm:text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2.5 sm:py-3 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-xl transition flex items-center justify-center gap-2 text-xs sm:text-sm"
              >
                <FaCheck /> Apply Profile Changes
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="max-w-6xl mx-auto mt-8 sm:mt-12 pt-4 sm:pt-6 border-t border-gray-800/80 text-center text-[11px] sm:text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>Portfolio Admin Panel • Flat-File Architecture</span>
        <button
          onClick={() => setShowJsonPreview(!showJsonPreview)}
          className="text-purple-400 hover:underline flex items-center gap-1"
        >
          <FaEye /> {showJsonPreview ? "Hide Data Code" : "Preview Data Code"}
        </button>
      </div>

      {showJsonPreview && (
        <div className="max-w-6xl mx-auto mt-4 p-3 sm:p-4 bg-gray-950 border border-gray-800 rounded-xl overflow-x-auto text-[10px] sm:text-[11px] font-mono text-gray-300">
          <pre>{serializePortfolioData(data)}</pre>
        </div>
      )}

      {/* Mobile Sticky Bottom Action Bar */}
      {hasUnsavedChanges && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 p-3 bg-gray-950/95 border-t border-purple-800/50 backdrop-blur-lg z-50 flex items-center justify-between gap-2 shadow-2xl">
          <span className="text-xs text-purple-300 font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" /> Unsaved Changes
          </span>
          <button
            onClick={handleSaveToGitHub}
            disabled={isSaving}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-lg shadow-purple-900/40"
          >
            {isSaving ? <FaSpinner className="animate-spin" /> : <FaSave />}
            <span>{isSaving ? "Saving..." : "Save & Deploy"}</span>
          </button>
        </div>
      )}

      {/* ======================= EDIT MODAL ======================= */}
      {editItem && editType && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) closeEdit(); }}
        >
          <div className="w-full max-w-lg bg-gray-900 border border-purple-800/60 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-800">
              <h3 className="text-sm sm:text-base font-semibold text-purple-300 flex items-center gap-2">
                <FaEdit /> Edit {editType.charAt(0).toUpperCase() + editType.slice(1)}
              </h3>
              <button onClick={closeEdit} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition">
                <FaTimes />
              </button>
            </div>

            {/* Modal Body — fields depend on type */}
            <div className="p-4 sm:p-5 space-y-3 text-xs">

              {/* ---- PROJECT ---- */}
              {editType === "project" && (
                <>
                  <div>
                    <label className="block text-gray-400 mb-1">Project Title *</label>
                    <input type="text" value={editItem.title || ""} onChange={(e) => setEditItem({ ...editItem, title: e.target.value })}
                      className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs sm:text-sm" />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Category</label>
                    <select value={editItem.category || "Web"} onChange={(e) => setEditItem({ ...editItem, category: e.target.value })}
                      className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs sm:text-sm">
                      <option value="Web">Web Application</option>
                      <option value="Mobile">Mobile Application</option>
                      <option value="Portfolio">Portfolio / Showcase</option>
                      <option value="Backend">Backend / API</option>
                      <option value="AI">AI / Machine Learning</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Description</label>
                    <textarea rows={3} value={editItem.description || ""} onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs" />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Live Demo URL</label>
                    <input type="url" value={editItem.liveUrl || editItem.project_url || ""} onChange={(e) => setEditItem({ ...editItem, liveUrl: e.target.value, project_url: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 font-mono text-[11px]" />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">GitHub Repo URL</label>
                    <input type="url" value={editItem.githubUrl || editItem.github_url || ""} onChange={(e) => setEditItem({ ...editItem, githubUrl: e.target.value, github_url: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 font-mono text-[11px]" />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Image URL</label>
                    <input type="url" value={editItem.imageUrl || editItem.image_url || editItem.image || ""} onChange={(e) => setEditItem({ ...editItem, imageUrl: e.target.value, image_url: e.target.value, image: e.target.value })}
                      placeholder="https://... or /bannerImg.png"
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 font-mono text-[11px]" />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Technologies (comma-separated)</label>
                    <input type="text" value={editItem.technologies || ""} onChange={(e) => setEditItem({ ...editItem, technologies: e.target.value })}
                      className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs" />
                  </div>
                </>
              )}

              {/* ---- BLOG ---- */}
              {editType === "blog" && (
                <>
                  <div>
                    <label className="block text-gray-400 mb-1">Article Title *</label>
                    <input type="text" value={editItem.title || ""} onChange={(e) => setEditItem({ ...editItem, title: e.target.value })}
                      className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs sm:text-sm" />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Category</label>
                    <input type="text" value={editItem.category || ""} onChange={(e) => setEditItem({ ...editItem, category: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs" />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Short Excerpt *</label>
                    <textarea rows={2} value={editItem.excerpt || ""} onChange={(e) => setEditItem({ ...editItem, excerpt: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs" />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Article Content</label>
                    <textarea rows={5} value={editItem.content || ""} onChange={(e) => setEditItem({ ...editItem, content: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 font-mono text-xs" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-gray-400 mb-1">Read (min)</label>
                      <input type="number" value={editItem.reading_time || 4} onChange={(e) => setEditItem({ ...editItem, reading_time: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500" />
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-1">Publish Date</label>
                      <input type="date" value={editItem.published_date || ""} onChange={(e) => setEditItem({ ...editItem, published_date: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs" />
                    </div>
                  </div>
                </>
              )}

              {/* ---- SKILL ---- */}
              {editType === "skill" && (
                <>
                  <div>
                    <label className="block text-gray-400 mb-1">Skill Name *</label>
                    <input type="text" value={editItem.name || editItem.skill_name || ""} onChange={(e) => setEditItem({ ...editItem, name: e.target.value, skill_name: e.target.value })}
                      className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs sm:text-sm" />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Category</label>
                    <select value={editItem.category || "Coding"} onChange={(e) => setEditItem({ ...editItem, category: e.target.value })}
                      className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs sm:text-sm">
                      <option value="Coding">Coding / Frameworks</option>
                      <option value="Languages">Languages</option>
                      <option value="Design">Design / UI</option>
                      <option value="Knowledge">Knowledge / Cloud</option>
                      <option value="Tools">Tools & DevOps</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">
                      Proficiency Level: {editItem.level || editItem.proficiency_level}%
                    </label>
                    <input type="range" min="50" max="100"
                      value={editItem.level || editItem.proficiency_level || 85}
                      onChange={(e) => setEditItem({ ...editItem, level: Number(e.target.value), proficiency_level: Number(e.target.value) })}
                      className="w-full accent-purple-500 cursor-pointer h-2 bg-gray-700 rounded-lg" />
                  </div>
                </>
              )}

              {/* ---- EXPERIENCE ---- */}
              {editType === "experience" && (
                <>
                  <div>
                    <label className="block text-gray-400 mb-1">Job Title *</label>
                    <input type="text" value={editItem.title || editItem.job_title || ""} onChange={(e) => setEditItem({ ...editItem, title: e.target.value, job_title: e.target.value })}
                      className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs sm:text-sm" />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Company *</label>
                    <input type="text" value={editItem.company || ""} onChange={(e) => setEditItem({ ...editItem, company: e.target.value })}
                      className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs sm:text-sm" />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Time Period</label>
                    <input type="text" value={editItem.duration || editItem.time_period || ""} onChange={(e) => setEditItem({ ...editItem, duration: e.target.value, time_period: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs" />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Location</label>
                    <input type="text" value={editItem.location || ""} onChange={(e) => setEditItem({ ...editItem, location: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs" />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Description</label>
                    <textarea rows={3} value={editItem.description || ""} onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs" />
                  </div>
                </>
              )}

              {/* ---- EDUCATION ---- */}
              {editType === "education" && (
                <>
                  <div>
                    <label className="block text-gray-400 mb-1">Degree *</label>
                    <input type="text" value={editItem.degree || ""} onChange={(e) => setEditItem({ ...editItem, degree: e.target.value })}
                      className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs sm:text-sm" />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Institution *</label>
                    <input type="text" value={editItem.institution || ""} onChange={(e) => setEditItem({ ...editItem, institution: e.target.value })}
                      className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs sm:text-sm" />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Time Period</label>
                    <input type="text" value={editItem.duration || editItem.time_period || ""} onChange={(e) => setEditItem({ ...editItem, duration: e.target.value, time_period: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs" />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Location</label>
                    <input type="text" value={editItem.location || ""} onChange={(e) => setEditItem({ ...editItem, location: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs" />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Description</label>
                    <textarea rows={3} value={editItem.description || ""} onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs" />
                  </div>
                </>
              )}

              {/* ---- CERTIFICATION ---- */}
              {editType === "certification" && (
                <>
                  <div>
                    <label className="block text-gray-400 mb-1">Certificate Name *</label>
                    <input type="text" value={editItem.name || ""} onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                      className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs sm:text-sm" />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Issuer Organization</label>
                    <input type="text" value={editItem.issuer || ""} onChange={(e) => setEditItem({ ...editItem, issuer: e.target.value })}
                      className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs sm:text-sm" />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Year</label>
                    <input type="text" value={editItem.year || ""} onChange={(e) => setEditItem({ ...editItem, year: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs" />
                  </div>
                </>
              )}

              {/* ---- SOCIAL ---- */}
              {editType === "social" && (
                <>
                  <div>
                    <label className="block text-gray-400 mb-1">Platform *</label>
                    <select
                      value={editItem.platform || "LinkedIn"}
                      onChange={(e) => setEditItem({ ...editItem, platform: e.target.value, name: editItem.name || e.target.value })}
                      className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs sm:text-sm"
                    >
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="Github">GitHub</option>
                      <option value="Twitter">Twitter / X</option>
                      <option value="Instagram">Instagram</option>
                      <option value="YouTube">YouTube</option>
                      <option value="Facebook">Facebook</option>
                      <option value="Website">Personal Website</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Display Label</label>
                    <input
                      type="text"
                      value={editItem.name || ""}
                      onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                      className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">URL *</label>
                    <input
                      type="url"
                      value={editItem.url || ""}
                      onChange={(e) => setEditItem({ ...editItem, url: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 font-mono text-[11px]"
                    />
                  </div>
                </>
              )}

              {/* ---- SERVICE ---- */}
              {editType === "service" && (
                <>
                  <div>
                    <label className="block text-gray-400 mb-1">Service Title *</label>
                    <input
                      type="text"
                      value={editItem.title || ""}
                      onChange={(e) => setEditItem({ ...editItem, title: e.target.value })}
                      className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={editItem.description || ""}
                      onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Icon Type</label>
                    <select
                      value={editItem.icon || "web"}
                      onChange={(e) => setEditItem({ ...editItem, icon: e.target.value })}
                      className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs sm:text-sm"
                    >
                      <option value="web">Web Development</option>
                      <option value="mobile">Mobile Application</option>
                      <option value="design">UI/UX Design</option>
                      <option value="cloud">Cloud & DevOps</option>
                      <option value="api">Backend & API</option>
                    </select>
                  </div>
                </>
              )}

              {/* ---- FUN FACT ---- */}
              {editType === "funfact" && (
                <>
                  <div>
                    <label className="block text-gray-400 mb-1">Description *</label>
                    <input
                      type="text"
                      value={editItem.description || ""}
                      onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                      className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Value (number)</label>
                    <input
                      type="number"
                      min="0"
                      value={editItem.value || 0}
                      onChange={(e) => setEditItem({ ...editItem, value: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs"
                    />
                  </div>
                </>
              )}

              {/* ---- TESTIMONIAL ---- */}
              {editType === "testimonial" && (
                <>
                  <div>
                    <label className="block text-gray-400 mb-1">Client Name *</label>
                    <input
                      type="text"
                      value={editItem.name || ""}
                      onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                      className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Role / Job Title</label>
                    <input
                      type="text"
                      value={editItem.role || ""}
                      onChange={(e) => setEditItem({ ...editItem, role: e.target.value })}
                      className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Company</label>
                    <input
                      type="text"
                      value={editItem.company || ""}
                      onChange={(e) => setEditItem({ ...editItem, company: e.target.value })}
                      className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Feedback / Message *</label>
                    <textarea
                      rows={4}
                      value={editItem.message || ""}
                      onChange={(e) => setEditItem({ ...editItem, message: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs"
                    />
                  </div>
                </>
              )}

              {/* ---- LANGUAGE ---- */}
              {editType === "language" && (
                <>
                  <div>
                    <label className="block text-gray-400 mb-1">Language Name *</label>
                    <input
                      type="text"
                      value={editItem.name || ""}
                      onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                      className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Proficiency Level</label>
                    <select
                      value={editItem.level || "Professional"}
                      onChange={(e) => setEditItem({ ...editItem, level: e.target.value })}
                      className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-purple-500 text-xs sm:text-sm"
                    >
                      <option value="Native">Native</option>
                      <option value="Professional">Professional</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Basic">Basic</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-2 px-4 sm:px-5 pb-4 sm:pb-5 pt-2 border-t border-gray-800">
              <button onClick={closeEdit}
                className="px-4 py-2 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-xl transition">
                Cancel
              </button>
              <button onClick={handleSaveEdit}
                className="px-5 py-2 text-xs sm:text-sm bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-xl flex items-center gap-2 transition shadow-lg shadow-purple-900/30">
                <FaCheck /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
