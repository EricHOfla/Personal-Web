import React, { useEffect, useState } from "react";
import { portfolioData } from "./data";
import Home from "./Home";
import Admin from "./components/admin/Admin";
import "./App.css";

function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  const isMatchingAdminRoute = () => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();
    return (
      path.startsWith("/admin") ||
      hash.startsWith("#admin") ||
      hash.includes("token=") ||
      search.includes("token=")
    );
  };

  const [route, setRoute] = useState(() => {
    return isMatchingAdminRoute() ? "admin" : "home";
  });

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
    const handleLocationChange = () => {
      setRoute(isMatchingAdminRoute() ? "admin" : "home");
    };

    window.addEventListener("popstate", handleLocationChange);
    window.addEventListener("hashchange", handleLocationChange);
    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      window.removeEventListener("hashchange", handleLocationChange);
    };
  }, []);

  if (route === "admin") {
    return <Admin />;
  }

  return (
    <div className="w-full lgl:h-screen font-bodyfont overflow-hidden text-textColor bg-bodyColor transition-colors duration-300 relative">
      <div className="max-w-screen-2xl h-full mx-auto flex justify-center items-center">
        <Home
          profile={portfolioData.profile}
          appData={portfolioData}
          theme={theme}
          toggleTheme={toggleTheme}
        />
      </div>
    </div>
  );
}

export default App;
