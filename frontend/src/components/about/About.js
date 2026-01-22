import React, { useEffect, useState } from "react";
import { getProfile } from "../../services/profileService";
import AboutMe from "./AboutMe";
import MyServices from "./MyServices";
import FunFact from "./FunFact";

function About({ profile: profileProp }) {
  const [profile, setProfile] = useState(profileProp || null);
  const [loading, setLoading] = useState(!profileProp);

  useEffect(() => {
    if (profileProp) {
      setProfile(profileProp);
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(Array.isArray(data) ? data[0] : data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [profileProp]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] sm:min-h-screen">
        <div className="flex flex-col items-center gap-2 sm:gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-designColor border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="glass-card p-4 sm:p-6 md:p-8 text-center max-w-md mx-auto mt-10 sm:mt-20">
        <p className="text-gray-300 text-sm sm:text-base">No profile data found</p>
      </div>
    );
  }

  return (
    <div className="app-shell space-y-8 sm:space-y-12 md:space-y-16 py-6 sm:py-8 md:py-12">
      <AboutMe profile={profile} />
      <MyServices />
      <FunFact />
    </div>
  );
}

export default About;
