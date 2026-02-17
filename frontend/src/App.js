import React, { useEffect, useState } from "react";
import { prefetchAllData, prefetchEssentialData } from "./services/dataLoader";
import Home from "./Home";
import "./App.css";

const defaultAppData = {
  profile: null,
  socialLinks: [],
  services: [],
  funFacts: [],
  experiences: [],
  education: [],
  skills: [],
  projects: [],
  blogPosts: [],
  sidenavItems: [],
  testimonials: [],
};

function App() {
  const [appData, setAppData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    // Apply theme class to <html> for tailwind and css variables
    const root = window.document.documentElement;
    root.classList.remove("dark", "light");
    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        console.log('[App] Loading essential data...');
        const essentialData = await prefetchEssentialData();
        if (!isMounted) return;

        console.log('[App] Essential data loaded:', essentialData);
        
        const resolvedProfile = Array.isArray(essentialData.profile)
          ? essentialData.profile[0]
          : essentialData.profile;

        setAppData({
          ...defaultAppData,
          profile: resolvedProfile,
          socialLinks: essentialData.socialLinks || [],
        });
        setLoading(false);

        console.log('[App] Loading full data in background...');
        const fullData = await prefetchAllData();
        if (!isMounted) return;

        console.log('[App] Full data loaded:', fullData);
        
        const resolvedFullProfile = Array.isArray(fullData.profile)
          ? fullData.profile[0]
          : fullData.profile;

        setAppData({
          ...defaultAppData,
          ...fullData,
          profile: resolvedFullProfile,
        });
      } catch (err) {
        console.error('[App] Error loading data:', err);
        if (!isMounted) return;
        setError(err.message || 'Failed to load application data');
        setLoading(false);
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-bodyColor">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-600 border-t-designColor rounded-full animate-spin"></div>
          <p className="text-textColor text-sm animate-pulse">Loading application...</p>
        </div>
      </div>
    );
  }
  if (error) return (
    <div className="bg-bodyColor text-textColor h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <p className="text-red-500 mb-2">Error loading application</p>
        <p className="text-sm text-gray-400">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-designColor text-black rounded hover:bg-opacity-80"
        >
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full lgl:h-screen font-bodyfont overflow-hidden text-textColor bg-bodyColor transition-colors duration-300 relative">
      <div className="max-w-screen-2xl h-full mx-auto flex justify-center items-center">
        {appData?.profile ? (
          <Home profile={appData.profile} appData={appData} theme={theme} toggleTheme={toggleTheme} />
        ) : (
          <div className="flex items-center justify-center h-screen">
            <p className="text-textColor">No profile data available. Please check your backend.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
