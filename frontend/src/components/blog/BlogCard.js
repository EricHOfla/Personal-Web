import React from "react";
import { FaCalendar, FaClock, FaArrowRight } from "react-icons/fa";
import { buildMediaUrl } from "../../services/api";

function BlogCard({ post, onReadMore }) {
  if (!post) return null;

  const {
    slug,
    featured_image,
    title = "Untitled Post",
    excerpt,
    content,
    published_date,
    category = "General",
    user,
  } = post;

  const handleReadMore = (e) => {
    e.preventDefault();
    if (slug && onReadMore) {
      onReadMore(slug);
    }
  };

  const description =
    excerpt ||
    (content ? `${content.substring(0, 120)}...` : "No description available.");

  const formattedDate = published_date
    ? new Date(published_date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    : "Unknown date";

  const imageSrc = buildMediaUrl(featured_image);
  const authorName = user?.full_name || user?.first_name || "Anonymous";

  return (
    <article className="glass-card group overflow-hidden flex flex-col h-full cursor-pointer" onClick={handleReadMore}>
      <div
        className="block relative overflow-hidden h-40 xs:h-48 sm:h-52 md:h-56"
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={title}
            className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-designColor/20 to-cyan-500/20 flex items-center justify-center">
            <span className="text-4xl sm:text-5xl md:text-6xl opacity-20">📝</span>
          </div>
        )}
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
          <span className="inline-block px-2 sm:px-3 py-0.5 sm:py-1 bg-designColor text-black text-[10px] sm:text-xs font-semibold rounded-full">
            {category || "General"}
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-5 md:p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 text-[9px] xs:text-[10px] sm:text-xs text-textSecondary mb-2 sm:mb-3 flex-wrap">
          <span className="flex items-center gap-0.5 sm:gap-1">
            <FaCalendar className="text-designColor text-[9px] xs:text-[10px] sm:text-xs flex-shrink-0" />
            <span className="whitespace-nowrap">{formattedDate}</span>
          </span>
          <span className="flex items-center gap-0.5 sm:gap-1">
            <FaClock className="text-designColor text-[9px] xs:text-[10px] sm:text-xs flex-shrink-0" />
            <span className="whitespace-nowrap">{post.reading_time ? `${post.reading_time} min` : "5 min"}</span>
          </span>
          {post.views_count !== undefined && (
            <span className="flex items-center gap-1 text-textTertiary">
              <span className="opacity-50 text-[10px]">•</span>
              <span className="whitespace-nowrap">{post.views_count} views</span>
            </span>
          )}
        </div>

        <h2 className="text-base sm:text-lg md:text-xl font-bold text-titleColor mb-2 sm:mb-3 line-clamp-2 group-hover:text-designColor transition cursor-pointer">
          {title}
        </h2>

        <p className="text-xs sm:text-sm text-textColor opacity-80 leading-relaxed mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3 flex-1">
          {description}
        </p>

        <div className="flex items-center justify-between pt-2 sm:pt-3 md:pt-4 border-t border-surfaceBorder gap-2">
          <div className="flex items-center gap-3 overflow-hidden flex-1">
            <span className="text-[9px] xs:text-[10px] sm:text-xs text-textSecondary truncate">By {authorName}</span>
          </div>
          <button
            onClick={handleReadMore}
            className="text-[10px] xs:text-xs sm:text-sm font-medium text-designColor hover:gap-1.5 sm:hover:gap-2 flex items-center gap-0.5 sm:gap-1 transition-all flex-shrink-0"
          >
            <span className="hidden xs:inline">Read More</span>
            <span className="xs:hidden">More</span>
            <FaArrowRight className="text-[9px] xs:text-[10px] sm:text-xs flex-shrink-0" />
          </button>
        </div>
      </div>
    </article>
  );
}

export default React.memo(BlogCard);
