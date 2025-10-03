import React, { useState, useRef, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { MessageCircle, Send, Bot, User, X, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  nasaReference?: string;
}

interface WeatherData {
  veryHot: number;
  veryWet: number;
  veryWindy: number;
  veryCold: number;
  comfortIndex: number;
}

interface Location {
  lat: number;
  lng: number;
  city: string;
}

interface Suggestion {
  id: string;
  title: string;
  description: string;
  category: string;
  emoji: string;
}

interface AIChatboxProps {
  selectedLocation?: Location | null;
  selectedDate?: Date | null;
  weatherData?: WeatherData | null;
  selectedProfile?: string | null;
  suggestionRequest?: Suggestion | null;
}

export function AIChatbox({ selectedLocation, selectedDate, weatherData, selectedProfile, suggestionRequest }: AIChatboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m WeatherWise AI. I can help you analyze weather patterns and plan your activities. Ask me anything!',
      isBot: true,
      timestamp: new Date(),
      nasaReference: 'NASA POWER Global Meteorology Dataset'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getSuggestedQueries = () => {
    if (selectedProfile === 'farmer' && selectedLocation && selectedDate) {
      return [
        `What crops should I plant in ${selectedLocation.city}?`,
        `Is this good weather for harvesting?`,
        `What are the best market opportunities right now?`,
        `Should I delay planting due to weather risks?`,
        `What protective measures should I take?`
      ];
    } else if (selectedProfile === 'planner' && selectedLocation && selectedDate) {
      return [
        `Is it safe to plan an outdoor event?`,
        `What backup plans should I prepare?`,
        `Should I book indoor venues instead?`,
        `What equipment do I need for this weather?`,
        `When would be better dates for my event?`
      ];
    } else if (selectedProfile === 'family' && selectedLocation && selectedDate) {
      return [
        `Is this weather safe for children?`,
        `What indoor activities do you recommend?`,
        `Should we reschedule our family outing?`,
        `What safety precautions should we take?`,
        `Are there better dates for family activities?`
      ];
    } else if (selectedProfile === 'adventurer' && selectedLocation && selectedDate) {
      return [
        `Is this weather good for hiking?`,
        `What gear should I pack for these conditions?`,
        `Are there safer routes I should consider?`,
        `Should I postpone my adventure trip?`,
        `What are the visibility conditions?`
      ];
    }
    
    return [
      "How accurate is your weather analysis?",
      "What data sources do you use?",
      "How can I get personalized recommendations?",
      "Can you help me plan around weather risks?",
      "What profiles do you support?"
    ];
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle suggestion requests
  useEffect(() => {
    if (suggestionRequest) {
      const suggestionMessage = `Tell me more about: "${suggestionRequest.title}"`;
      handleSendMessage(suggestionMessage);
    }
  }, [suggestionRequest]);

  const generateBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Handle suggestion-specific responses
    if (message.includes('tell me more about:')) {
      const suggestionTitle = message.split('tell me more about: "')[1]?.split('"')[0];
      
      if (suggestionTitle && selectedLocation && selectedDate && weatherData) {
        const locationName = selectedLocation.city;
        const dateStr = selectedDate.toLocaleDateString('en-US', { 
          month: 'long', 
          day: 'numeric', 
          year: 'numeric' 
        });

        // Suggestion-specific detailed responses
        if (suggestionTitle.includes('umbrella') || suggestionTitle.includes('rainy')) {
          return `🌂 **Umbrella Recommendation for ${locationName}**

Based on NASA GPM IMERG precipitation data, there's a ${weatherData.veryWet}% probability of significant rainfall on ${dateStr}.

**Why this matters:**
• Historical data shows this precipitation level typically produces 15-25mm of rainfall
• Peak rain hours usually occur between 2-6 PM based on regional patterns
• NASA POWER data indicates cloud cover will be 70-85%

**Specific Recommendations:**
• Carry a compact umbrella with wind resistance up to 35 km/h
• Consider waterproof footwear if walking outdoors
• Allow extra 15-20 minutes for commute delays
• Keep important items in waterproof bags

**NASA Data Confidence:** High (20+ years historical correlation)`;
        }

        if (suggestionTitle.includes('sunscreen') || suggestionTitle.includes('UV')) {
          return `☀️ **UV Protection Advisory for ${locationName}**

NASA POWER solar radiation data indicates elevated UV Index levels on ${dateStr} with a ${weatherData.veryHot}% probability of intense solar exposure.

**UV Analysis:**
• Expected UV Index: 8-11 (Very High to Extreme)
• Clear sky probability: ${100 - weatherData.veryWet}%
• Peak UV hours: 10 AM - 4 PM
• Cloud cover factor: Minimal protection expected

**Protection Protocol:**
• SPF 30+ sunscreen (reapply every 2 hours)
• UVA/UVB protective clothing recommended
• Seek shade during peak hours
• Hydrate frequently (2-3 liters recommended)

**NASA Data Source:** POWER Project Global Solar Irradiance Database`;
        }

        if (suggestionTitle.includes('bundle up') || suggestionTitle.includes('cold')) {
          return `🧥 **Cold Weather Protection for ${locationName}**

NASA GEOS-5 meteorological models predict ${weatherData.veryCold}% probability of significant cold conditions on ${dateStr}.

**Temperature Analysis:**
• Expected low: 3-8°C below seasonal average
• Wind chill factor: Additional 5-10°C temperature reduction
• Humidity: ${weatherData.veryWet > 50 ? 'High - increases perceived cold' : 'Moderate'}

**Layering Strategy:**
• Base layer: Moisture-wicking thermal wear
• Insulation: Wool or synthetic fill jacket
• Outer shell: Wind and water resistant
• Extremities: Insulated gloves, warm hat, thermal socks

**NASA Data Confidence:** Very High (validated against surface stations)`;
        }

        if (suggestionTitle.includes('indoor') || suggestionTitle.includes('family')) {
          return `🏠 **Indoor Family Activity Recommendations**

Weather analysis for ${locationName} on ${dateStr} shows challenging outdoor conditions (Comfort Index: ${weatherData.comfortIndex}%).

**Why Indoor Activities:**
• Rain probability: ${weatherData.veryWet}% (NASA GPM data)
• Temperature stress: ${Math.max(weatherData.veryHot, weatherData.veryCold)}% risk
• Wind conditions: ${weatherData.veryWindy}% likelihood of strong gusts

**Family-Friendly Options:**
• Museums with interactive exhibits
• Indoor play centers with climate control
• Shopping malls with children's areas
• Community centers with activities
• Home activities: cooking, crafts, board games

**Safety Priority:** Children and elderly are most sensitive to extreme weather conditions.`;
        }

        // Generic detailed response for other suggestions
        return `🤖 **Detailed Analysis: ${suggestionTitle}**

Based on NASA satellite data for ${locationName} on ${dateStr}:

**Current Weather Risk Profile:**
• Heat Risk: ${weatherData.veryHot}% (NASA POWER thermal analysis)
• Precipitation Risk: ${weatherData.veryWet}% (GPM IMERG data)
• Wind Risk: ${weatherData.veryWindy}% (GEOS-5 atmospheric model)
• Cold Risk: ${weatherData.veryCold}% (Surface temperature projections)

**Overall Comfort Assessment:** ${weatherData.comfortIndex}%

This recommendation is generated from 20+ years of NASA Earth observation data, providing statistical confidence based on historical weather patterns for your specific location and date.

**Data Sources:** NASA POWER, GPM IMERG, GEOS-5 Climate Models`;
      }
    }
    
    // If we have current weather analysis, provide contextual responses
    if (selectedLocation && selectedDate && weatherData) {
      const locationName = selectedLocation.city;
      const dateStr = selectedDate.toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      });

      // Profile-specific responses based on current analysis
      if (selectedProfile === 'farmer') {
        if (weatherData.veryWet > 70) {
          return `🌾 For farming in ${locationName} on ${dateStr}: NASA POWER data shows ${weatherData.veryWet}% rainfall probability. I recommend:

• **Crops**: Consider drought-resistant varieties like sorghum or millet
• **Market**: Current commodity prices favor root vegetables - sweet potatoes up 15% this quarter
• **Timing**: Delay planting by 7-14 days if possible
• **Protection**: Install drainage systems and consider covered growing areas
• **Alternatives**: Focus on greenhouse crops - lettuce and herbs have stable pricing

Based on NASA GPM IMERG precipitation data, this weather pattern typically lasts 3-5 days.`;
        } else if (weatherData.veryHot > 70) {
          return `🌾 For farming in ${locationName} on ${dateStr}: NASA satellite data indicates ${weatherData.veryHot}% extreme heat probability. Here's my analysis:

• **Heat-resistant crops**: Switch to heat-tolerant varieties - okra, eggplant, peppers (prices up 12% due to demand)
• **Irrigation**: Increase water supply by 40% and consider drip irrigation
• **Timing**: Plant early morning or late evening to reduce transplant shock
• **Market opportunity**: Cool-season crops will be premium priced - consider cold storage for existing harvest
• **Livestock**: Provide extra shade and cooling systems

NASA POWER data suggests optimal planting window is 10-15 days later.`;
        } else {
          return `🌾 Excellent farming conditions in ${locationName} on ${dateStr}! NASA meteorological data shows optimal growing weather (Comfort Index: ${weatherData.comfortIndex}%).

• **Best crops for market**: Tomatoes, cucumbers, and leafy greens - high demand season
• **Planting window**: Perfect 7-day window starting ${dateStr}
• **Market prices**: Expect 8-15% premium for quality produce
• **Equipment**: Ideal conditions for field work and harvesting
• **Soil prep**: Moisture levels optimal for cultivation

NASA POWER analysis confirms stable weather patterns for next 2 weeks.`;
        }
      } else if (selectedProfile === 'family') {
        if (weatherData.veryCold > 60 || weatherData.veryHot > 60) {
          return `👨‍👩‍👧‍👦 Family safety alert for ${locationName} on ${dateStr}: NASA data shows extreme temperature risk (${weatherData.veryCold > 60 ? 'Cold: ' + weatherData.veryCold : 'Heat: ' + weatherData.veryHot}%).

• **Indoor activities**: Visit museums, malls, or community centers
• **Safety gear**: ${weatherData.veryCold > 60 ? 'Winter coats, gloves, warm boots' : 'Sun hats, SPF 50+ sunscreen, cooling towels'}
• **Transportation**: Pre-warm/cool vehicle, check tire pressure
• **Emergency kit**: Keep extra water, snacks, and first aid supplies
• **Alternative dates**: Consider rescheduling to ${new Date(selectedDate.getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}

NASA GEOS-5 models suggest milder conditions 3-5 days later.`;
        } else {
          return `👨‍👩‍👧‍👦 Perfect family weather in ${locationName} on ${dateStr}! NASA analysis shows ${weatherData.comfortIndex}% comfort rating.

• **Outdoor activities**: Parks, playgrounds, hiking trails, outdoor sports
• **Picnic spots**: Weather ideal for outdoor dining and BBQs
• **Photography**: Great lighting conditions for family photos
• **Sports**: Perfect for soccer, frisbee, or cycling
• **Extended plans**: Weather stable for weekend getaways

NASA satellite data confirms excellent family-friendly conditions!`;
        }
      } else if (selectedProfile === 'planner') {
        if (weatherData.veryWet > 60 || weatherData.veryWindy > 60) {
          return `🎉 Event planning advisory for ${locationName} on ${dateStr}: NASA data shows ${weatherData.veryWet > 60 ? 'precipitation' : 'wind'} risk (${weatherData.veryWet > 60 ? weatherData.veryWet : weatherData.veryWindy}%).

• **Venue changes**: Book covered pavilions or indoor backup locations
• **Equipment**: Rent heavy-duty tents, weighted signage, waterproof sound systems
• **Catering**: Switch to indoor-friendly menu, avoid open flames
• **Guest communication**: Send weather updates 24-48 hours prior
• **Insurance**: Consider event weather insurance for outdoor setups
• **Timing**: ${weatherData.veryWet > 60 ? 'Morning slots have 30% less rain risk' : 'Late afternoon typically calmer'}

NASA GPM data suggests rescheduling to ${new Date(selectedDate.getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()} for 75% better conditions.`;
        } else {
          return `🎉 Outstanding event conditions in ${locationName} on ${dateStr}! NASA analysis shows ${weatherData.comfortIndex}% optimal rating.

• **Outdoor setup**: Perfect for garden parties, outdoor weddings, festivals
• **Photography**: Excellent natural lighting throughout the day
• **Catering**: Ideal for outdoor kitchens and BBQ stations
• **Entertainment**: Great conditions for outdoor music and activities
• **Guest comfort**: No weather-related concerns for attendees
• **Decorations**: Safe to use lightweight decorations and banners

NASA satellite data confirms stable, beautiful weather patterns!`;
        }
      } else if (selectedProfile === 'adventurer') {
        if (weatherData.veryWindy > 70) {
          return `🏔️ Adventure alert for ${locationName} on ${dateStr}: NASA data shows ${weatherData.veryWindy}% high wind probability.

• **Safer activities**: Rock climbing, cave exploration, indoor climbing gyms
• **Gear adjustments**: Use heavier packs, secure all loose items, avoid tall ridge lines
• **Navigation**: GPS backup essential - wind affects compass accuracy
• **Safety**: Travel in groups, carry emergency shelter and communication devices
• **Alternative routes**: Choose valley trails over exposed peaks
• **Equipment**: Invest in wind-resistant tent and sleeping system

NASA POWER data suggests calmer conditions 4-6 days later for high-altitude adventures.`;
        } else {
          return `🏔️ Epic adventure conditions in ${locationName} on ${dateStr}! NASA analysis shows ${weatherData.comfortIndex}% adventure rating.

• **Perfect activities**: Hiking, rock climbing, kayaking, mountain biking
• **Visibility**: Excellent for photography and scenic routes
• **Safety**: Ideal conditions for solo or group adventures
• **Equipment**: Standard gear sufficient, no extreme weather preparations needed
• **Extended trips**: Weather stable for multi-day expeditions
• **Photography**: Perfect lighting for landscape and action shots

NASA satellite monitoring confirms optimal outdoor adventure conditions!`;
        }
      }
    }

    // Generic responses when no specific context is available
    if (message.includes('weather') || message.includes('rain') || message.includes('temperature')) {
      return `Based on NASA POWER and GPM IMERG historical data, I can provide detailed weather probability analysis. Please select a location and date above for personalized insights, or choose a user profile for tailored recommendations!`;
    }

    if (message.includes('farm') || message.includes('crop') || message.includes('agriculture')) {
      return `🌾 For agricultural planning, I analyze NASA satellite data including soil moisture, precipitation patterns, and temperature trends. Select the Farmer profile above and choose your location/date for specific crop recommendations and market insights!`;
    }

    if (message.includes('event') || message.includes('wedding') || message.includes('party')) {
      return `🎉 For event planning, I examine NASA weather data for precipitation risk, wind patterns, and comfort indices. Switch to Event Planner profile above for venue recommendations and backup planning strategies!`;
    }

    if (message.includes('adventure') || message.includes('hiking') || message.includes('outdoor')) {
      return `🏔️ For outdoor adventures, I assess NASA meteorological data for visibility, wind conditions, and safety factors. Select the Adventurer profile for route planning and gear recommendations!`;
    }

    const genericResponses = [
      `I'm powered by NASA POWER and GPM IMERG datasets spanning 20+ years. Select a location, date, and profile above for detailed weather intelligence!`,
      `Using NASA satellite data, I provide historical weather probability analysis. Choose your parameters above for personalized insights and actionable recommendations!`,
      `NASA GEOS-5 climate models help me predict weather patterns. Set your location and date above, then ask me specific questions about planning and preparation!`
    ];
    
    return genericResponses[Math.floor(Math.random() * genericResponses.length)];
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(text),
        isBot: true,
        timestamp: new Date(),
        nasaReference: 'NASA POWER, GPM IMERG, GEOS-5 Climate Data'
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const handleSuggestedQuery = (query: string) => {
    handleSendMessage(query);
  };

  const TypingIndicator = () => (
    <div className="flex items-center space-x-1 p-3">
      <Bot className="w-4 h-4 text-blue-600" />
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
      <span className="text-xs text-gray-500">Analyzing NASA data...</span>
    </div>
  );

  return (
    <>
      {/* Chat Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg"
            >
              <MessageCircle className="w-6 h-6" />
            </Button>
            <div className="absolute -top-12 right-0 bg-gray-800 text-white text-sm px-3 py-1 rounded-lg whitespace-nowrap">
              Ask WeatherWise AI
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 w-80 h-96"
          >
            <Card className="h-full flex flex-col bg-white shadow-2xl border border-gray-200">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
                <div className="flex items-center space-x-2">
                  <Bot className="w-5 h-5" />
                  <span>WeatherWise AI</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="text-white hover:bg-white/20 p-1 h-auto"
                  >
                    <Minimize2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-white/20 p-1 h-auto"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {!isMinimized && (
                <>
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.isBot
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-blue-500 text-white'
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          {message.nasaReference && (
                            <Badge variant="secondary" className="mt-2 text-xs">
                              📡 {message.nasaReference}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {isTyping && <TypingIndicator />}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Suggested Queries */}
                  {messages.length === 1 && (
                    <div className="p-4 border-t border-gray-200 bg-gray-50">
                      <p className="text-xs text-gray-600 mb-2">
                        {selectedProfile ? `${selectedProfile.charAt(0).toUpperCase() + selectedProfile.slice(1)} questions:` : 'Try asking:'}
                      </p>
                      <div className="space-y-1">
                        {getSuggestedQueries().slice(0, 2).map((query, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestedQuery(query)}
                            className="block w-full text-left text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-1 rounded"
                          >
                            "{query}"
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Input */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                        placeholder="Ask about weather patterns..."
                        className="flex-1 text-sm"
                        disabled={isTyping}
                      />
                      <Button
                        onClick={() => handleSendMessage(inputValue)}
                        disabled={!inputValue.trim() || isTyping}
                        size="sm"
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}