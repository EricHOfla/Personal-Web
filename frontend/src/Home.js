import React, { useRef, useState, lazy, Suspense } from "react";

import { FaUser, FaEnvelope, FaBars, FaSun, FaMoon } from "react-icons/fa";
import { IoIosPaper } from "react-icons/io";
import { MdWork, MdOutlineClose } from "react-icons/md";
import { SiGooglechat } from "react-icons/si";
import { BsTelephonePlusFill } from "react-icons/bs";

// Lazy load components for better performance
const Left = lazy(() => import("./components/home/Left"));
const About = lazy(() => import("./components/about/About"));
const Resume = lazy(() => import("./components/resume/Resume"));
const Projects = lazy(() => import("./components/projects/Projects"));
const Blog = lazy(() => import("./components/blog/Blog"));
const BlogDetail = lazy(() => import("./components/blog/BlogDetail"));
const Contact = lazy(() => import("./components/contact/Contact"));
const Sidenav = lazy(() => import("./components/home/sidenav/Sidenav"));

const Home = ({ profile, appData, theme, toggleTheme }) => {
  const [about, setAbout] = useState(true);
  const [resume, setResume] = useState(false);
  const [projects, setProjects] = useState(false);
  const [blog, setBlog] = useState(false);
  const [contact, setContact] = useState(false);
  const [sidenav, setSidenav] = useState(false);
  const [selectedBlogSlug, setSelectedBlogSlug] = useState(null);
  const sidenavRef = useRef();
  const backdropRef = useRef();

  const LoadingFallback = () => (
    <div className="w-full h-full flex items-center justify-center bg-transparent">
      <div className="w-10 h-10 border-4 border-gray-600 border-t-designColor rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="w-full lgl:w-[95%] h-full lgl:h-[85%] bg-transparent text-textColor z-50 flex flex-col lgl:flex-row items-start justify-between p-2 sm:p-4 lgl:p-0 pb-20 lgl:pb-0">
      {/* ================= Left Icons End here ======================== */}
      <nav className="w-16 h-96 bg-transparent hidden lgl:flex flex-col gap-4" aria-label="Desktop icons navigation">
        {/* ======= Theme Toggle start */}
        <div
          onClick={toggleTheme}
          className="w-full h-16 bg-gradient-to-b from-bodyColor to-surface rounded-3xl flex justify-center items-center cursor-pointer group border border-surfaceBorder hover:border-designColor/30 transition-all duration-300 shadow-lg shadow-black/20 hover:shadow-designColor/10"
          title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          <div className="text-xl text-textColor group-hover:text-designColor transition-colors duration-300">
            {theme === 'dark' ? <FaSun /> : <FaMoon />}
          </div>
        </div>
        {/* ======= Theme Toggle End */}

        {/* ======= Home Icon start */}
        <div
          onClick={() => setSidenav(true)}
          className="w-full h-20 bg-gradient-to-b from-bodyColor to-surface rounded-3xl flex justify-center items-center cursor-pointer group border border-surfaceBorder hover:border-designColor/30 transition-all duration-300 shadow-lg shadow-black/20 hover:shadow-designColor/10"
        >
          <div className="flex flex-col gap-1.5 overflow-hidden">
            <span
              className="w-8 h-[2px] bg-gradient-to-r from-textColor to-gray-500 inline-block -translate-x-2 group-hover:translate-x-0 transition-all duration-300 group-hover:from-designColor group-hover:to-purple-500 rounded-full"
            ></span>
            <span
              className="w-8 h-[2px] bg-gradient-to-r from-gray-500 to-textColor inline-block group-hover:from-purple-500 group-hover:to-designColor transition-all duration-300 rounded-full"
            ></span>
            <span
              className="w-8 h-[2px] bg-gradient-to-r from-textColor to-gray-500 inline-block -translate-x-3.5 group-hover:translate-x-0 transition-all duration-300 group-hover:from-designColor group-hover:to-purple-500 rounded-full"
            ></span>
          </div>
        </div>
        {/* ======= Home Icon End */}

        {/* ============= Sidenav End here =============== */}
        {/* ======= Other Icons Start */}
        <div className="w-full h-80 bg-bodyColor rounded-3xl flex flex-col items-center justify-between py-6 border border-surfaceBorder">
          {/* About Icon */}
          <span
            onClick={() => {
              setAbout(true);
              setResume(false);
              setProjects(false);
              setBlog(false);
              setContact(false);
            }}
            className={`${about
              ? "text-designColor"
              : "w-full h-6 text-textColor text-xl flex items-center justify-center hover:text-designColor duration-300 cursor-pointer relative group"
              } w-full h-6 text-xl flex items-center justify-center hover:text-designColor duration-300 cursor-pointer relative group`}
          >
            <FaUser />
            <span className="text-black font-medium text-xs uppercase bg-designColor px-4 py-[1px] rounded-xl absolute left-0 translate-x-8 group-hover:translate-x-12 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
              About
            </span>
          </span>
          {/* Resume Icon */}
          <span
            onClick={() => {
              setAbout(false);
              setResume(true);
              setProjects(false);
              setBlog(false);
              setContact(false);
            }}
            className={`${resume
              ? "text-designColor"
              : "w-full h-6 text-textColor text-xl flex items-center justify-center hover:text-designColor duration-300 cursor-pointer relative group"
              } w-full h-6 text-xl flex items-center justify-center hover:text-designColor duration-300 cursor-pointer relative group`}
          >
            <IoIosPaper />
            <span className="text-black font-medium text-xs uppercase bg-designColor px-4 py-[1px] rounded-xl absolute left-0 translate-x-8 group-hover:translate-x-12 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
              Resume
            </span>
          </span>
          {/* Project Icon */}
          <span
            onClick={() => {
              setAbout(false);
              setResume(false);
              setProjects(true);
              setBlog(false);
              setContact(false);
            }}
            className={`${projects
              ? "text-designColor"
              : "w-full h-6 text-textColor text-xl flex items-center justify-center hover:text-designColor duration-300 cursor-pointer relative group"
              } w-full h-6 text-xl flex items-center justify-center hover:text-designColor duration-300 cursor-pointer relative group`}
          >
            <MdWork />
            <span className="text-black font-medium text-xs uppercase bg-designColor px-4 py-[1px] rounded-xl absolute left-0 translate-x-8 group-hover:translate-x-12 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
              Projects
            </span>
          </span>
          {/* Blog Icon */}
          <span
            onClick={() => {
              setAbout(false);
              setResume(false);
              setProjects(false);
              setBlog(true);
              setContact(false);
              setSelectedBlogSlug(null);
            }}
            className={`${blog
              ? "text-designColor"
              : "w-full h-6 text-textColor text-xl flex items-center justify-center hover:text-designColor duration-300 cursor-pointer relative group"
              } w-full h-6 text-xl flex items-center justify-center hover:text-designColor duration-300 cursor-pointer relative group`}
          >
            <SiGooglechat />
            <span className="text-black font-medium text-xs uppercase bg-designColor px-4 py-[1px] rounded-xl absolute left-0 translate-x-8 group-hover:translate-x-12 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
              Blog
            </span>
          </span>
          {/* Contact Icon */}
          <span
            onClick={() => {
              setAbout(false);
              setResume(false);
              setProjects(false);
              setBlog(false);
              setContact(true);
            }}
            className={`${contact
              ? "text-designColor"
              : "w-full h-6 text-textColor text-xl flex items-center justify-center hover:text-designColor duration-300 cursor-pointer relative group"
              } w-full h-6 text-xl flex items-center justify-center hover:text-designColor duration-300 cursor-pointer relative group`}
          >
            <FaEnvelope />
            <span className="text-black font-medium text-xs uppercase bg-designColor px-4 py-[1px] rounded-xl absolute left-0 translate-x-8 group-hover:translate-x-12 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
              Contact
            </span>
          </span>
          {profile?.phone ? (
            <a
              href={`tel:${profile.phone.replace(/\s+/g, '')}`}
              className="w-full h-6 text-textColor text-xl flex items-center justify-center hover:text-designColor duration-300 cursor-pointer relative group"
              title={`Call ${profile.phone}`}
            >
              <BsTelephonePlusFill />
              <span className="text-black font-medium text-xs uppercase bg-designColor px-4 py-[1px] rounded-xl absolute left-0 translate-x-8 group-hover:translate-x-12 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                Call
              </span>
            </a>
          ) : (
            <span
              onClick={() => {
                setAbout(false);
                setResume(false);
                setProjects(false);
                setBlog(false);
                setContact(true);
                // Scroll to contact section on mobile
                setTimeout(() => {
                  const section = document.getElementById('contact-section');
                  if (section) {
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }, 100);
              }}
              className="w-full h-6 text-textColor text-xl flex items-center justify-center hover:text-designColor duration-300 cursor-pointer relative group"
              title="Go to Contact"
            >
              <BsTelephonePlusFill />
              <span className="text-black font-medium text-xs uppercase bg-designColor px-4 py-[1px] rounded-xl absolute left-0 translate-x-8 group-hover:translate-x-12 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                Contact
              </span>
            </span>
          )}
        </div>
        {/* ======= Other Icons End */}
      </nav>
      {/* ================= Left Icons Start here ====================== */}

      <main className="w-full lgl:w-[94%] h-full flex flex-col gap-4 sm:gap-6 lgl:gap-0 lgl:flex-row items-start">
        <Suspense fallback={<LoadingFallback />}>
          {/* ======================== Home Left Start here ============================ */}
          <aside className="w-full lgl:w-5/12 h-full">
            <Left
              profile={profile}
              setAbout={setAbout}
              setResume={setResume}
              setProjects={setProjects}
              setBlog={setBlog}
              setContact={setContact}
            />
          </aside>
          {/* ======================== Home Left End here ============================== */}

          <section className="w-full lgl:w-7/12 h-full bg-bodyColor rounded-2xl flex justify-center items-center">
            {/* ======================== Smaller device content Start ======================== */}
            <div className="w-full h-full lgl:hidden bg-transparent rounded-2xl flex flex-col gap-4 sm:gap-6 overflow-y-auto">
              <article id="about-section">
                <About profile={profile} appData={appData} />
              </article>
              <article id="resume-section">
                <Resume appData={appData} />
              </article>
              <article id="projects-section">
                <Projects appData={appData} />
              </article>
              <article id="blog-section">
                {selectedBlogSlug ? (
                  <BlogDetail slug={selectedBlogSlug} onBack={() => setSelectedBlogSlug(null)} />
                ) : (
                  <Blog appData={appData} onReadMore={(slug) => setSelectedBlogSlug(slug)} />
                )}
              </article>
              <article id="contact-section">
                <Contact profile={profile} />
              </article>
            </div>
            {/* ======================== Smaller device content End ========================== */}

            <div className="w-full h-[96%] hidden lgl:flex justify-center overflow-y-scroll scrollbar-thin scrollbar-thumb-[#646464]">
              <div className={`w-full ${about ? "block" : "hidden"}`}>
                <About profile={profile} appData={appData} />
              </div>

              <div className={`w-full ${resume ? "block" : "hidden"}`}>
                <Resume appData={appData} />
              </div>

              <div className={`w-full ${projects ? "block" : "hidden"}`}>
                <Projects appData={appData} />
              </div>

              <div className={`w-full ${blog ? "block" : "hidden"}`}>
                {selectedBlogSlug ? (
                  <BlogDetail slug={selectedBlogSlug} onBack={() => setSelectedBlogSlug(null)} />
                ) : (
                  <Blog appData={appData} onReadMore={(slug) => setSelectedBlogSlug(slug)} />
                )}
              </div>

              <div className={`w-full ${contact ? "block" : "hidden"}`}>
                <Contact profile={profile} />
              </div>
            </div>
          </section>
        </Suspense>
      </main>

      {/* ============= Sidenav - Accessible on all devices ============= */}
      <div
        ref={backdropRef}
        onClick={(e) => {
          // Close menu when clicking on backdrop (not on sidenav content)
          if (sidenavRef.current && !sidenavRef.current.contains(e.target)) {
            setSidenav(false);
          }
        }}
        className={`w-full h-[100dvh] fixed top-0 left-0 bg-black/70 backdrop-blur-sm z-[110] transition-opacity duration-300 ${sidenav ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
      >
        <div className={`w-full max-w-[85vw] sm:max-w-[380px] h-full relative transition-transform duration-300 ease-in-out ${sidenav ? 'translate-x-0' : '-translate-x-full'}`}>
          <div
            ref={sidenavRef}
            onClick={(e) => e.stopPropagation()}
            className="w-full h-full bg-gradient-to-b from-bodyColor via-bodyColor to-[#0d0d0d] overflow-y-auto scrollbar-thin scrollbar-thumb-designColor/30 scrollbar-track-transparent hover:scrollbar-thumb-designColor/50 border-r border-surfaceBorder relative"
          >
            {/* Close Button & Theme Toggle - Inside sidenav */}
            <div className="absolute top-4 right-4 flex flex-col items-center gap-3 z-50">
              <button
                onClick={() => setSidenav(false)}
                className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-bodyColor to-surface text-xl sm:text-2xl text-textSecondary hover:text-designColor duration-300 cursor-pointer flex items-center justify-center rounded-xl border border-surfaceBorder hover:border-designColor/30 shadow-lg shadow-black/50 hover:shadow-designColor/10"
                aria-label="Close menu"
              >
                <MdOutlineClose />
              </button>
              <button
                onClick={toggleTheme}
                className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-bodyColor to-surface text-xl text-textColor hover:text-designColor duration-300 cursor-pointer lgl:hidden flex items-center justify-center rounded-xl border border-white/10 hover:border-designColor/30 shadow-lg shadow-black/50 hover:shadow-designColor/10"
                title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {theme === 'dark' ? <FaSun /> : <FaMoon />}
              </button>
            </div>
            <Suspense fallback={<LoadingFallback />}>
              <Sidenav
                profile={profile}
                appData={appData}
                theme={theme}
                toggleTheme={toggleTheme}
                onNavigate={(page) => {
                  // Set page state for desktop view
                  setAbout(page === 'about');
                  setResume(page === 'resume');
                  setProjects(page === 'projects');
                  setBlog(page === 'blog');
                  setContact(page === 'contact');
                  if (page !== 'blog') {
                    setSelectedBlogSlug(null);
                  }

                  // Close the menu
                  setSidenav(false);

                  // On mobile, scroll to the section after a short delay
                  setTimeout(() => {
                    const sectionId = `${page}-section`;
                    const section = document.getElementById(sectionId);
                    if (section) {
                      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }, 100);
                }}
              />
            </Suspense>
          </div>
        </div>
      </div>

      {/* ============= Mobile Navigation Bar ============= */}
      <nav className={`mobile-nav lgl:hidden ${sidenav ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} aria-label="Mobile navigation">
        <div
          onClick={() => setSidenav(true)}
          className={`mobile-nav-item`}
        >
          <FaBars />
          <span>Menu</span>
        </div>

        <div
          onClick={() => {
            setAbout(true);
            setResume(false);
            setProjects(false);
            setBlog(false);
            setContact(false);
            // Scroll to section on mobile
            setTimeout(() => {
              const section = document.getElementById('about-section');
              if (section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }, 100);
          }}
          className={`mobile-nav-item ${about ? 'active' : ''}`}
        >
          <FaUser />
          <span>About</span>
        </div>
        <div
          onClick={() => {
            setAbout(false);
            setResume(true);
            setProjects(false);
            setBlog(false);
            setContact(false);
            // Scroll to section on mobile
            setTimeout(() => {
              const section = document.getElementById('resume-section');
              if (section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }, 100);
          }}
          className={`mobile-nav-item ${resume ? 'active' : ''}`}
        >
          <IoIosPaper />
          <span>Resume</span>
        </div>
        <div
          onClick={() => {
            setAbout(false);
            setResume(false);
            setProjects(true);
            setBlog(false);
            setContact(false);
            // Scroll to section on mobile
            setTimeout(() => {
              const section = document.getElementById('projects-section');
              if (section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }, 100);
          }}
          className={`mobile-nav-item ${projects ? 'active' : ''}`}
        >
          <MdWork />
          <span>Projects</span>
        </div>
        <div
          onClick={() => {
            setAbout(false);
            setResume(false);
            setProjects(false);
            setBlog(true);
            setContact(false);
            setSelectedBlogSlug(null);
            // Scroll to section on mobile
            setTimeout(() => {
              const section = document.getElementById('blog-section');
              if (section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }, 100);
          }}
          className={`mobile-nav-item ${blog ? 'active' : ''}`}
        >
          <SiGooglechat />
          <span>Blog</span>
        </div>
        <div
          onClick={() => {
            setAbout(false);
            setResume(false);
            setProjects(false);
            setBlog(false);
            setContact(true);
            // Scroll to section on mobile
            setTimeout(() => {
              const section = document.getElementById('contact-section');
              if (section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }, 100);
          }}
          className={`mobile-nav-item ${contact ? 'active' : ''}`}
        >
          <FaEnvelope />
          <span>Contact</span>
        </div>
        {profile?.phone && (
          <a
            href={`tel:${profile.phone.replace(/\s+/g, '')}`}
            className="mobile-nav-item"
            title={`Call ${profile.phone}`}
          >
            <BsTelephonePlusFill />
            <span>Call</span>
          </a>
        )}
      </nav>
    </div>
  );
};

export default Home;

