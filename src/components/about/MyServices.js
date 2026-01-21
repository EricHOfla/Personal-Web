import React from "react";
import { FaAppStoreIos } from "react-icons/fa";
import { AiTwotoneAppstore } from "react-icons/ai";
import { SiAntdesign } from "react-icons/si";
import { BiCodeAlt } from "react-icons/bi";
import ServicesCard from "./ServicesCard";

const MyServices = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      <ServicesCard
        icons={<BiCodeAlt />}
        title="Web Development"
        subTitle="we create proffesionoal websites that are easy to navigate, for individuals and campanies."
      />
      <ServicesCard
        icons={<SiAntdesign />}
        title="Web Design"
        subTitle="we offer web layout design, plan and code your internet sites and web pages."
      />
      <ServicesCard
        icons={<AiTwotoneAppstore />}
        title="Mobile Application"
        subTitle="we create proffesionoal app that are easy to navigate, for individuals and campanies."
      />
      <ServicesCard
        icons={<FaAppStoreIos />}
        title="SEO"
        subTitle="we connecting your business to the world we prossess a great deal of expertise in social media."
      />
    </div>
  );
};

export default MyServices;
