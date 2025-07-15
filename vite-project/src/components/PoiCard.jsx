import React, { useEffect, useRef } from 'react';

// PoiCard: Displays individual point of interest with lazy-loaded details
const PoiCard = ({ poi, isSelected }) => {
  const cardRef = useRef(null);

  // Intersection Observer API: Lazy-load additional details when card is visible
  // Reference: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            console.log(`Intersection Observer API: Fetching details for ${poi.name}`);
            // In a real app, fetch additional details (e.g., photos, reviews) here
          }
        });
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [poi]);

  return (
    <div
      ref={cardRef}
      className={`p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
        isSelected ? 'border-2 border-blue-500' : ''
      }`}
      data-poi-id={poi.id}
    >
      <h3 className="text-lg font-semibold text-gray-800">{poi.name}</h3>
      <p className="text-gray-600 capitalize">{poi.type}</p>
      <p className="text-gray-500 text-sm mt-1">{poi.description}</p>
      {poi.distance && (
        <p className="text-gray-500 text-sm mt-1">Distance: {poi.distance} km</p>
      )}
    </div>
  );
};

export default PoiCard;