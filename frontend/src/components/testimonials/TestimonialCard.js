import React from "react";
import { FaQuoteLeft } from "react-icons/fa";
import { buildMediaUrl } from "../../services/api";

const TestimonialCard = ({ testimonial }) => {
    return (
        <div className="w-full h-full glass-card p-4 sm:p-5 flex flex-col justify-between group transition-all duration-300 hover:border-designColor/40">
            <div>
                <div className="flex justify-between items-start mb-3">
                    <FaQuoteLeft className="text-2xl sm:text-3xl text-designColor opacity-30 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <p className="text-textColor text-xs sm:text-sm leading-relaxed italic mb-5 line-clamp-4 group-hover:text-titleColor transition-colors">
                    "{testimonial.message}"
                </p>
            </div>

            <div className="flex items-center gap-3 border-t border-surfaceBorder pt-4 mt-auto">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-designColor/30 shadow-md flex-shrink-0">
                    {testimonial.image || testimonial.image_display ? (
                        <img
                            className="w-full h-full object-cover"
                            src={buildMediaUrl(testimonial.image_display || testimonial.image)}
                            alt={testimonial.name}
                        />
                    ) : (
                        <div className="w-full h-full bg-surface flex items-center justify-center text-sm font-bold text-designColor">
                            {testimonial.name?.charAt(0) || "U"}
                        </div>
                    )}
                </div>
                <div className="flex flex-col min-w-0">
                    <h3 className="text-sm font-bold text-titleColor tracking-wide truncate group-hover:text-designColor transition-colors">
                        {testimonial.name}
                    </h3>
                    <p className="text-[10px] text-textSecondary font-medium truncate">
                        {testimonial.role}{testimonial.company && ` @ ${testimonial.company}`}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TestimonialCard;
