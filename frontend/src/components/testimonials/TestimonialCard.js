import React, { useEffect, useState } from "react";
import { HiQuote } from "react-icons/hi";
import { buildMediaUrl } from "../../services/api";

const TestimonialCard = ({ testimonial }) => {
    return (
        <div className="w-full h-full glass-card p-6 sm:p-8 flex flex-col justify-between group hover:-translate-y-2 transition-transform duration-300">
            <div>
                <div className="flex justify-between items-start mb-6">
                    <HiQuote className="text-4xl sm:text-5xl text-designColor opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="w-20 h-1 bg-gradient-to-r from-designColor to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed italic mb-8 relative z-10">
                    "{testimonial.message}"
                </p>
            </div>

            <div className="flex items-center gap-4 border-t border-gray-700 pt-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-designColor/50 shadow-lg relative">
                    {testimonial.image ? (
                        <img
                            className="w-full h-full object-cover"
                            src={buildMediaUrl(testimonial.image)}
                            alt={testimonial.name}
                        />
                    ) : (
                        <div className="w-full h-full bg-black flex items-center justify-center text-xl font-bold text-designColor">
                            {testimonial.name?.charAt(0) || "U"}
                        </div>
                    )}
                </div>
                <div className="flex flex-col">
                    <h3 className="text-base sm:text-lg font-bold text-white tracking-wide group-hover:text-designColor transition-colors duration-300">
                        {testimonial.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400 font-medium">
                        {testimonial.role}{testimonial.company && ` @ ${testimonial.company}`}
                    </p>
                </div>
            </div>

            {/* Decorative gradient blob */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-designColor/5 rounded-full blur-2xl group-hover:bg-designColor/10 transition-colors duration-300 pointer-events-none" />
        </div>
    );
};

export default TestimonialCard;
