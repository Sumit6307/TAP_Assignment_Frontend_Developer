import React, { useState, useEffect } from 'react';
import MapCanvas from './components/MapCanvas';
import PoiCard from './components/PoiCard';
import LoadingSpinner from './components/LoadingSpinner';
import './App.css';

// Nearby Explorer: Find nearby points of interest using real Overpass API
const App = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [pointsOfInterest, setPointsOfInterest] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPoi, setSelectedPoi] = useState(null);

  // Geolocation API: Get user's current location
  // Reference: https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API
  useEffect(() => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('Geolocation API success:', { latitude, longitude });
          setUserLocation({ lat: latitude, lng: longitude });
          setLoading(false);
        },
        (err) => {
          console.error('Geolocation API error:', err.message);
          setError('Unable to retrieve location. Please enable location services.');
          setLoading(false);
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    } else {
      console.error('Geolocation API not supported');
      setError('Geolocation not supported by this browser.');
    }
  }, []);

  // Fetch POIs using real Overpass API (no dummy data)
  const fetchPOIs = async (lat, lng) => {
    try {
      // Query all amenities within 5km for broader results
      const query = `
        [out:json][timeout:25];
        node
          ["amenity"]
          (around:5000,${lat},${lng});
        out body;
      `;
      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: query,
      });
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      const data = await response.json();
      console.log('Overpass API response:', data);
      const pois = data.elements.map((node) => ({
        id: node.id,
        name: node.tags.name || node.tags.amenity || 'Unnamed Place',
        lat: node.lat,
        lng: node.lon,
        type: node.tags.amenity || 'unknown',
        description: node.tags.description || `A ${node.tags.amenity || 'place'} near you.`,
      }));
      if (pois.length === 0) {
        setError('No amenities found within 5km. Try a different location.');
      }
      return pois;
    } catch (err) {
      console.error('Overpass API error:', err.message);
      setError('Failed to fetch places from Overpass API.');
      return [];
    }
  };

  // Fetch POIs when location is available
  useEffect(() => {
    if (userLocation) {
      setLoading(true);
      fetchPOIs(userLocation.lat, userLocation.lng).then((pois) => {
        console.log('Fetched POIs:', pois);
        setPointsOfInterest(pois);
        setLoading(false);
      });
    }
  }, [userLocation]);

  // Background Tasks API: Schedule periodic distance updates
  // Reference: https://developer.mozilla.org/en-US/docs/Web/API/Background_Tasks_API
  useEffect(() => {
    const updateDistances = () => {
      if (userLocation && pointsOfInterest.length > 0) {
        const updatedPois = pointsOfInterest.map((poi) => {
          const distance = calculateDistance(userLocation.lat, userLocation.lng, poi.lat, poi.lng);
          return { ...poi, distance: distance.toFixed(2) };
        });
        setPointsOfInterest(updatedPois);
      }
    };

    const calculateDistance = (lat1, lng1, lat2, lng2) => {
      const R = 6371e3; // Earth's radius in meters
      const φ1 = (lat1 * Math.PI) / 180;
      const φ2 = (lat2 * Math.PI) / 180;
      const Δφ = ((lat2 - lat1) * Math.PI) / 180;
      const Δλ = ((lng2 - lng1) * Math.PI) / 180;
      const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return (R * c) / 1000; // Distance in kilometers
    };

    let idleCallbackId;
    const scheduleUpdate = () => {
      if (window.requestIdleCallback) {
        idleCallbackId = requestIdleCallback(
          () => {
            console.log('Background Tasks API: Updating distances');
            updateDistances();
            scheduleUpdate();
          },
          { timeout: 5000 }
        );
      } else {
        // Fallback for unsupported browsers
        console.log('Background Tasks API not supported, using setTimeout');
        setTimeout(() => {
          updateDistances();
          scheduleUpdate();
        }, 5000);
      }
    };

    scheduleUpdate();
    return () => {
      if (window.cancelIdleCallback && idleCallbackId) {
        cancelIdleCallback(idleCallbackId);
      }
    };
  }, [userLocation, pointsOfInterest]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-4 md:p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          Nearby Explorer
        </h1>
        <p className="text-gray-600 mt-2">Discover amazing places around you!</p>
      </header>

      {loading && <LoadingSpinner />}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mx-auto max-w-2xl">
          {error}
        </div>
      )}

      {userLocation && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <MapCanvas userLocation={userLocation} pointsOfInterest={pointsOfInterest} setSelectedPoi={setSelectedPoi} />
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">Nearby Places</h2>
            {pointsOfInterest.length === 0 && !loading && (
              <p className="text-gray-500">No places found nearby. Try a different location.</p>
            )}
            {pointsOfInterest.map((poi) => (
              <PoiCard key={poi.id} poi={poi} isSelected={selectedPoi?.id === poi.id} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;