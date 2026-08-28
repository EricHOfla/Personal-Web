import React from "react";
import { useTypewriter, Cursor } from "react-simple-typewriter";
import { BsCloudLightningFill } from "react-icons/bs";
import { FaGithub, FaLinkedin, FaFacebook, FaTwitter, FaYoutube, FaInstagram } from "react-icons/fa";
import { FiMail, FiSend, FiGlobe } from "react-icons/fi";
import { bannerImg } from "../../assets/index";
import { portfolioData } from "../../data";

const iconMap = {
  github: FaGithub,
  linkedin: FaLinkedin,
  facebook: FaFacebook,
  twitter: FaTwitter,
  youtube: FaYoutube,
  instagram: FaInstagram,
  email: FiMail,
  website: FiGlobe,
};

const Left = ({ profile = portfolioData.profile, setAbout, setResume, setProjects, setBlog, setContact }) => {
  const socialLinks = portfolioData.socialLinks || [];

  const [text] = useTypewriter({
    words: [
      profile?.title || "Software Engineer",
      "Full Stack Developer",
      "Available for work",
    ],
    loop: true,
    typeSpeed: 30,
    deleteSpeed: 20,
    delaySpeed: 99000,
  });

  const profileImageSrc = profile?.profile_image || profile?.profileImage || "/bannerImg.png";
  const cvUrl = profile?.cv_file || profile?.cvUrl || portfolioData.profile.cvUrl;

  return (
    <div className="w-full h-full bg-bodyColor rounded-2xl shadow-testShwdow z-10 overflow-hidden flex flex-col">
      {/* Image section */}
      <div className="w-full px-6 pt-5 flex justify-center">
        <div className="w-48 xs:w-52 sm:w-60 md:w-64 h-48 xs:h-52 sm:h-60 md:h-64 rounded-2xl overflow-hidden border border-surfaceBorder/60 shadow-lg relative bg-surface">
          <img
            className="w-full h-full object-cover object-top transition duration-500 hover:scale-105"
            src={profileImageSrc}
            onError={(e) => {
              if (e.target.src !== bannerImg) {
                e.target.src = bannerImg;
              }
            }}
            alt={profile?.full_name || profile?.fullName || "Profile banner"}
          />
        </div>
      </div>




      {/* Info section */}
      <div className="flex-1 flex flex-col justify-between p-4 sm:p-6">
        <div className="flex flex-col items-center gap-1.5 sm:gap-2">
          <h1 className="text-textColor text-xl xs:text-2xl sm:text-3xl font-semibold text-center">
            {profile?.full_name || profile?.fullName || profile?.first_name || "HABUMUGISHA Eric"}
          </h1>
          <p className="text-sm sm:text-base text-designColor tracking-wide text-center">
            {text}
            <Cursor cursorBlinking={false} cursorStyle="" />
          </p>

          {/* Social icons */}
          <div className="flex justify-center flex-wrap gap-2 sm:gap-3 mt-2">
            {socialLinks.length ? (
              socialLinks.map((link) => {
                const key = (link.platform || link.icon || link.name || "").toLowerCase();
                const Icon = iconMap[key] || FiGlobe;
                return (
                  <a
                    key={link.id || link.url}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-designColor duration-300 cursor-pointer text-lg sm:text-xl p-1.5 sm:p-2 rounded-full hover:bg-white/5 transition-all"
                  >
                    <Icon />
                  </a>
                );
              })
            ) : (
              <span className="text-xs sm:text-sm text-textSecondary">No social links</span>
            )}
          </div>
        </div>
        {/* Buttons */}
        <div className="flex flex-col xs:flex-row mt-4 min-h-[3rem] sm:h-14">
          <a
            href={cvUrl || "/Eric_H_Resume.pdf"}
            download="Eric_H_Resume.pdf"
            target="_blank"
            className="flex-1 border-t-[1px] xs:border-r-[1px] border-surfaceBorder text-xs sm:text-sm tracking-wide uppercase gap-1.5 sm:gap-2 group transition-all duration-300"
            rel="noreferrer"
            style={{ background: 'var(--btnGradient)' }}
          >
            <button className="w-full h-full py-3 xs:py-0 flex justify-center items-center gap-1.5 sm:gap-2 font-medium relative overflow-hidden dark:text-white text-textColor">
              <span className="relative z-10 text-xs sm:text-sm">Download CV</span>
              <BsCloudLightningFill className="relative z-10 group-hover:animate-pulse text-sm sm:text-base" />
            </button>
          </a>
          <button
            onClick={() => {
              setAbout(false);
              setResume(false);
              setProjects(false);
              setBlog(false);
              setContact(true);
            }}
            className="flex-1 border-t-[1px] border-surfaceBorder text-xs sm:text-sm tracking-wide uppercase flex justify-center items-center gap-1.5 sm:gap-2 text-textColor hover:text-designColor font-medium transition-all duration-300 group py-3 xs:py-0"
          >
            <span className="text-xs sm:text-sm">Contact me</span>
            <FiSend className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300 text-sm sm:text-base" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Left;

