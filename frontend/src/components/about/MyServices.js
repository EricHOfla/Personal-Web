import React from "react";
import ServicesCard from "./ServicesCard";
import { portfolioData } from "../../data";

function MyServices({ appData = portfolioData }) {
  const services = appData?.services || portfolioData.services || [];

  return (
    <section className="space-y-3 sm:space-y-4 md:space-y-6 px-1 sm:px-2">
      <div className="text-center px-2">
        <p className="text-xs sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.2em] text-designColor mb-1.5 sm:mb-2">
          Services
        </p>
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-titleColor">What I Offer</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
        {services.length ? (
          services.map((service) => (
            <ServicesCard key={service.id || service.title} service={service} />
          ))
        ) : (
          <div className="glass-card p-3 sm:p-4 md:p-6 text-center text-textSecondary col-span-full text-xs sm:text-sm md:text-base">
            No services available yet.
          </div>
        )}
      </div>
    </section>
  );
}

export default MyServices;

