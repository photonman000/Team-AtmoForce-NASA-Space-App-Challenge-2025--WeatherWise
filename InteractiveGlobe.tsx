import React, { useState, useRef, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { MapPin, Navigation, Search, X, RotateCcw, ZoomIn, ZoomOut, Globe } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface InteractiveGlobeProps {
  onLocationSelect: (location: { lat: number; lng: number; city: string }) => void;
  selectedLocation: { lat: number; lng: number; city: string } | null;
}

export function InteractiveGlobe({ onLocationSelect, selectedLocation }: InteractiveGlobeProps) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ lat: number; lng: number; city: string }>>([]);
  const [showResults, setShowResults] = useState(false);
  const globeRef = useRef<HTMLDivElement>(null);

  // Comprehensive location database with precise coordinates
  const locationDatabase = [
    // Major World Cities
    { lat: 40.7128, lng: -74.0060, city: 'New York, USA' },
    { lat: 34.0522, lng: -118.2437, city: 'Los Angeles, USA' },
    { lat: 41.8781, lng: -87.6298, city: 'Chicago, USA' },
    { lat: 29.7604, lng: -95.3698, city: 'Houston, USA' },
    { lat: 25.7617, lng: -80.1918, city: 'Miami, USA' },
    { lat: 37.7749, lng: -122.4194, city: 'San Francisco, USA' },
    { lat: 47.6062, lng: -122.3321, city: 'Seattle, USA' },
    { lat: 39.7392, lng: -104.9903, city: 'Denver, USA' },
    { lat: 45.5017, lng: -73.5673, city: 'Montreal, Canada' },
    { lat: 43.6532, lng: -79.3832, city: 'Toronto, Canada' },
    { lat: 49.2827, lng: -123.1207, city: 'Vancouver, Canada' },
    { lat: 19.4326, lng: -99.1332, city: 'Mexico City, Mexico' },
    
    // Europe
    { lat: 51.5074, lng: -0.1278, city: 'London, UK' },
    { lat: 48.8566, lng: 2.3522, city: 'Paris, France' },
    { lat: 52.5200, lng: 13.4050, city: 'Berlin, Germany' },
    { lat: 41.9028, lng: 12.4964, city: 'Rome, Italy' },
    { lat: 40.4168, lng: -3.7038, city: 'Madrid, Spain' },
    { lat: 52.3676, lng: 4.9041, city: 'Amsterdam, Netherlands' },
    { lat: 59.9139, lng: 10.7522, city: 'Oslo, Norway' },
    { lat: 55.7558, lng: 37.6176, city: 'Moscow, Russia' },
    { lat: 50.0755, lng: 14.4378, city: 'Prague, Czech Republic' },
    { lat: 47.4979, lng: 19.0402, city: 'Budapest, Hungary' },
    { lat: 59.3293, lng: 18.0686, city: 'Stockholm, Sweden' },
    { lat: 55.6761, lng: 12.5683, city: 'Copenhagen, Denmark' },
    
    // Asia
    { lat: 35.6762, lng: 139.6503, city: 'Tokyo, Japan' },
    { lat: 39.9042, lng: 116.4074, city: 'Beijing, China' },
    { lat: 31.2304, lng: 121.4737, city: 'Shanghai, China' },
    { lat: 22.3193, lng: 114.1694, city: 'Hong Kong' },
    { lat: 28.6139, lng: 77.2090, city: 'New Delhi, India' },
    { lat: 19.0760, lng: 72.8777, city: 'Mumbai, India' },
    { lat: 1.3521, lng: 103.8198, city: 'Singapore' },
    { lat: 37.5665, lng: 126.9780, city: 'Seoul, South Korea' },
    { lat: 13.7563, lng: 100.5018, city: 'Bangkok, Thailand' },
    { lat: 21.0285, lng: 105.8542, city: 'Hanoi, Vietnam' },
    { lat: 14.5995, lng: 120.9842, city: 'Manila, Philippines' },
    { lat: -6.2088, lng: 106.8456, city: 'Jakarta, Indonesia' },
    { lat: 3.1390, lng: 101.6869, city: 'Kuala Lumpur, Malaysia' },
    
    // Oceania
    { lat: -33.8688, lng: 151.2093, city: 'Sydney, Australia' },
    { lat: -37.8136, lng: 144.9631, city: 'Melbourne, Australia' },
    { lat: -27.4698, lng: 153.0251, city: 'Brisbane, Australia' },
    { lat: -31.9505, lng: 115.8605, city: 'Perth, Australia' },
    { lat: -36.8485, lng: 174.7633, city: 'Auckland, New Zealand' },
    { lat: -41.2865, lng: 174.7762, city: 'Wellington, New Zealand' },
    
    // Africa
    { lat: -26.2041, lng: 28.0473, city: 'Johannesburg, South Africa' },
    { lat: 30.0444, lng: 31.2357, city: 'Cairo, Egypt' },
    { lat: -33.9249, lng: 18.4241, city: 'Cape Town, South Africa' },
    { lat: 6.5244, lng: 3.3792, city: 'Lagos, Nigeria' },
    { lat: -1.2921, lng: 36.8219, city: 'Nairobi, Kenya' },
    { lat: 33.9716, lng: -6.8498, city: 'Rabat, Morocco' },
    
    // South America
    { lat: -23.5505, lng: -46.6333, city: 'São Paulo, Brazil' },
    { lat: -22.9068, lng: -43.1729, city: 'Rio de Janeiro, Brazil' },
    { lat: -15.7942, lng: -47.8822, city: 'Brasília, Brazil' },
    { lat: -34.6037, lng: -58.3816, city: 'Buenos Aires, Argentina' },
    { lat: -12.0464, lng: -77.0428, city: 'Lima, Peru' },
    { lat: -33.4489, lng: -70.6693, city: 'Santiago, Chile' },
    { lat: 4.7110, lng: -74.0721, city: 'Bogotá, Colombia' },
    { lat: 10.4806, lng: -66.9036, city: 'Caracas, Venezuela' },
    
    // Middle East
    { lat: 25.2048, lng: 55.2708, city: 'Dubai, UAE' },
    { lat: 24.7136, lng: 46.6753, city: 'Riyadh, Saudi Arabia' },
    { lat: 29.3117, lng: 47.4818, city: 'Kuwait City, Kuwait' },
    { lat: 33.3152, lng: 44.3661, city: 'Baghdad, Iraq' },
    { lat: 35.6892, lng: 51.3890, city: 'Tehran, Iran' },
    { lat: 31.7683, lng: 35.2137, city: 'Jerusalem, Israel' },
  ];

  // Convert lat/lng to screen coordinates with rotation and zoom
  const projectToScreen = (lat: number, lng: number, width: number, height: number) => {
    // Apply rotation to longitude
    const adjustedLng = lng - rotation.y;
    
    // Normalize coordinates
    const x = ((adjustedLng + 180) % 360 - 180) / 360;
    const y = (lat + 90) / 180;
    
    // Apply zoom and center
    const centerX = width / 2;
    const centerY = height / 2;
    
    const screenX = centerX + (x * width * zoom);
    const screenY = centerY - ((y - 0.5) * height * zoom);
    
    return { x: screenX, y: screenY };
  };

  // Convert screen coordinates to lat/lng with rotation and zoom
  const screenToLatLng = (x: number, y: number, width: number, height: number) => {
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Reverse zoom and centering
    const normalizedX = (x - centerX) / (width * zoom);
    const normalizedY = (centerY - y) / (height * zoom);
    
    // Convert to lat/lng
    const lng = (normalizedX * 360 + rotation.y + 180) % 360 - 180;
    const lat = Math.max(-85, Math.min(85, (normalizedY + 0.5) * 180 - 90));
    
    return { lat, lng };
  };

  // Find nearest location to coordinates
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

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && globeRef.current) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      setRotation(prev => ({
        x: Math.max(-90, Math.min(90, prev.x + deltaY * 0.5)),
        y: prev.y + deltaX * 0.5
      }));
      
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleGlobeClick = (e: React.MouseEvent) => {
    if (isDragging) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const coords = screenToLatLng(x, y, rect.width, rect.height);
    const nearestLocation = findNearestLocation(coords.lat, coords.lng);
    
    onLocationSelect({
      lat: nearestLocation.lat,
      lng: nearestLocation.lng,
      city: nearestLocation.city
    });
  };

  // Search functionality
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
    onLocationSelect(location);
    setSearchQuery(location.city);
    setShowResults(false);
    setSearchResults([]);
    
    // Rotate globe to show selected location
    setRotation({ x: -location.lat * 0.5, y: -location.lng * 0.3 });
  };

  const clearSearch = () => {
    setSearchQuery('');
    setShowResults(false);
    setSearchResults([]);
  };

  // Zoom controls
  const handleZoomIn = () => {
    setZoom(prev => Math.min(3, prev + 0.3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(0.5, prev - 0.3));
  };

  const resetView = () => {
    setRotation({ x: 0, y: 0 });
    setZoom(1);
  };

  // GPS location
  const handleUseGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const nearestLocation = findNearestLocation(latitude, longitude);
          onLocationSelect({
            lat: nearestLocation.lat,
            lng: nearestLocation.lng,
            city: `${nearestLocation.city} (Near your location)`
          });
          setRotation({ x: -latitude * 0.5, y: -longitude * 0.3 });
        },
        () => {
          const fallback = { lat: 37.7749, lng: -122.4194, city: 'San Francisco, USA (Default)' };
          onLocationSelect(fallback);
          setRotation({ x: -fallback.lat * 0.5, y: -fallback.lng * 0.3 });
        }
      );
    }
  };

  // Touch events for mobile
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging && globeRef.current) {
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;
        
        setRotation(prev => ({
          x: Math.max(-90, Math.min(90, prev.x + deltaY * 0.5)),
          y: prev.y + deltaX * 0.5
        }));
        
        setDragStart({ x: e.clientX, y: e.clientY });
      }
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, dragStart]);

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-green-50 border-0 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg text-gray-800 flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-600" />
          Interactive Globe
        </h3>
        <div className="flex items-center gap-2">
          <Button 
            onClick={handleUseGPS}
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            <Navigation className="w-4 h-4" />
            GPS
          </Button>
        </div>
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

      {/* Globe Controls */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Button
            onClick={handleZoomIn}
            variant="outline"
            size="sm"
            className="p-2"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            onClick={handleZoomOut}
            variant="outline"
            size="sm"
            className="p-2"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button
            onClick={resetView}
            variant="outline"
            size="sm"
            className="p-2"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
        <div className="text-xs text-gray-500">
          Drag to rotate • Click to select • Scroll to zoom
        </div>
      </div>
      
      {/* Interactive Globe */}
      <div 
        ref={globeRef}
        className="relative h-80 rounded-lg overflow-hidden cursor-grab active:cursor-grabbing bg-gradient-to-br from-blue-200 to-green-200 select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={handleGlobeClick}
        style={{
          transform: `perspective(1000px) rotateX(${rotation.x}deg)`,
          transformStyle: 'preserve-3d'
        }}
      >
        <div 
          className="absolute inset-0 transition-transform duration-200"
          style={{
            transform: `scale(${zoom}) rotateY(${rotation.y}deg)`,
            transformOrigin: 'center center'
          }}
        >
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlYXJ0aCUyMGZyb20lMjBzcGFjZSUyMGdsb2JlJTIwbWFwfGVufDF8fHx8MTc1ODkxMjE4M3ww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Earth Globe"
            className="w-full h-full object-cover opacity-80 rounded-lg"
          />
          
          {/* Grid overlay for better rotation perception */}
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full">
              {/* Longitude lines */}
              {Array.from({ length: 18 }, (_, i) => (
                <line
                  key={`lng-${i}`}
                  x1={`${(i / 18) * 100}%`}
                  y1="0%"
                  x2={`${(i / 18) * 100}%`}
                  y2="100%"
                  stroke="white"
                  strokeWidth="0.5"
                />
              ))}
              {/* Latitude lines */}
              {Array.from({ length: 9 }, (_, i) => (
                <line
                  key={`lat-${i}`}
                  x1="0%"
                  y1={`${(i / 9) * 100}%`}
                  x2="100%"
                  y2={`${(i / 9) * 100}%`}
                  stroke="white"
                  strokeWidth="0.5"
                />
              ))}
            </svg>
          </div>
        </div>
        
        {/* Location Pins */}
        {selectedLocation && (
          <div className="absolute inset-0 pointer-events-none">
            {(() => {
              const rect = globeRef.current?.getBoundingClientRect();
              if (!rect) return null;
              
              const screenPos = projectToScreen(
                selectedLocation.lat, 
                selectedLocation.lng, 
                rect.width, 
                rect.height
              );
              
              // Only show pin if it's visible on the current view
              if (screenPos.x > 0 && screenPos.x < rect.width && screenPos.y > 0 && screenPos.y < rect.height) {
                return (
                  <div 
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 z-10"
                    style={{ 
                      left: screenPos.x, 
                      top: screenPos.y,
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                    }}
                  >
                    <MapPin className="w-6 h-6 text-red-500 animate-bounce" />
                  </div>
                );
              }
              return null;
            })()}
          </div>
        )}
        
        {/* Instructions overlay */}
        {!selectedLocation && !isDragging && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-white/90 px-4 py-2 rounded-lg shadow-md text-center max-w-xs">
              <p className="text-sm text-gray-600">
                🌍 Drag to rotate the globe<br />
                🔍 Search or click to select a location<br />
                🔎 Use zoom controls for precision
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Location Info */}
      {selectedLocation && (
        <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Selected Location:</p>
              <p className="text-gray-800">{selectedLocation.city}</p>
              <p className="text-xs text-gray-500">
                {selectedLocation.lat.toFixed(4)}°, {selectedLocation.lng.toFixed(4)}°
              </p>
            </div>
            <div className="text-xs text-gray-500 text-right">
              <p>Zoom: {(zoom * 100).toFixed(0)}%</p>
              <p>Rotation: {rotation.y.toFixed(0)}°</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}