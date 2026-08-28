import React from "react";
import {
  FaCode, FaMobileAlt, FaPaintBrush, FaServer, FaDatabase,
  FaCloud, FaCogs, FaRocket, FaLaptopCode
} from "react-icons/fa";
import { MdDesignServices, MdWebAsset } from "react-icons/md";
import { BiCodeAlt } from "react-icons/bi";

// Comprehensive icon mapping for services
const iconMap = {
  // Direct icon name matches (from database icon field)
  'web': MdWebAsset,
  'website': MdWebAsset,
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
  'code': FaCode,
  'development': FaCode,
  'bicodealt': BiCodeAlt,
  'default': FaCode
};

// Get icon based on icon field or service title
const getServiceIcon = (service) => {
  if (!service) return iconMap.default;

  // First, try to match the icon field from database
  const iconField = (service.icon || "").toLowerCase().trim();
  if (iconField && iconMap[iconField]) {
    return iconMap[iconField];
  }

  // If icon field doesn't match, try to match by service title
  const title = (service.title || "").toLowerCase();

  // Check for keywords in title
  if (title.includes('web') || title.includes('website')) return iconMap.web;
  if (title.includes('design') || title.includes('ui') || title.includes('ux')) return iconMap.design;
  if (title.includes('mobile') || title.includes('app')) return iconMap.mobile;
  if (title.includes('backend') || title.includes('server')) return iconMap.backend;
  if (title.includes('database') || title.includes('db')) return iconMap.database;
  if (title.includes('cloud')) return iconMap.cloud;
  if (title.includes('frontend') || title.includes('front-end')) return iconMap.frontend;
  if (title.includes('api')) return iconMap.api;
  if (title.includes('devops') || title.includes('dev-ops')) return iconMap.devops;
  if (title.includes('code') || title.includes('development')) return iconMap.code;

  // Default fallback
  return iconMap.default;
};

function ServicesCard({ service }) {
  const Icon = getServiceIcon(service);

  return (
    <div className="glass-card p-3 sm:p-4 md:p-6 group hover:border-designColor/50 transition duration-300 hover:-translate-y-1 h-full flex flex-col items-center text-center">
      <div className="p-2 sm:p-2.5 md:p-3 rounded-md sm:rounded-lg md:rounded-xl bg-designColor/10 text-designColor group-hover:bg-designColor group-hover:text-white transition duration-300 mb-2 sm:mb-3 md:mb-4">
        <Icon className="text-xl sm:text-2xl md:text-3xl" />
      </div>
      <div className="flex-1 w-full">
        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-titleColor mb-1 sm:mb-1.5 md:mb-2 group-hover:text-designColor transition break-words">
          {service?.title || "Service"}
        </h3>
        <p className="text-[11px] xs:text-xs sm:text-sm text-textSecondary leading-relaxed break-words">
          {service?.description || "No description available."}
        </p>
      </div>
    </div>
  );
}

export default ServicesCard;
