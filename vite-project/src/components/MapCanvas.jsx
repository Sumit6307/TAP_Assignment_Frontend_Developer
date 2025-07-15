import React, { useEffect, useRef, useState } from 'react';

// MapCanvas: Renders an interactive map using Canvas API
const MapCanvas = ({ userLocation, pointsOfInterest, setSelectedPoi }) => {
  const canvasRef = useRef(null);
  const [zoom, setZoom] = useState(1);

  // Canvas API: Draw map with user location and POIs
  // Reference: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && userLocation) {
      const ctx = canvas.getContext('2d');
      canvas.width = 500;
      canvas.height = 500;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background with gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#e0f7fa');
      gradient.addColorStop(1, '#b2ebf2');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Transform coordinates
      const scale = 10000 * zoom;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Draw user location with pulse animation
      ctx.fillStyle = 'rgba(59, 130, 246, 0.8)';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 12, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 16, 0, 2 * Math.PI);
      ctx.stroke();

      // Draw points of interest
      pointsOfInterest.forEach((poi) => {
        const x = centerX + (poi.lng - userLocation.lng) * scale;
        const y = centerY - (poi.lat - userLocation.lat) * scale;
        ctx.fillStyle = poi.type === 'cafe' ? '#ef4444' : poi.type === 'park' ? '#22c55e' : '#8b5cf6';
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = '#1f2937';
        ctx.font = '14px Arial';
        ctx.fillText(poi.name, x + 12, y + 4);
      });

      // Click handler for selecting POIs
      const handleClick = (event) => {
        const rect = canvas.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;

        const clickedPoi = pointsOfInterest.find((poi) => {
          const x = centerX + (poi.lng - userLocation.lng) * scale;
          const y = centerY - (poi.lat - userLocation.lat) * scale;
          const distance = Math.sqrt((clickX - x) ** 2 + (clickY - y) ** 2);
          return distance < 15;
        });

        setSelectedPoi(clickedPoi || null);
      };

      canvas.addEventListener('click', handleClick);
      return () => canvas.removeEventListener('click', handleClick);
    }
  }, [userLocation, pointsOfInterest, zoom, setSelectedPoi]);

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="rounded-lg shadow-md w-full" />
      <div className="absolute top-2 right-2 flex space-x-2">
        <button
          onClick={() => setZoom((prev) => Math.min(prev + 0.1, 2))}
          className="bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 transition"
        >
          +
        </button>
        <button
          onClick={() => setZoom((prev) => Math.max(prev - 0.1, 0.5))}
          className="bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 transition"
        >
          -
        </button>
      </div>
    </div>
  );
};

export default MapCanvas;