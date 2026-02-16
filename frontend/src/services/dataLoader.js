// dataLoader.js - Prefetch and batch load all data

import { getProfile } from './profileService';
import { getSocialLinks } from './socialLinksService';
import { getServices } from './servicesService';
import { getFunFacts } from './funFactsService';
import { getExperiences } from './experiencesService';
import { getEducation } from './educationService';
import { getSkills } from './skillsService';
import { getProjects } from './projectsService';
import { getAllBlogPosts } from './blogService';
import { getSidenavItems } from './sidenavService';
import { getAllTestimonials } from './testimonialService';

/**
 * Prefetch all application data in parallel
 * This reduces the waterfall effect of sequential API calls
 * @returns {Promise<Object>} Object containing all prefetched data
 */
export const prefetchAllData = async () => {
  console.log('[DataLoader] Starting prefetch of all data...');
  const startTime = performance.now();

  try {
    // Fetch all data in parallel
    const [
      profile,
      socialLinks,
      services,
      funFacts,
      experiences,
      education,
      skills,
      projects,
      blogPosts,
      sidenavItems,
      testimonials,
    ] = await Promise.allSettled([
      getProfile(),
      getSocialLinks(),
      getServices(),
      getFunFacts(),
      getExperiences(),
      getEducation(),
      getSkills(),
      getProjects(),
      getAllBlogPosts(),
      getSidenavItems(),
      getAllTestimonials(),
    ]);

    const endTime = performance.now();
    console.log(`[DataLoader] Prefetch completed in ${(endTime - startTime).toFixed(2)}ms`);

    // Helper to extract value or return error
    const extract = (result, fallback = []) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        console.error('[DataLoader] Failed to load:', result.reason);
        return fallback;
      }
    };

    return {
      profile: extract(profile, null),
      socialLinks: extract(socialLinks),
      services: extract(services),
      funFacts: extract(funFacts),
      experiences: extract(experiences),
      education: extract(education),
      skills: extract(skills),
      projects: extract(projects),
      blogPosts: extract(blogPosts),
      sidenavItems: extract(sidenavItems),
      testimonials: extract(testimonials),
    };
  } catch (error) {
    console.error('[DataLoader] Prefetch failed:', error);
    throw error;
  }
};

/**
 * Prefetch essential data only (profile, social links)
 * @returns {Promise<Object>}
 */
export const prefetchEssentialData = async () => {
  console.log('[DataLoader] Prefetching essential data...');
  
  try {
    const [profile, socialLinks] = await Promise.all([
      getProfile(),
      getSocialLinks(),
    ]);

    return { profile, socialLinks };
  } catch (error) {
    console.error('[DataLoader] Essential data prefetch failed:', error);
    throw error;
  }
};

/**
 * Prefetch data for a specific section
 * @param {string} section - Section name ('about', 'resume', 'projects', 'blog')
 * @returns {Promise<Object>}
 */
export const prefetchSectionData = async (section) => {
  console.log(`[DataLoader] Prefetching data for section: ${section}`);

  const sectionDataMap = {
    about: async () => {
      const [profile, services, funFacts] = await Promise.all([
        getProfile(),
        getServices(),
        getFunFacts(),
      ]);
      return { profile, services, funFacts };
    },
    resume: async () => {
      const [experiences, education, skills] = await Promise.all([
        getExperiences(),
        getEducation(),
        getSkills(),
      ]);
      return { experiences, education, skills };
    },
    projects: async () => {
      const projects = await getProjects();
      return { projects };
    },
    blog: async () => {
      const blogPosts = await getAllBlogPosts();
      return { blogPosts };
    },
  };

  const loader = sectionDataMap[section];
  if (!loader) {
    console.warn(`[DataLoader] Unknown section: ${section}`);
    return {};
  }

  try {
    return await loader();
  } catch (error) {
    console.error(`[DataLoader] Failed to prefetch section ${section}:`, error);
    return {};
  }
};
