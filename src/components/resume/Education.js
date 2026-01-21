import React from "react";
import ResumeTitle from "./ResumeTitle";
import { MdWork } from "react-icons/md";
import { GiGraduateCap } from "react-icons/gi";
import ResumeCard from "./ResumeCard";

const Education = () => {
  return (
    <div className="w-full grid grid-cols-9 px-6">
      <div className="col-span-9 md:col-span-4">
        <ResumeTitle title="Experience" icon={<MdWork />} />
        <ResumeCard
          badge="2023- Present"
          title="Software Trainer & IT Support"
          subTitle="N@tcom Service Ltd"
          des="IT Support & Internship Supervisor"
        />
        <ResumeCard
          badge="2021 - 2022"
          title="Software Developer"
          subTitle="Mutation Supplies Ltd"
          des="web development & software development"
        />
        <ResumeCard
          badge="2022- 2024"
          title="Full Stack Developer"
          subTitle="EROH Tech"
          des="Software Development, Database Development, Security Development, Web Application and Moble Application"
        />
      </div>
      <div className="w-full h-full hidden lgl:flex justify-center items-center">
        <span className="w-[1px] h-full bg-zinc-800 inline-flex"></span>
      </div>
      <div className="col-span-9 md:col-span-4">
        <ResumeTitle title="Education" icon={<GiGraduateCap />} />
        <ResumeCard
          badge="2022- 2025"
          title="Software Engineering"
          subTitle="UNILAK, Kigali"
          des="we worked on Software Development, Database Development, Security Development, Web Application and Moble Application"
        />

       <ResumeCard
          badge="2018 - 2021"
          title="Software Developement "
          subTitle="Mutitian Supplies Ltd, Bugesera"
          des="Joined As A Trainee Where We Worked On Different Projects by using PHP, HTML, CSS, BOOSTRAP, DJANGO And JAVASCRIPT"
        />

        <ResumeCard
          badge="2017– 2019"
          title="Computer Science"
          subTitle="NYAMATA HIGH SCHOOL, Bugesera"
          des="MPC: Mathematics, Physics And Computer"
        />
        
      </div>
    </div>
  );
};

export default Education;
