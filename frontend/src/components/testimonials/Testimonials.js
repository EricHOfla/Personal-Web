import React, { useEffect, useState } from "react";
import { getAllTestimonials } from "../../services/testimonialService";
import TestimonialCard from "./TestimonialCard";
import TestimonialForm from "./TestimonialForm";

const Testimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const fetchTestimonials = async () => {
        try {
            const data = await getAllTestimonials();
            setTestimonials(Array.isArray(data) ? data : data.results || []);
        } catch (error) {
            console.error("Failed to fetch testimonials", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTestimonials();
    }, [refreshTrigger]);

    const handleTestimonialAdded = () => {
        // Increment trigger to refresh list
        setRefreshTrigger(prev => prev + 1);
    };

    if (loading && refreshTrigger === 0) return (
        <div className="w-full py-16 flex justify-center">
            <div className="w-8 h-8 border-4 border-designColor border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="w-full py-16 sm:py-24 border-t border-white/5 space-y-16 sm:space-y-24">
            {/* Header and List Only if there are testimonials */}
            {testimonials.length > 0 && (
                <div>
                    <div className="section-header mb-12 sm:mb-16">
                        <p className="section-label">Testimonials</p>
                        <h2 className="section-title">What Clients Say</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base px-2">
                            Feedback from people I've worked with on various projects.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
                        {testimonials.map((item) => (
                            <TestimonialCard key={item.id} testimonial={item} />
                        ))}
                    </div>
                </div>
            )}

            {/* Always show the Form */}
            <TestimonialForm onTestimonialAdded={handleTestimonialAdded} />
        </div>
    );
};

export default Testimonials;
