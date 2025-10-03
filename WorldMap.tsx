import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { MapPin, Navigation, Search, X } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface WorldMapProps {
  onLocationSelect: (location: { lat: number; lng: number; city: string }) => void;
  selectedLocation: { lat: number; lng: number; city: string } | null;
}

export function WorldMap({ onLocationSelect, selectedLocation }: WorldMapProps) {
  const [mapPosition, setMapPosition] = useState({ x: 50, y: 50 });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ lat: number; lng: number; city: string }>>([]);
  const [showResults, setShowResults] = useState(false);

  // Enhanced location database with more accurate geographic distribution
  const locationDatabase = [
    // North America
    { lat: 40.7128, lng: -74.0060, city: 'New York, USA', region: 'north-america' },
    { lat: 34.0522, lng: -118.2437, city: 'Los Angeles, USA', region: 'north-america' },
    { lat: 41.8781, lng: -87.6298, city: 'Chicago, USA', region: 'north-america' },
    { lat: 29.7604, lng: -95.3698, city: 'Houston, USA', region: 'north-america' },
    { lat: 25.7617, lng: -80.1918, city: 'Miami, USA', region: 'north-america' },
    { lat: 37.7749, lng: -122.4194, city: 'San Francisco, USA', region: 'north-america' },
    { lat: 45.5017, lng: -73.5673, city: 'Montreal, Canada', region: 'north-america' },
    { lat: 43.6532, lng: -79.3832, city: 'Toronto, Canada', region: 'north-america' },
    { lat: 19.4326, lng: -99.1332, city: 'Mexico City, Mexico', region: 'north-america' },
    
    // Europe
    { lat: 51.5074, lng: -0.1278, city: 'London, UK', region: 'europe' },
    { lat: 48.8566, lng: 2.3522, city: 'Paris, France', region: 'europe' },
    { lat: 52.5200, lng: 13.4050, city: 'Berlin, Germany', region: 'europe' },
    { lat: 41.9028, lng: 12.4964, city: 'Rome, Italy', region: 'europe' },
    { lat: 40.4168, lng: -3.7038, city: 'Madrid, Spain', region: 'europe' },
    { lat: 59.9139, lng: 10.7522, city: 'Oslo, Norway', region: 'europe' },
    { lat: 55.7558, lng: 37.6176, city: 'Moscow, Russia', region: 'europe' },
    { lat: 50.0755, lng: 14.4378, city: 'Prague, Czech Republic', region: 'europe' },
    
    // Asia
    { lat: 35.6762, lng: 139.6503, city: 'Tokyo, Japan', region: 'asia' },
    { lat: 39.9042, lng: 116.4074, city: 'Beijing, China', region: 'asia' },
    { lat: 31.2304, lng: 121.4737, city: 'Shanghai, China', region: 'asia' },
    { lat: 28.6139, lng: 77.2090, city: 'New Delhi, India', region: 'asia' },
    { lat: 19.0760, lng: 72.8777, city: 'Mumbai, India', region: 'asia' },
    { lat: 1.3521, lng: 103.8198, city: 'Singapore', region: 'asia' },
    { lat: 37.5665, lng: 126.9780, city: 'Seoul, South Korea', region: 'asia' },
    { lat: 13.7563, lng: 100.5018, city: 'Bangkok, Thailand', region: 'asia' },
    
    // Oceania
    { lat: -33.8688, lng: 151.2093, city: 'Sydney, Australia', region: 'oceania' },
    { lat: -37.8136, lng: 144.9631, city: 'Melbourne, Australia', region: 'oceania' },
    { lat: -36.8485, lng: 174.7633, city: 'Auckland, New Zealand', region: 'oceania' },
    
    // Africa
    { lat: -26.2041, lng: 28.0473, city: 'Johannesburg, South Africa', region: 'africa' },
    { lat: 30.0444, lng: 31.2357, city: 'Cairo, Egypt', region: 'africa' },
    { lat: -33.9249, lng: 18.4241, city: 'Cape Town, South Africa', region: 'africa' },
    { lat: 6.5244, lng: 3.3792, city: 'Lagos, Nigeria', region: 'africa' },
    
    // South America
    { lat: -23.5505, lng: -46.6333, city: 'São Paulo, Brazil', region: 'south-america' },
    { lat: -22.9068, lng: -43.1729, city: 'Rio de Janeiro, Brazil', region: 'south-america' },
    { lat: -34.6037, lng: -58.3816, city: 'Buenos Aires, Argentina', region: 'south-america' },
    { lat: -12.0464, lng: -77.0428, city: 'Lima, Peru', region: 'south-america' },
  ];

  // Convert map coordinates to lat/lng with better accuracy
  const mapToCoordinates = (x: number, y: number) => {
    // More accurate mapping: x (0-100) to lng (-180 to 180), y (0-100) to lat (85 to -85)
    const lng = (x / 100) * 360 - 180;
    const lat = 85 - (y / 100) * 170; // Mercator projection adjustment
    return { lat, lng };
  };

  // Convert lat/lng to map coordinates
  const coordinatesToMap = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 100;
    const y = ((85 - lat) / 170) * 100;
    return { x, y };
  };

  // Find nearest location to clicked coordinates
  const findNearestLocation = (clickLat: number, clickLng: number) => {
    let nearest = locationDatabase[0];
    let minDistance = Infinity;

    locationDatabase.forEach(location => {
      const distance = Math.sqrt(
        Math.pow(location.lat - clickLat, 2) + Math.pow(location.lng - clickLng, 2)
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearest = location;
      }
    });

    return nearest;
  };

  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    
    setMapPosition({ x, y });
    
    // Convert click position to coordinates
    const coordinates = mapToCoordinates(x, y);
    
    // Find nearest actual location
    const nearestLocation = findNearestLocation(coordinates.lat, coordinates.lng);
    
    // Update map position to show the actual selected location
    const actualMapPos = coordinatesToMap(nearestLocation.lat, nearestLocation.lng);
    setMapPosition(actualMapPos);
    
    onLocationSelect({
      lat: nearestLocation.lat,
      lng: nearestLocation.lng,
      city: nearestLocation.city
    });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      const results = locationDatabase.filter(location =>
        location.city.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8);
      setSearchResults(results);
      setShowResults(true);
    } else {
      setShowResults(false);
      setSearchResults([]);
    }
  };

  const selectSearchResult = (location: { lat: number; lng: number; city: string }) => {
    const mapPos = coordinatesToMap(location.lat, location.lng);
    setMapPosition(mapPos);
    onLocationSelect({
      lat: location.lat,
      lng: location.lng,
      city: location.city
    });
    setSearchQuery(location.city);
    setShowResults(false);
    setSearchResults([]);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setShowResults(false);
    setSearchResults([]);
  };

  const handleUseGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const nearestLocation = findNearestLocation(latitude, longitude);
          const mapPos = coordinatesToMap(nearestLocation.lat, nearestLocation.lng);
          setMapPosition(mapPos);
          onLocationSelect({
            lat: nearestLocation.lat,
            lng: nearestLocation.lng,
            city: `${nearestLocation.city} (Near your location)`
          });
        },
        () => {
          // Fallback to a default location
          const fallback = { lat: 37.7749, lng: -122.4194, city: 'San Francisco, USA (Default)' };
          const mapPos = coordinatesToMap(fallback.lat, fallback.lng);
          setMapPosition(mapPos);
          onLocationSelect(fallback);
        }
      );
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-green-50 border-0 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg text-gray-800">Select Location</h3>
        <Button 
          onClick={handleUseGPS}
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
        >
          <Navigation className="w-4 h-4" />
          Use GPS
        </Button>
      </div>

      {/* Search Input */}
      <div className="relative mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search for a city..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 pr-10 bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        {/* Search Results */}
        {showResults && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
            {searchResults.map((result, index) => (
              <button
                key={index}
                onClick={() => selectSearchResult(result)}
                className="w-full text-left px-4 py-2 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  <span className="text-gray-800">{result.city}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div 
        className="relative h-64 rounded-lg overflow-hidden cursor-crosshair bg-gradient-to-br from-blue-200 to-green-200"
        onClick={handleMapClick}
      >
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1669950200208-c8a60cd1d8de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b3JsZCUyMG1hcCUyMHNhdGVsbGl0ZSUyMGVhcnRofGVufDF8fHx8MTc1ODkxMTk0MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="World Map"
          className="w-full h-full object-cover opacity-70"
        />
        
        {/* Location Pin */}
        {selectedLocation && (
          <div 
            className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
            style={{ left: `${mapPosition.x}%`, top: `${mapPosition.y}%` }}
          >
            <MapPin className="w-6 h-6 text-red-500 drop-shadow-lg" />
          </div>
        )}
        
        {/* Instruction overlay */}
        {!selectedLocation && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/90 px-4 py-2 rounded-lg shadow-md text-center">
              <p className="text-sm text-gray-600">Click on the map or search for a city</p>
            </div>
          </div>
        )}
      </div>
      
      {selectedLocation && (
        <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Selected Location:</p>
          <p className="text-gray-800">{selectedLocation.city}</p>
          <p className="text-xs text-gray-500">
            {selectedLocation.lat.toFixed(4)}°, {selectedLocation.lng.toFixed(4)}°
          </p>
        </div>
      )}
    </Card>
  );
}