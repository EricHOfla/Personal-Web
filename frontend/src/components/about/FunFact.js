import React from "react";
import FunFactCard from "./FunFactCard";
import { portfolioData } from "../../data";

function FunFact({ appData = portfolioData }) {
  const funFacts = appData?.funFacts || portfolioData.funFacts || [];

  return (
    <section className="space-y-4 sm:space-y-6">
      <div className="text-center px-2">
        <p className="text-xs sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.2em] text-designColor mb-1.5 sm:mb-2">
          Fun Facts
        </p>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-titleColor">Numbers That Matter</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {funFacts.length ? (
          funFacts.map((fact) => <FunFactCard key={fact.id || fact.description} fact={fact} />)
        ) : (
          <div className="glass-card p-4 sm:p-6 text-center text-textSecondary col-span-full text-sm sm:text-base">
            No fun facts available.
          </div>
        )}
      </div>
    </section>
  );
}

export default FunFact;

