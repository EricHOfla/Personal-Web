import React from "react";
import BlogCard from "./BlogCard";
import Testimonials from "../testimonials/Testimonials";
import { portfolioData } from "../../data";

function Blog({ onReadMore, appData = portfolioData }) {
  const posts = appData?.blogPosts || portfolioData.blogPosts || [];

  return (
    <section className="app-shell">
      <div className="section-header">
        <p className="section-label">Blog</p>
        <h1 className="section-title">Latest Articles</h1>
        <p className="text-textSecondary max-w-2xl mx-auto text-sm sm:text-base px-2">
          Insights, tutorials, and thoughts on web development, design, and technology.
        </p>
      </div>

      {posts.length > 0 ? (
        <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
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

