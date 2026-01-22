import React, { useEffect, useState } from "react";
import { getProfile } from "./services/profileService";
import Spinner from "./components/Spinner";
import RoundOne from "./components/roundDesigns/RoundOne";
import RoundTwo from "./components/roundDesigns/RoundTwo";
import RoundThree from "./components/roundDesigns/RoundThree";
import RoundFour from "./components/roundDesigns/RoundFour";
import RoundFive from "./components/roundDesigns/RoundFive";
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
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="w-full lgl:h-screen font-bodyfont overflow-hidden text-textColor bg-black relative">
      <div className="max-w-screen-2xl h-full mx-auto flex justify-center items-center">
        <Home profile={profile} />
      </div>
      <div className="w-full h-full absolute top-0 left-0 z-10">
        <RoundOne />
        <RoundTwo />
        <RoundThree />
        <RoundFour />
        <RoundFive />
      </div>
    </div>
  );
}

export default App;
