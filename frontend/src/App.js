import React, { useEffect, useState } from "react";
import { prefetchAllData } from "./services/dataLoader";
import Home from "./Home";
import "./App.css";

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
    const loadAllData = async () => {
      try {
        const data = await prefetchAllData();
        // Resolve profile if it's an array
        const resolvedProfile = Array.isArray(data.profile) ? data.profile[0] : data.profile;
        setAppData({ ...data, profile: resolvedProfile });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
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
  if (error) return <div className="bg-bodyColor text-textColor h-screen flex items-center justify-center">Error: {error}</div>;

  return (
    <div className="w-full lgl:h-screen font-bodyfont overflow-hidden text-textColor bg-bodyColor transition-colors duration-300 relative">
      <div className="max-w-screen-2xl h-full mx-auto flex justify-center items-center">
        {appData?.profile && (
          <Home profile={appData.profile} appData={appData} theme={theme} toggleTheme={toggleTheme} />
        )}
      </div>
    </div>
  );
}

export default App;
