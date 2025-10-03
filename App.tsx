import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { InteractiveGlobe } from './components/InteractiveGlobe';
import { DateSelector } from './components/DateSelector';
import { WeatherGauges } from './components/WeatherGauges';
import { RiskCalendar } from './components/RiskCalendar';
import { AIChatbox } from './components/AIChatbox';
import { UserProfileToggle } from './components/UserProfileToggle';
import { WeatherDiary } from './components/WeatherDiary';
import { ProfileInsights } from './components/ProfileInsights';
import { DownloadReport } from './components/DownloadReport';
import { SmartSuggestions } from './components/SmartSuggestions';

interface Location {
  lat: number;
  lng: number;
  city: string;
}

interface WeatherData {
  veryHot: number;
  veryWet: number;
  veryWindy: number;
  veryCold: number;
  comfortIndex: number;
}

export default function App() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionsTrigger, setSuggestionsTrigger] = useState<'calendar' | 'dateSelector' | 'auto'>('auto');
  const [aiSuggestionRequest, setAiSuggestionRequest] = useState<any>(null);

  // Mock weather data generation with profile adjustments
  const generateWeatherData = (location: Location, date: Date, profile: string | null): WeatherData => {
    // Simulate different weather patterns based on location and date
    const month = date.getMonth();
    const lat = Math.abs(location.lat);
    
    // Mock seasonal and geographical variations
    const seasonalModifier = Math.sin((month / 12) * 2 * Math.PI);
    const latitudeModifier = lat / 90;
    
    let veryHot = Math.max(0, Math.min(100, 
      30 + seasonalModifier * 40 + (90 - lat) * 0.5 + Math.random() * 20
    ));
    
    let veryWet = Math.max(0, Math.min(100, 
      25 + Math.sin((month + 3) / 12 * 2 * Math.PI) * 30 + Math.random() * 25
    ));
    
    let veryWindy = Math.max(0, Math.min(100, 
      20 + latitudeModifier * 30 + Math.random() * 20
    ));
    
    let veryCold = Math.max(0, Math.min(100, 
      10 + (1 - seasonalModifier) * 35 + latitudeModifier * 25 + Math.random() * 15
    ));

    // Profile-based adjustments to emphasize different priorities
    if (profile) {
      switch (profile) {
        case 'family':
          // Family prioritizes safety and comfort - emphasize extreme conditions as risks
          veryHot *= 1.2;
          veryCold *= 1.2;
          veryWindy *= 1.1;
          break;
        case 'farmer':
          // Farmers care most about precipitation and temperature for crops
          veryWet *= 1.3;
          veryHot *= 1.1;
          veryCold *= 1.1;
          break;
        case 'planner':
          // Event planners need clear skies and low wind
          veryWet *= 1.4;
          veryWindy *= 1.3;
          break;
        case 'adventurer':
          // Adventurers are more tolerant but care about wind and visibility
          veryWindy *= 1.2;
          veryWet *= 1.1;
          veryHot *= 0.9;
          veryCold *= 0.9;
          break;
      }
    }

    // Ensure values stay within bounds
    veryHot = Math.max(0, Math.min(100, veryHot));
    veryWet = Math.max(0, Math.min(100, veryWet));
    veryWindy = Math.max(0, Math.min(100, veryWindy));
    veryCold = Math.max(0, Math.min(100, veryCold));
    
    // Calculate comfort index based on profile priorities
    let comfortWeights = { hot: 0.3, wet: 0.2, windy: 0.2, cold: 0.3 };
    
    if (profile === 'family') {
      comfortWeights = { hot: 0.4, wet: 0.2, windy: 0.2, cold: 0.4 }; // More sensitive to temperature
    } else if (profile === 'farmer') {
      comfortWeights = { hot: 0.3, wet: 0.4, windy: 0.1, cold: 0.3 }; // Rain most important
    } else if (profile === 'planner') {
      comfortWeights = { hot: 0.2, wet: 0.4, windy: 0.3, cold: 0.2 }; // Rain and wind critical
    } else if (profile === 'adventurer') {
      comfortWeights = { hot: 0.2, wet: 0.3, windy: 0.3, cold: 0.2 }; // Balanced but wind-focused
    }
    
    const comfortIndex = Math.max(0, Math.min(100, 
      100 - (veryHot * comfortWeights.hot + veryWet * comfortWeights.wet + 
             veryWindy * comfortWeights.windy + veryCold * comfortWeights.cold)
    ));

    return {
      veryHot: Math.round(veryHot),
      veryWet: Math.round(veryWet),
      veryWindy: Math.round(veryWindy),
      veryCold: Math.round(veryCold),
      comfortIndex: Math.round(comfortIndex)
    };
  };

  // Generate weather data when location, date, or profile changes
  useEffect(() => {
    if (selectedLocation && selectedDate) {
      setIsLoading(true);
      setShowSuggestions(false);
      
      // Simulate API call delay
      setTimeout(() => {
        const data = generateWeatherData(selectedLocation, selectedDate, selectedProfile);
        setWeatherData(data);
        setIsLoading(false);
        // Show suggestions after weather data is loaded
        setTimeout(() => setShowSuggestions(true), 500);
      }, 1500);
    }
  }, [selectedLocation, selectedDate, selectedProfile]);

  // Handle date selection from DateSelector
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSuggestionsTrigger('dateSelector');
  };

  // Handle date selection from RiskCalendar
  const handleCalendarDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSuggestionsTrigger('calendar');
    setShowSuggestions(true);
  };

  // Handle AI suggestion requests
  const handleAISuggestionRequest = (suggestion: any) => {
    setAiSuggestionRequest(suggestion);
    // Clear the request after a short delay so it can be triggered again
    setTimeout(() => setAiSuggestionRequest(null), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl text-gray-900">Historical Weather Intelligence</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Plan with confidence using AI-powered weather analysis based on NASA satellite data. 
              Get historical probability insights for any location and date.
            </p>
          </div>

          {/* Input Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <div className="lg:col-span-2 xl:col-span-1">
              <InteractiveGlobe 
                onLocationSelect={setSelectedLocation}
                selectedLocation={selectedLocation}
              />
            </div>
            <DateSelector 
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
            />
            <UserProfileToggle 
              selectedProfile={selectedProfile}
              onProfileSelect={setSelectedProfile}
            />
          </div>

          {/* Results Section */}
          {(selectedLocation && selectedDate) && (
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-2xl text-gray-900 mb-2">
                  Weather Analysis Results
                  {selectedProfile && (
                    <span className="ml-2 text-lg text-blue-600">
                      ({selectedProfile === 'family' ? 'Family' : 
                        selectedProfile === 'farmer' ? 'Farmer' :
                        selectedProfile === 'planner' ? 'Event Planner' : 'Adventurer'} Profile)
                    </span>
                  )}
                </h3>
                <p className="text-gray-600">
                  Historical probability analysis for <span className="text-blue-600">{selectedLocation.city}</span> on{' '}
                  <span className="text-blue-600">{selectedDate.toLocaleDateString()}</span>
                  {selectedProfile && (
                    <span className="block mt-1 text-sm">
                      Customized for {selectedProfile === 'family' ? 'family-friendly activities' : 
                        selectedProfile === 'farmer' ? 'agricultural planning' :
                        selectedProfile === 'planner' ? 'event planning' : 'outdoor adventures'}
                    </span>
                  )}
                </p>
              </div>

              <WeatherGauges data={weatherData} isLoading={isLoading} />

              {/* Smart Lifestyle Suggestions */}
              {!isLoading && showSuggestions && (
                <SmartSuggestions
                  selectedLocation={selectedLocation}
                  selectedDate={selectedDate}
                  weatherData={weatherData}
                  selectedProfile={selectedProfile}
                  triggerSource={suggestionsTrigger}
                  onAskAI={handleAISuggestionRequest}
                  isVisible={showSuggestions}
                  onClose={() => setShowSuggestions(false)}
                />
              )}

              {/* Profile-specific insights */}
              {selectedProfile && weatherData && (
                <ProfileInsights 
                  profile={selectedProfile}
                  weatherData={weatherData}
                  location={selectedLocation.city}
                  date={selectedDate.toLocaleDateString()}
                />
              )}

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2">
                  <RiskCalendar 
                    month={selectedDate.getMonth()} 
                    year={selectedDate.getFullYear()}
                    selectedLocation={selectedLocation}
                    selectedProfile={selectedProfile}
                    onDateSelect={handleCalendarDateSelect}
                  />
                </div>
                <div className="space-y-6">
                  <WeatherDiary />
                  <DownloadReport 
                    selectedLocation={selectedLocation}
                    selectedDate={selectedDate}
                    weatherData={weatherData}
                    selectedProfile={selectedProfile}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Instructions for first-time users */}
          {(!selectedLocation || !selectedDate) && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl text-white">🌍</span>
                </div>
                <h3 className="text-xl text-gray-900">Get Started</h3>
                <p className="text-gray-600">
                  Select a location on the map, choose a date, and optionally pick a user profile to see personalized historical weather probability analysis.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* AI Chatbox */}
      <AIChatbox 
        selectedLocation={selectedLocation}
        selectedDate={selectedDate}
        weatherData={weatherData}
        selectedProfile={selectedProfile}
        suggestionRequest={aiSuggestionRequest}
      />
    </div>
  );
}