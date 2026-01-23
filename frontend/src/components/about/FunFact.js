import React, { useEffect, useState } from 'react';
import { getFunFacts } from '../../services/funFactsService';
import FunFactCard from './FunFactCard';

function FunFact() {
  const [funFacts, setFunFacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFunFacts = async () => {
      try {
        const data = await getFunFacts();
        setFunFacts(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        console.error('Failed to fetch fun facts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFunFacts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-10 h-10 border-4 border-designColor border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <section className="space-y-4 sm:space-y-6">
      <div className="text-center px-2">
        <p className="text-xs sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.2em] text-designColor mb-1.5 sm:mb-2">Fun Facts</p>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-titleColor">Numbers That Matter</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {funFacts.length ? (
          funFacts.map((fact) => <FunFactCard key={fact.id} fact={fact} />)
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
