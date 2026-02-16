import React, { useEffect, useState } from "react";
import { getAllBlogPosts } from "../../services/blogService";
import BlogCard from "./BlogCard";
import Testimonials from "../testimonials/Testimonials";

function Blog({ onReadMore, appData }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Use prefetched data if available
    if (appData?.blogPosts) {
      setPosts(Array.isArray(appData.blogPosts) ? appData.blogPosts : appData.blogPosts.results || []);
      setLoading(false);
      return;
    }

    // Fallback to fetching if no prefetched data
    const fetchPosts = async () => {
      try {
        const data = await getAllBlogPosts();
        setPosts(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch blog posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [appData]);

  return (
    <section className="app-shell">
      <div className="section-header">
        <p className="section-label">Blog</p>
        <h1 className="section-title">Latest Articles</h1>
        <p className="text-textSecondary max-w-2xl mx-auto text-sm sm:text-base px-2">
          Insights, tutorials, and thoughts on web development, design, and technology.
        </p>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4">
              <div className="skeleton h-40 xs:h-48 sm:h-52 md:h-56 w-full"></div>
              <div className="skeleton h-3 sm:h-4 w-3/4"></div>
              <div className="skeleton h-3 sm:h-4 w-full"></div>
              <div className="skeleton h-3 sm:h-4 w-5/6"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="glass-card p-4 sm:p-6 md:p-8 text-center">
          <p className="text-red-400 mb-3 sm:mb-4 text-sm sm:text-base">⚠️ Failed to load blog posts</p>
          <p className="text-textSecondary text-xs sm:text-sm">{error}</p>
        </div>
      ) : posts.length > 0 ? (
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
