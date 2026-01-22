import React, { useEffect, useState } from "react";
import { getProfile } from "./services/profileService";
import Home from "./Home";
import "./App.css";

function App() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    return <div>Loading...</div>;
  }
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="w-full lgl:h-screen font-bodyfont overflow-hidden text-textColor bg-black relative">
      <div className="max-w-screen-2xl h-full mx-auto flex justify-center items-center">
        <Home profile={profile} />
      </div>
    </div>
  );
}

export default App;
