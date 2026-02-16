import React, { useEffect, useState, useCallback } from "react";
import { getAllTestimonials } from "../../services/testimonialService";
import TestimonialCard from "./TestimonialCard";
import TestimonialForm from "./TestimonialForm";
import { FaChevronLeft, FaChevronRight, FaPlus, FaTimes } from "react-icons/fa";

const Testimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
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
        fetchTestimonials();
    }, [refreshTrigger]);

    const handleTestimonialAdded = () => {
        setRefreshTrigger(prev => prev + 1);
        setShowModal(false);
    };

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1 >= testimonials.length ? 0 : prev + 1));
    }, [testimonials.length]);

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 < 0 ? testimonials.length - 1 : prev - 1));
    };

    // Auto-slide every 5 seconds
    useEffect(() => {
        if (testimonials.length > 1) {
            const interval = setInterval(nextSlide, 5000);
            return () => clearInterval(interval);
        }
    }, [testimonials.length, nextSlide]);

    if (loading && refreshTrigger === 0) return null;

    return (
        <div className="w-full py-10 sm:py-16 border-t border-surfaceBorder overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div className="section-header !mb-0 text-left">
                    <p className="section-label">Testimonials</p>
                    <h2 className="section-title !text-2xl sm:!text-3xl">What Clients Say</h2>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-designColor/10 border border-designColor/30 rounded-lg text-designColor text-sm font-semibold hover:bg-designColor hover:text-black transition-all"
                    >
                        <FaPlus className="text-xs" /> Write One
                    </button>

                    {testimonials.length > 1 && (
                        <div className="flex gap-2">
                            <button onClick={prevSlide} className="p-2 bg-surface border border-surfaceBorder rounded-lg hover:border-designColor/50 text-textSecondary hover:text-white transition-all">
                                <FaChevronLeft />
                            </button>
                            <button onClick={nextSlide} className="p-2 bg-surface border border-surfaceBorder rounded-lg hover:border-designColor/50 text-textSecondary hover:text-white transition-all">
                                <FaChevronRight />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {testimonials.length > 0 ? (
                <div className="relative w-full">
                    <div
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{ transform: `translateX(-${currentIndex * (window.innerWidth < 768 ? 100 : 33.333)}%)` }}
                    >
                        {testimonials.map((item) => (
                            <div key={item.id} className="w-full md:w-1/3 flex-shrink-0 px-2 sm:px-3">
                                <TestimonialCard testimonial={item} />
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="glass-card p-8 text-center bg-surface">
                    <p className="text-textTertiary text-sm">No testimonials yet. Be the first to leave one!</p>
                </div>
            )}

            {/* Modal for Submission */}
            {showModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-fadeIn">
                    <div className="relative w-full max-w-xl group">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute -top-12 right-0 text-textTertiary hover:text-designColor transition-all flex items-center gap-1 text-sm font-medium"
                        >
                            <FaTimes /> Close
                        </button>
                        <TestimonialForm onTestimonialAdded={handleTestimonialAdded} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Testimonials;
