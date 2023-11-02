import React from "react";

const AboutMe = () => {
  return (
    <div className="flex flex-col md:flex-row pb-6">
      <div className="w-full md:w-1/2 text-zinc-400 px-6 border-r-[1px] border-r-zinc-800 flex items-center">
        <div className="py-6">
          <h2 className="font-semibold mb-1">Hello ! <h1><b>I'm Eric H Oflã ,</b></h1></h2>
          <p className="text-base leading-6 ">
          A Computer Scientist With More Than Four Years In Field Of Computing And Specializing In Software Development ,
           Designing Algorithms And Flowcharts To Create New Software Programs And Systems,
            Producing Efficient And Elegant Code Based On Requirements.
            
          </p>
        </div>
      </div>
      <div className="w-full md:w-1/2 p-6">
        <ul className="flex flex-col gap-1">
          <li className="aboutRightLi">
            <span className="aboutRightLiSpan">Qualifacation:</span>
            A0
          </li>
          <li className="aboutRightLi">
            <span className="aboutRightLiSpan">Residence:</span>
            RWANDA
          </li>
          <li className="aboutRightLi">
            <span className="aboutRightLiSpan">Freelance:</span>
            Available
          </li>
          <li className="aboutRightLi">
            <span className="aboutRightLiSpan">Address:</span>
            Kigali, RWANDA
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AboutMe;
