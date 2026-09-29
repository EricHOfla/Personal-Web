import React, { useState } from "react";
import BlogCard from "./BlogCard";
import Testimonials from "../testimonials/Testimonials";
import { FaSearch, FaTimes } from "react-icons/fa";
import { portfolioData } from "../../data";

function Blog({ onReadMore, appData = portfolioData }) {
  const posts = appData?.blogPosts || portfolioData.blogPosts || [];
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = posts.filter((post) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const titleMatch = (post.title || "").toLowerCase().includes(q);
    const excerptMatch = (post.excerpt || "").toLowerCase().includes(q);
    const categoryMatch = (post.category || "").toLowerCase().includes(q);
    return titleMatch || excerptMatch || categoryMatch;
  });

  return (
    <section className="app-shell">
      <div className="section-header">
        <p className="section-label">Blog</p>
        <h1 className="section-title">Latest Articles</h1>
        <p className="text-textSecondary max-w-2xl mx-auto mb-4 sm:mb-6 text-sm sm:text-base px-2">
          Insights, tutorials, and thoughts on web development, design, and technology.
        </p>

        {/* Live Search Bar */}
        <div className="max-w-md mx-auto px-2">
          <div className="relative flex items-center">
            <FaSearch className="absolute left-3.5 text-textSecondary text-xs sm:text-sm" />
            <input
              type="text"
              placeholder="Search articles by title, topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2 bg-surface border border-surfaceBorder rounded-xl text-xs sm:text-sm text-titleColor placeholder-textSecondary focus:border-designColor focus:outline-none transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 text-textSecondary hover:text-white text-xs"
              >
                <FaTimes />
              </button>
            )}
          </div>
        </div>
      </div>

      {filteredPosts.length > 0 ? (
        <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <BlogCard key={post?.id || post?.slug} post={post} onReadMore={onReadMore} />
          ))}
        </div>
      ) : (
        <div className="glass-card p-6 sm:p-8 md:p-12 text-center">
          <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">📝</div>
          <p className="text-textColor text-base sm:text-lg md:text-xl mb-2">No posts yet</p>
          <p className="text-textSecondary text-sm sm:text-base">Check back soon for new content!</p>
        </div>
      )}

      {/* Testimonials Section */}
      <div className="mt-20">
        <Testimonials />
      </div>
    </section>
  );
}

export default Blog;

