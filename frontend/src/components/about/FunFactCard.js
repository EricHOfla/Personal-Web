import React, { useEffect, useState } from "react";
import { FaTrophy, FaCoffee, FaLightbulb, FaHeart } from "react-icons/fa";

const iconMap = {
  trophy: FaTrophy,
  coffee: FaCoffee,
  idea: FaLightbulb,
  heart: FaHeart,
};

const FunFactCard = ({ fact }) => {
  const [count, setCount] = useState(0);
  const key = (fact?.icon || "").toLowerCase();
  const Icon = iconMap[key] || FaTrophy;
  const target = parseInt(fact?.value, 10) || 0;

  useEffect(() => {
    if (target <= 0) return;
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target]);

  return (
    <div className="glass-card p-3 sm:p-4 md:p-6 text-center space-y-2 sm:space-y-3 hover:scale-105 transition duration-300">
      <div className="inline-flex p-2 sm:p-3 md:p-4 rounded-full bg-designColor/10 text-designColor">
        <Icon className="text-xl sm:text-2xl md:text-3xl" />
      </div>
      <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-ink">{count}+</p>
      <p className="text-xs sm:text-sm text-gray-400 uppercase tracking-wide leading-tight">
        {fact?.description || "Fun Fact"}
      </p>
    </div>
  );
};

export default FunFactCard;
