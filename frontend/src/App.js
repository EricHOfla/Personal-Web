import React, { useEffect, useState } from "react";
import { portfolioData } from "./data";
import Home from "./Home";
import "./App.css";

function App() {
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

