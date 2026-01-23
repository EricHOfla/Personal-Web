import React, { useEffect, useState } from "react";
import { FaCalendar, FaClock, FaArrowLeft, FaUser, FaEye, FaLink } from "react-icons/fa";
import { getBlogPost } from "../../services/blogService";
import { buildMediaUrl } from "../../services/api";

function BlogDetail({ slug, onBack }) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        const data = await getBlogPost(slug);
        setPost(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch blog post:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <section className="app-shell">
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-designColor border-t-transparent rounded-full animate-spin"></div>
            <p className="text-textSecondary text-sm">Loading post...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error || !post) {
    return (
      <section className="app-shell">
        <div className="glass-card p-6 sm:p-8 md:p-12 text-center">
          <p className="text-red-400 mb-4 text-lg">⚠️ Failed to load blog post</p>
          <p className="text-textSecondary text-sm mb-6">{error || "Post not found"}</p>
          <button
            onClick={onBack}
            className="px-6 py-2 bg-designColor text-black rounded-lg hover:bg-designColor/90 transition font-medium"
          >
            Back to Blog
          </button>
        </div>
      </section>
    );
  }

  const {
    title = "Untitled Post",
    content,
    excerpt,
    published_date,
    category = "General",
    user,
    views_count = 0,
    slug: postSlug,
  } = post;

  const formattedDate = published_date
    ? new Date(published_date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
    : "Unknown date";

  const authorName = user?.full_name || user?.first_name || "Anonymous";

  // Calculate reading time based on content length (~200 words per minute)
  const wordsPerMinute = 200;
  const wordCount = content ? content.split(/\s+/).length : 0;
  const estimatedReadingTime = Math.max(1, Math.ceil(wordCount / wordsPerMinute));

  // Format content with paragraphs
  const formattedContent = content
    ? content.split("\n").filter((para) => para.trim())
    : [];

  return (
    <section className="app-shell">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="mb-4 sm:mb-6 flex items-center gap-2 text-textSecondary hover:text-designColor transition text-sm sm:text-base group"
      >
        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
        <span>Back to Blog</span>
      </button>

      <article className="glass-card p-4 sm:p-6 md:p-8 lg:p-12">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          {/* Category Badge */}
          <div className="mb-2 sm:mb-3">
            <span className="inline-block px-1 sm:px-2 py-1 sm:py-1.5 bg-designColor text-black text-xs sm:text-sm font-semibold rounded-full">
              {category || "General"}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-l sm:text-3xl md:text-xl lg:text-2xl font-bold text-titleColor mb-4 sm:mb-6 leading-tight">
            {title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-textSecondary mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-surfaceBorder">
            <div className="flex items-center gap-2">
              <FaCalendar className="text-designColor" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaClock className="text-designColor" />
              <span>{estimatedReadingTime} min read</span>
            </div>
            <div className="flex items-center gap-2">
              <FaUser className="text-designColor" />
              <span>By {authorName}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaEye className="text-designColor" />
              <span>{views_count} views</span>
            </div>
            {postSlug && (
              <div className="flex items-center gap-2">
                <FaLink className="text-designColor" />
                <span className="font-mono text-[10px] opacity-70">{postSlug}</span>
              </div>
            )}
          </div>
        </div>

        {/* Excerpt / Lead Paragraph */}
        {excerpt && (
          <div className="mb-8 p-4 sm:p-6 bg-surfaceBorder/10 border-l-4 border-designColor italic">
            <p className="text-base sm:text-lg md:text-xl text-textColor/90 leading-relaxed">
              {excerpt}
            </p>
          </div>
        )}

        {/* Content */}
        <div className="prose prose-invert max-w-none">
          {formattedContent.map((paragraph, index) => (
            <p
              key={index}
              className="text-sm sm:text-base md:text-lg text-textColor leading-relaxed mb-4 sm:mb-6 whitespace-pre-wrap"
            >
              {paragraph}
            </p>
          ))}
          {formattedContent.length === 0 && !excerpt && (
            <p className="text-textSecondary italic">No content available.</p>
          )}
        </div>

        {/* Footer */}
        <div className="mt-1 sm:mt-6 pt-1 sm:pt-2 border-t border-surfaceBorder">

        </div>
      </article>
    </section>
  );
}

export default BlogDetail;
