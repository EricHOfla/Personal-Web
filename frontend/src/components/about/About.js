import React from "react";
import { portfolioData } from "../../data";
import AboutMe from "./AboutMe";
import MyServices from "./MyServices";
import FunFact from "./FunFact";

function About({ profile = portfolioData.profile, appData = portfolioData }) {
  return (
    <div className="app-shell space-y-8 sm:space-y-12 md:space-y-16 py-6 sm:py-8 md:py-12">
      <AboutMe profile={profile} />
      <MyServices appData={appData} />
      <FunFact appData={appData} />
    </div>
  );
}

export default About;

