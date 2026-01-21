import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight, FaChevronRight } from 'react-icons/fa';
import { HiOutlineExternalLink } from 'react-icons/hi';

function SidenavTitle({ item, index, iconMap, onNavigate }) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Get the appropriate icon based on item text or use default
  const itemKey = (item.item_text || '').toLowerCase().replace(/\s+/g, '');
  const Icon = iconMap?.[itemKey] || iconMap?.default;

  // Generate unique gradient colors based on index
  const gradientColors = [
    { 
      from: 'from-designColor/20', 
      to: 'to-yellow-500/20', 
      border: 'border-designColor/40', 
      text: 'text-designColor',
      iconBg: 'from-designColor/30 to-yellow-500/30',
      glow: 'shadow-designColor/20'
    },
    { 
      from: 'from-purple-500/20', 
      to: 'to-pink-500/20', 
      border: 'border-purple-400/40', 
      text: 'text-purple-400',
      iconBg: 'from-purple-500/30 to-pink-500/30',
      glow: 'shadow-purple-500/20'
    },
    { 
      from: 'from-cyan-500/20', 
      to: 'to-blue-500/20', 
      border: 'border-cyan-400/40', 
      text: 'text-cyan-400',
      iconBg: 'from-cyan-500/30 to-blue-500/30',
      glow: 'shadow-cyan-500/20'
    },
    { 
      from: 'from-green-500/20', 
      to: 'to-emerald-500/20', 
      border: 'border-green-400/40', 
      text: 'text-green-400',
      iconBg: 'from-green-500/30 to-emerald-500/30',
      glow: 'shadow-green-500/20'
    },
    { 
      from: 'from-orange-500/20', 
      to: 'to-amber-500/20', 
      border: 'border-orange-400/40', 
      text: 'text-orange-400',
      iconBg: 'from-orange-500/30 to-amber-500/30',
      glow: 'shadow-orange-500/20'
    },
    { 
      from: 'from-pink-500/20', 
      to: 'to-rose-500/20', 
      border: 'border-pink-400/40', 
      text: 'text-pink-400',
      iconBg: 'from-pink-500/30 to-rose-500/30',
      glow: 'shadow-pink-500/20'
    },
  ];
  
  const colorSet = gradientColors[index % gradientColors.length];

  // Handle click - determine if it's an internal navigation or external link
  const handleClick = (e) => {
    const itemText = (item.item_text || '').toLowerCase();
    const itemUrl = (item.item_url || '').toLowerCase();
    
    // Check if this is an internal page navigation
    const pageMap = {
      'about': 'about',
      'resume': 'resume',
      'cv': 'resume',
      'projects': 'projects',
      'portfolio': 'projects',
      'work': 'projects',
      'blog': 'blog',
      'contact': 'contact',
      'hire': 'contact',
    };
    
    // Find matching page from item text or url
    let targetPage = null;
    for (const [key, page] of Object.entries(pageMap)) {
      if (itemText.includes(key) || itemUrl.includes(key)) {
        targetPage = page;
        break;
      }
    }
    
    // If it's an internal page and we have onNavigate, use it
    if (targetPage && onNavigate) {
      e.preventDefault();
      onNavigate(targetPage);
    }
    // Otherwise, let the default link behavior happen (external links)
  };

  // Check if it's an external link
  const isExternalLink = item.item_url && (
    item.item_url.startsWith('http') || 
    item.item_url.startsWith('www')
  );

  return (
    <motion.a
      href={item.item_url || '#'}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ x: 6 }}
      whileTap={{ scale: 0.98 }}
      target={isExternalLink ? '_blank' : undefined}
      rel={isExternalLink ? 'noreferrer' : undefined}
      className={`
        group relative flex items-center gap-3 p-3 sm:p-3.5 rounded-xl
        bg-gradient-to-r from-transparent to-transparent
        hover:from-white/[0.03] hover:to-white/[0.08]
        border border-transparent hover:border-white/10
        transition-all duration-300 ease-out overflow-hidden cursor-pointer
      `}
    >
      {/* Colored Background on Hover */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        className={`absolute inset-0 bg-gradient-to-r ${colorSet.from} ${colorSet.to} rounded-xl`}
      />

      {/* Active Indicator Line */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b ${colorSet.from.replace('/20', '')} ${colorSet.to.replace('/20', '')} rounded-r-full origin-center`}
      />

      {/* Icon Container */}
      <div className="relative z-10">
        <motion.div 
          animate={{ 
            scale: isHovered ? 1.1 : 1,
            rotate: isHovered ? 5 : 0
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className={`
            w-10 h-10 sm:w-11 sm:h-11 rounded-xl
            bg-white/5 
            flex items-center justify-center flex-shrink-0
            border border-white/10
            transition-all duration-300
            ${isHovered ? `bg-gradient-to-br ${colorSet.iconBg} border-white/20 shadow-lg ${colorSet.glow}` : ''}
          `}
        >
          {Icon && (
            <Icon className={`
              text-base sm:text-lg transition-all duration-300
              ${isHovered ? colorSet.text : 'text-gray-400'}
            `} />
          )}
        </motion.div>
        
        {/* Icon Glow Effect */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ 
            opacity: isHovered ? 0.6 : 0, 
            scale: isHovered ? 1.5 : 0.5 
          }}
          className={`absolute inset-0 rounded-xl bg-gradient-to-br ${colorSet.iconBg} blur-xl -z-10`}
        />
      </div>

      {/* Text Content */}
      <div className="flex-1 min-w-0 relative z-10">
        <motion.span 
          className={`
            block text-sm sm:text-[15px] font-semibold tracking-wide
            transition-colors duration-300 truncate
            ${isHovered ? colorSet.text : 'text-gray-300'}
          `}
        >
          {item.item_text}
        </motion.span>
        {item.description && (
          <span className="block text-[11px] text-gray-500 truncate mt-0.5 group-hover:text-gray-400 transition-colors">
            {item.description}
          </span>
        )}
      </div>

      {/* Arrow/External Icon */}
      <motion.div
        initial={{ opacity: 0, x: -5 }}
        animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -5 }}
        transition={{ duration: 0.2 }}
        className={`flex-shrink-0 ${colorSet.text} relative z-10`}
      >
        {isExternalLink ? (
          <HiOutlineExternalLink className="text-sm" />
        ) : (
          <FaChevronRight className="text-xs" />
        )}
      </motion.div>

      {/* Shimmer Effect on Hover */}
      <motion.div
        initial={{ x: '-100%', opacity: 0 }}
        animate={{ 
          x: isHovered ? '200%' : '-100%', 
          opacity: isHovered ? 0.15 : 0 
        }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent -z-10 skew-x-12"
      />

      {/* Bottom Gradient Line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className={`absolute bottom-0 left-4 right-4 h-[2px] bg-gradient-to-r ${colorSet.from.replace('/20', '/50')} ${colorSet.to.replace('/20', '/50')} rounded-full origin-left`}
      />
    </motion.a>
  );
}

export default SidenavTitle;
