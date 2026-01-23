import React, { useEffect, useState } from 'react';
// import { motion} from 'framer-motion'; // Removed for performance
import {
  FaHome, FaUser, FaBriefcase, FaEnvelope, FaCode,
  FaGraduationCap, FaBlog, FaServicestack, FaCertificate,
  FaGithub, FaLinkedin, FaTwitter, FaArrowRight, FaFacebook,
  FaYoutube, FaInstagram, FaGlobe, FaPhone, FaMapMarkerAlt,
  FaLaptopCode, FaPaintBrush, FaMobileAlt, FaServer, FaDatabase,
  FaCloud, FaCogs, FaRocket
} from 'react-icons/fa';
import { HiSparkles, HiLightningBolt, HiOutlineExternalLink } from 'react-icons/hi';
import { BiCodeAlt } from 'react-icons/bi';
import { MdDesignServices, MdWebAsset } from 'react-icons/md';
import { getSidenavItems } from '../../../services/sidenavService';
import { getProfile } from '../../../services/profileService';
import { getSkills } from '../../../services/skillsService';
import { getProjects } from '../../../services/projectsService';
import { getExperiences } from '../../../services/experiencesService';
import { getSocialLinks } from '../../../services/socialLinksService';
import { getFunFacts } from '../../../services/funFactsService';
import { getServices } from '../../../services/servicesService';
import { buildMediaUrl } from '../../../services/api';
import SidenavTitle from './SidenavTitle';

// Icon mapping for navigation items
const iconMap = {
  home: FaHome,
  about: FaUser,
  projects: FaBriefcase,
  work: FaBriefcase,
  contact: FaEnvelope,
  skills: FaCode,
  education: FaGraduationCap,
  blog: FaBlog,
  services: FaServicestack,
  certificates: FaCertificate,
  default: BiCodeAlt
};

// Social icon mapping
const socialIconMap = {
  github: { Icon: FaGithub, color: 'hover:text-white hover:bg-gray-800' },
  linkedin: { Icon: FaLinkedin, color: 'hover:text-white hover:bg-blue-600' },
  twitter: { Icon: FaTwitter, color: 'hover:text-white hover:bg-cyan-500' },
  facebook: { Icon: FaFacebook, color: 'hover:text-white hover:bg-blue-500' },
  youtube: { Icon: FaYoutube, color: 'hover:text-white hover:bg-red-600' },
  instagram: { Icon: FaInstagram, color: 'hover:text-white hover:bg-pink-600' },
  website: { Icon: FaGlobe, color: 'hover:text-white hover:bg-designColor' },
  default: { Icon: FaGlobe, color: 'hover:text-white hover:bg-gray-700' }
};

// Service icon mapping
const serviceIconMap = {
  'web': MdWebAsset,
  'design': MdDesignServices,
  'mobile': FaMobileAlt,
  'backend': FaServer,
  'database': FaDatabase,
  'cloud': FaCloud,
  'frontend': FaLaptopCode,
  'ui': FaPaintBrush,
  'ux': FaPaintBrush,
  'api': FaCogs,
  'devops': FaRocket,
  'default': FaCode
};

// Calculate years of experience from experiences data
const calculateYearsOfExperience = (experiences) => {
  if (!experiences || experiences.length === 0) return 0;

  let totalMonths = 0;
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  experiences.forEach(exp => {
    const startYear = exp.start_year || exp.startYear || currentYear;
    const startMonth = exp.start_month || exp.startMonth || 1;
    const endYear = exp.end_year || exp.endYear || (exp.is_current ? currentYear : currentYear);
    const endMonth = exp.end_month || exp.endMonth || (exp.is_current ? currentMonth : 12);

    const months = (endYear - startYear) * 12 + (endMonth - startMonth);
    totalMonths += Math.max(0, months);
  });

  return Math.round(totalMonths / 12);
};

// Get service icon based on service name
const getServiceIcon = (serviceName) => {
  const name = (serviceName || '').toLowerCase();
  for (const [key, Icon] of Object.entries(serviceIconMap)) {
    if (name.includes(key)) return Icon;
  }
  return serviceIconMap.default;
};

function Sidenav({ onNavigate, profile: profileProp }) {
  const [items, setItems] = useState([]);
  const [profile, setProfile] = useState(profileProp || null);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);
  const [funFacts, setFunFacts] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profileProp) {
      setProfile(profileProp);
    }
    const fetchAllData = async () => {
      try {
        // Fetch all data in parallel for better performance
        const [
          sidenavData,
          skillsData,
          projectsData,
          experiencesData,
          socialData,
          funFactsData,
          servicesData,
          fetchedProfile
        ] = await Promise.all([
          getSidenavItems().catch(() => []),
          getSkills().catch(() => []),
          getProjects().catch(() => []),
          getExperiences().catch(() => []),
          getSocialLinks().catch(() => []),
          getFunFacts().catch(() => []),
          getServices().catch(() => []),
          // Only fetch profile if not provided in props
          !profileProp ? getProfile().catch(() => null) : Promise.resolve(null)
        ]);

        setItems(Array.isArray(sidenavData) ? sidenavData : sidenavData?.results || []);
        if (fetchedProfile) setProfile(fetchedProfile);
        setSkills(Array.isArray(skillsData) ? skillsData : skillsData?.results || []);
        setProjects(Array.isArray(projectsData) ? projectsData : projectsData?.results || []);
        setExperiences(Array.isArray(experiencesData) ? experiencesData : experiencesData?.results || []);
        setSocialLinks(Array.isArray(socialData) ? socialData : socialData?.results || []);
        setFunFacts(Array.isArray(funFactsData) ? funFactsData : funFactsData?.results || []);
        setServices(Array.isArray(servicesData) ? servicesData : servicesData?.results || []);
      } catch (err) {
        console.error('Failed to fetch sidenav data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [profileProp]);

  // Calculate dynamic stats
  const yearsOfExperience = calculateYearsOfExperience(experiences);
  const projectsCount = projects.length;
  const skillsCount = skills.length;

  // Filter skills for coding and design categories only
  const codingAndDesignSkills = skills.filter(skill => {
    const categoryName = typeof skill.category === 'object'
      ? (skill.category?.name || skill.category?.category_name || '').toLowerCase()
      : (skill.category || '').toLowerCase();

    return categoryName.includes('coding') ||
      categoryName.includes('programming') ||
      categoryName.includes('development') ||
      categoryName.includes('design') ||
      categoryName.includes('frontend') ||
      categoryName.includes('backend') ||
      categoryName.includes('web') ||
      categoryName.includes('software');
  });

  // Get top skills (first 6) for display - only coding and design
  const topSkills = codingAndDesignSkills.slice(0, 6);

  // Get top services (first 4)
  const topServices = services.slice(0, 4);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 120, damping: 15 }
    }
  };

  // Get fun fact values from database
  const getStatValue = (label) => {
    const fact = funFacts.find(f =>
      f.label?.toLowerCase().includes(label.toLowerCase()) ||
      f.title?.toLowerCase().includes(label.toLowerCase()) ||
      f.name?.toLowerCase().includes(label.toLowerCase())
    );
    return fact?.value || fact?.count || fact?.number || null;
  };

  // Get display name from profile
  const displayName = profile?.full_name || ((profile?.first_name && profile?.last_name)
    ? `${profile.first_name} ${profile.last_name}`
    : profile?.first_name || 'HABUMUGISHA Eric');

  // Get title from profile
  const displayTitle = profile?.title || profile?.job_title || profile?.qualification || 'Software Engineer';

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-b from-bodyColor to-[#0d0d0d]">
      <div className="relative flex items-center justify-center">
        {/* Simple CSS Spinner can be added here or just a static efficient loader */}
        <div className="w-10 h-10 border-4 border-gray-600 border-t-designColor rounded-full animate-spin"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-bodyColor via-bodyColor to-[#0a0a0a]">
      {/* ========== Header Section ========== */}
      <div
        className="relative overflow-hidden"
      >
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-designColor/20 via-purple-600/10 to-transparent"></div>
          <div
            className="absolute top-0 right-0 w-40 h-40 bg-designColor/20 rounded-full blur-3xl opacity-10"
          />
          <div
            className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl opacity-10"
          />
        </div>

        <div className="relative p-6 sm:p-8">
          {/* Profile Card */}
          <div
            className="flex items-center gap-4 mb-6"
          >
            <div className="relative group">
              {profile?.profile_image ? (
                <img
                  src={buildMediaUrl(profile.profile_image)}
                  alt={displayName}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-designColor/30 shadow-xl shadow-designColor/20 group-hover:border-designColor/60 transition-all duration-300"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-designColor via-purple-500 to-cyan-500 flex items-center justify-center shadow-xl shadow-designColor/20">
                  <HiLightningBolt className="text-black text-2xl" />
                </div>
              )}
              {/* Online Status Indicator */}
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-bodyColor"></span>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-titleColor truncate mb-0.5">
                {displayName}
              </h2>
              <p className="text-sm text-designColor font-medium truncate">
                {displayTitle}
              </p>
              {profile?.location && (
                <p className="text-xs text-textSecondary flex items-center gap-1 mt-1">
                  <FaMapMarkerAlt className="text-[10px]" />
                  <span className="truncate">{profile.location}</span>
                </p>
              )}
            </div>
          </div>

          {/* Status Badge from Database */}
          {profile?.freelance_status && (
            <div
              className="mb-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 backdrop-blur-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-xs text-green-400 font-semibold">{profile.freelance_status}</span>
            </div>
          )}

          {/* Stats Grid - All from Database */}
          <div className="grid grid-cols-3 gap-2">
            {[
              {
                value: yearsOfExperience > 0 ? `${yearsOfExperience}+` : getStatValue('year') || getStatValue('experience') || '—',
                label: 'Years Exp',
                color: 'from-designColor/20 to-yellow-500/20',
                borderColor: 'hover:border-designColor/50',
                textColor: 'text-designColor'
              },
              {
                value: projectsCount > 0 ? `${projectsCount}+` : getStatValue('project') || '—',
                label: 'Projects',
                color: 'from-purple-500/20 to-pink-500/20',
                borderColor: 'hover:border-purple-400/50',
                textColor: 'text-purple-400'
              },
              {
                value: getStatValue('client') || getStatValue('customer') || (projectsCount > 0 ? `${Math.ceil(projectsCount * 0.7)}+` : '—'),
                label: 'Clients',
                color: 'from-cyan-500/20 to-blue-500/20',
                borderColor: 'hover:border-cyan-400/50',
                textColor: 'text-cyan-400'
              }
            ].map((stat, i) => (
              <div
                key={i}
                className={`bg-gradient-to-br ${stat.color} rounded-xl p-3 text-center backdrop-blur-sm border border-surfaceBorder ${stat.borderColor} transition-all cursor-default hover:scale-105`}
              >
                <span className={`text-xl font-bold ${stat.textColor}`}>{stat.value}</span>
                <p className="text-[10px] text-textSecondary mt-0.5 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========== Services Section - From Database ========== */}
      {topServices.length > 0 && (
        <div
          className="px-4 sm:px-6 py-4 border-t border-surfaceBorder"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-5 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full"></div>
            <span className="text-xs font-bold text-textColor uppercase tracking-widest">Services</span>
            <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent ml-2"></div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {topServices.map((service, i) => {
              const serviceName = service.title || service.name || service.service_name || 'Service';
              const ServiceIcon = getServiceIcon(serviceName);

              return (
                <div
                  key={service.id || i}
                  className="group p-3 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-surfaceBorder hover:border-cyan-500/30 transition-all cursor-default hover:scale-105 hover:-translate-y-1"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center group-hover:from-cyan-500/30 group-hover:to-blue-500/30 transition-all">
                      <ServiceIcon className="text-cyan-400 text-sm" />
                    </div>
                  </div>
                  <p className="text-xs font-medium text-textColor group-hover:text-cyan-400 transition-colors truncate">
                    {serviceName}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========== Skills Section - From Database (Coding & Design Only) ========== */}
      {topSkills.length > 0 && (
        <div
          className="px-4 sm:px-6 py-4 border-t border-surfaceBorder"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-5 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
              <span className="text-xs font-bold text-textColor uppercase tracking-widest">Tech Stack</span>
            </div>
            {codingAndDesignSkills.length > 6 && (
              <span className="text-[10px] text-textSecondary bg-white/5 px-2 py-0.5 rounded-full">
                +{codingAndDesignSkills.length - 6} more
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {topSkills.map((skill, i) => {
              const skillName = skill.skill_name || skill.name || skill.title || 'Skill';
              const proficiency = skill.proficiency_level || skill.percentage || skill.level || 0;

              return (
                <div
                  key={skill.id || i}
                  className="group relative hover:scale-105 hover:-translate-y-1 transition-transform"
                >
                  <span className="px-3 py-1.5 text-[11px] font-semibold rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-textColor border border-purple-500/20 hover:border-purple-400/40 hover:text-purple-300 transition-all cursor-default inline-block">
                    {skillName}
                  </span>
                  {/* Proficiency indicator */}
                  {proficiency > 0 && (
                    <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-3/4 h-0.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                        style={{ width: `${proficiency}%` }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========== Footer Section (sticky on mobile) ========== */}
      <div
        className="mt-auto sticky bottom-0 p-4 sm:p-6 border-t border-surfaceBorder bg-gradient-to-t from-bodyColor to-transparent backdrop-blur-sm"
        style={{ background: 'var(--navBg)' }}
      >
        {/* Social Links - From Database */}
        {socialLinks.length > 0 && (
          <div className="flex items-center justify-center flex-wrap gap-2 mb-4">
            {socialLinks.map((link, i) => {
              const platform = (link.platform || link.icon || link.name || '').toLowerCase();
              const { Icon, color } = socialIconMap[platform] || socialIconMap.default;

              return (
                <a
                  key={link.id || i}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  title={link.platform || link.name || 'Social Link'}
                  className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-textSecondary ${color} transition-all hover:shadow-lg border border-surfaceBorder hover:border-white/20 hover:scale-110 hover:-translate-y-1`}
                >
                  <Icon className="text-lg" />
                </a>
              );
            })}
          </div>
        )}

        {/* Contact Info - From Database */}
        <div className="space-y-2 mb-4">
          {profile?.email && (
            <a
              href={`mailto:${profile.email}`}
              className="flex items-center justify-center gap-2 text-xs text-textSecondary hover:text-designColor transition-colors group"
            >
              <FaEnvelope className="text-sm group-hover:scale-110 transition-transform" />
              <span className="truncate">{profile.email}</span>
              <HiOutlineExternalLink className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          )}
          {profile?.phone && (
            <a
              href={`tel:${profile.phone.replace(/\s+/g, '')}`}
              className="flex items-center justify-center gap-2 text-xs text-textSecondary hover:text-green-400 transition-colors group"
              title={`Call ${profile.phone}`}
            >
              <FaPhone className="text-sm group-hover:scale-110 transition-transform" />
              <span>{profile.phone}</span>
            </a>
          )}
        </div>

        {/* Quick Call Button - Prominent */}
        {profile?.phone && (
          <a
            href={`tel:${profile.phone.replace(/\s+/g, '')}`}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white font-bold text-sm hover:shadow-xl hover:shadow-green-500/30 transition-all group cursor-pointer relative overflow-hidden mb-4 hover:scale-105"
            title={`Call ${profile.phone}`}
          >
            <FaPhone className="text-base group-hover:rotate-12 transition-transform" />
            <span className="relative z-10">Call Now</span>
            {/* Shimmer effect */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"
            />
          </a>
        )}

        {/* CTA Button */}
        <button
          onClick={() => onNavigate && onNavigate('contact')}
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-designColor via-purple-500 to-pink-500 text-bodyColor font-bold text-sm hover:shadow-xl hover:shadow-designColor/30 transition-all group cursor-pointer relative overflow-hidden hover:scale-105"
        >
          <span className="relative z-10">Let's Work Together</span>
          <FaArrowRight className="text-xs relative z-10 group-hover:translate-x-1 transition-transform" />
          {/* Shimmer effect */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"
          />
        </button>

        {/* Copyright - From Database (links to Admin) */}
        <a
          href="https://personal-web-srv9.onrender.com/admin/"
          target="_blank"
          rel="noopener noreferrer"
          title="Admin"
          className="block text-center text-[10px] text-textSecondary mt-4 hover:text-designColor transition-colors"
        >
          © {new Date().getFullYear()} {profile?.copyright_name || profile?.full_name || 'Eric H Ofla'}. All rights reserved
        </a>
      </div>
    </div>
  );
}

export default Sidenav;
