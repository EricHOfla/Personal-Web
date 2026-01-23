import React, { useEffect, useState } from "react";
import ServicesCard from "./ServicesCard";
import { getServices } from "../../services/servicesService";

function MyServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices();
        setServices(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-8 sm:py-12">
        <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-designColor border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-4 sm:p-6 text-center text-red-400 text-sm sm:text-base">
        Error loading services: {error}
      </div>
    );
  }

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
            <ServicesCard key={service.id} service={service} />
          ))
        ) : (
          <div className="glass-card p-3 sm:p-4 md:p-6 text-center text-gray-300 col-span-full text-xs sm:text-sm md:text-base">
            No services available yet.
          </div>
        )}
      </div>
    </section>
  );
}

export default MyServices;
