import React, { useEffect, useState } from "react";
import { getProfile } from "./services/profileService";
import Home from "./Home";
import "./App.css";

function App() {
  const [profile, setProfile] = useState(null);
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
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        const resolvedProfile = Array.isArray(data) ? data[0] : data;
        setProfile(resolvedProfile || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-bodyColor">
        <div className="w-10 h-10 border-4 border-gray-600 border-t-designColor rounded-full animate-spin"></div>
      </div>
    );
  }
  if (error) return <div className="bg-bodyColor text-textColor h-screen flex items-center justify-center">Error: {error}</div>;

  return (
    <div className="w-full lgl:h-screen font-bodyfont overflow-hidden text-textColor bg-bodyColor transition-colors duration-300 relative">
      <div className="max-w-screen-2xl h-full mx-auto flex justify-center items-center">
        <Home profile={profile} theme={theme} toggleTheme={toggleTheme} />
      </div>
    </div>
  );
}

export default App;
