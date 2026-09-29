import React, { useEffect, useState, useRef } from "react";
import { FaTrophy, FaCoffee, FaLightbulb, FaHeart } from "react-icons/fa";

const iconMap = {
  trophy: FaTrophy,
  coffee: FaCoffee,
  idea: FaLightbulb,
  heart: FaHeart,
};

const FunFactCard = ({ fact }) => {
  const [count, setCount] = useState(0);
  const cardRef = useRef(null);
  const hasAnimated = useRef(false);
  const key = (fact?.icon || "").toLowerCase();
  const Icon = iconMap[key] || FaTrophy;
  const target = parseInt(fact?.value, 10) || 0;

  useEffect(() => {
    if (target <= 0) return;
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 1800;
          const increment = Math.max(1, Math.ceil(target / (duration / 16)));
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(current);
            }
          }, 16);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={cardRef} className="glass-card p-3 sm:p-4 md:p-6 text-center space-y-2 sm:space-y-3 hover:scale-105 transition duration-300">
      <div className="inline-flex p-2 sm:p-3 md:p-4 rounded-full bg-designColor/10 text-designColor">
        <Icon className="text-xl sm:text-2xl md:text-3xl" />
      </div>
      <p className="text-lg sm:text-xl md:text-2xl font-bold text-titleColor">{count.toLocaleString()}+</p>
      <p className="text-xs sm:text-sm text-textTertiary uppercase tracking-wide leading-tight">
        {fact?.description || "Fun Fact"}
      </p>
    </div>
  );
};

export default FunFactCard;
