import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Umbrella, Sun, Wind, Thermometer, Shirt, Coffee, Bike, Car, 
  Home, AlertTriangle, CheckCircle, Info, X, MessageCircle,
  Droplets, Cloud, Snowflake, TreePine, Wheat, Calendar,
  Camera, Utensils, Baby, Heart, Zap, Shield
} from 'lucide-react';

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

interface Suggestion {
  id: string;
  icon: React.ComponentType<any>;
  emoji: string;
  title: string;
  description: string;
  category: 'clothing' | 'activity' | 'preparation' | 'warning' | 'opportunity';
  priority: 'high' | 'medium' | 'low';
  color: string;
  bgColor: string;
  actionable: boolean;
}

interface SmartSuggestionsProps {
  selectedLocation?: Location | null;
  selectedDate?: Date | null;
  weatherData?: WeatherData | null;
  selectedProfile?: string | null;
  triggerSource?: 'calendar' | 'dateSelector' | 'auto';
  onAskAI?: (suggestion: Suggestion) => void;
  isVisible?: boolean;
  onClose?: () => void;
}

export function SmartSuggestions({ 
  selectedLocation, 
  selectedDate, 
  weatherData, 
  selectedProfile,
  triggerSource = 'auto',
  onAskAI,
  isVisible = true,
  onClose
}: SmartSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showDetailed, setShowDetailed] = useState(false);

  const generateSuggestions = (): Suggestion[] => {
    if (!weatherData || !selectedDate || !selectedLocation) return [];

    const suggestions: Suggestion[] = [];
    const { veryHot, veryWet, veryWindy, veryCold, comfortIndex } = weatherData;
    const isToday = selectedDate.toDateString() === new Date().toDateString();
    const isTomorrow = selectedDate.toDateString() === new Date(Date.now() + 86400000).toDateString();

    // High precipitation suggestions
    if (veryWet > 60) {
      suggestions.push({
        id: 'umbrella',
        icon: Umbrella,
        emoji: '🌂',
        title: isToday ? 'Take an umbrella before going out' : 'Plan for rainy conditions',
        description: `${veryWet}% chance of precipitation expected`,
        category: 'preparation',
        priority: 'high',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50 border-blue-200',
        actionable: true
      });

      if (selectedProfile === 'family') {
        suggestions.push({
          id: 'indoor-activities',
          icon: Home,
          emoji: '🏠',
          title: 'Plan indoor family activities',
          description: 'Museums, malls, or indoor play areas recommended',
          category: 'activity',
          priority: 'medium',
          color: 'text-purple-600',
          bgColor: 'bg-purple-50 border-purple-200',
          actionable: true
        });
      } else if (selectedProfile === 'farmer') {
        suggestions.push({
          id: 'delay-irrigation',
          icon: Droplets,
          emoji: '💧',
          title: 'Delay irrigation systems',
          description: 'Natural rainfall expected - save water costs',
          category: 'opportunity',
          priority: 'high',
          color: 'text-green-600',
          bgColor: 'bg-green-50 border-green-200',
          actionable: true
        });
      } else if (selectedProfile === 'planner') {
        suggestions.push({
          id: 'venue-backup',
          icon: AlertTriangle,
          emoji: '⛺',
          title: 'Secure covered venue backup',
          description: 'High rain risk - confirm indoor alternatives',
          category: 'warning',
          priority: 'high',
          color: 'text-orange-600',
          bgColor: 'bg-orange-50 border-orange-200',
          actionable: true
        });
      }
    }

    // High temperature suggestions
    if (veryHot > 65) {
      suggestions.push({
        id: 'sunscreen',
        icon: Sun,
        emoji: '☀️',
        title: 'Use sunscreen and stay hydrated',
        description: 'Strong UV expected - SPF 30+ recommended',
        category: 'preparation',
        priority: 'high',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50 border-yellow-200',
        actionable: true
      });

      if (selectedProfile === 'family') {
        suggestions.push({
          id: 'heat-safety',
          icon: Baby,
          emoji: '👶',
          title: 'Extra care for children and elderly',
          description: 'Frequent water breaks and shade essential',
          category: 'warning',
          priority: 'high',
          color: 'text-red-600',
          bgColor: 'bg-red-50 border-red-200',
          actionable: true
        });
      } else if (selectedProfile === 'adventurer') {
        suggestions.push({
          id: 'early-start',
          icon: Zap,
          emoji: '⚡',
          title: 'Start outdoor activities early',
          description: 'Beat the heat - plan for dawn to 10 AM',
          category: 'activity',
          priority: 'medium',
          color: 'text-orange-600',
          bgColor: 'bg-orange-50 border-orange-200',
          actionable: true
        });
      }
    }

    // Cold weather suggestions
    if (veryCold > 50) {
      suggestions.push({
        id: 'bundle-up',
        icon: Snowflake,
        emoji: '🧥',
        title: 'Bundle up - cold winds likely',
        description: 'Layer clothing and protect extremities',
        category: 'clothing',
        priority: 'high',
        color: 'text-cyan-600',
        bgColor: 'bg-cyan-50 border-cyan-200',
        actionable: true
      });

      if (selectedProfile === 'farmer') {
        suggestions.push({
          id: 'protect-crops',
          icon: Shield,
          emoji: '🛡️',
          title: 'Protect sensitive crops',
          description: 'Cover plants or move to greenhouse',
          category: 'warning',
          priority: 'high',
          color: 'text-indigo-600',
          bgColor: 'bg-indigo-50 border-indigo-200',
          actionable: true
        });
      }
    }

    // Wind suggestions
    if (veryWindy > 55) {
      suggestions.push({
        id: 'secure-items',
        icon: Wind,
        emoji: '💨',
        title: 'Secure outdoor items',
        description: 'Strong winds expected - bring in loose objects',
        category: 'preparation',
        priority: 'medium',
        color: 'text-gray-600',
        bgColor: 'bg-gray-50 border-gray-200',
        actionable: true
      });

      if (selectedProfile === 'planner') {
        suggestions.push({
          id: 'avoid-decorations',
          icon: AlertTriangle,
          emoji: '🎈',
          title: 'Avoid lightweight decorations',
          description: 'Wind may damage balloons, banners, tents',
          category: 'warning',
          priority: 'high',
          color: 'text-red-600',
          bgColor: 'bg-red-50 border-red-200',
          actionable: true
        });
      }
    }

    // Good weather opportunities
    if (comfortIndex > 75) {
      if (selectedProfile === 'family') {
        suggestions.push({
          id: 'outdoor-fun',
          icon: Heart,
          emoji: '❤️',
          title: 'Perfect day for outdoor family time',
          description: 'Parks, picnics, and playground activities ideal',
          category: 'opportunity',
          priority: 'medium',
          color: 'text-green-600',
          bgColor: 'bg-green-50 border-green-200',
          actionable: true
        });
      } else if (selectedProfile === 'adventurer') {
        suggestions.push({
          id: 'adventure-time',
          icon: TreePine,
          emoji: '🏔️',
          title: 'Excellent conditions for hiking',
          description: 'Great visibility and comfortable temperatures',
          category: 'opportunity',
          priority: 'high',
          color: 'text-emerald-600',
          bgColor: 'bg-emerald-50 border-emerald-200',
          actionable: true
        });
      } else if (selectedProfile === 'planner') {
        suggestions.push({
          id: 'outdoor-event',
          icon: Calendar,
          emoji: '🎉',
          title: 'Ideal for outdoor events',
          description: 'Low weather risk - perfect for ceremonies',
          category: 'opportunity',
          priority: 'high',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50 border-blue-200',
          actionable: true
        });
      }

      suggestions.push({
        id: 'cycling-weather',
        icon: Bike,
        emoji: '🚴',
        title: 'Good day for cycling',
        description: 'Low rain risk and moderate wind conditions',
        category: 'activity',
        priority: 'low',
        color: 'text-green-600',
        bgColor: 'bg-green-50 border-green-200',
        actionable: true
      });
    }

    // Humidity-based suggestions
    if (veryWet > 40 && veryHot > 40) {
      suggestions.push({
        id: 'avoid-laundry',
        icon: Shirt,
        emoji: '👕',
        title: 'Avoid washing clothes tonight',
        description: 'High overnight humidity - slow drying expected',
        category: 'preparation',
        priority: 'low',
        color: 'text-purple-600',
        bgColor: 'bg-purple-50 border-purple-200',
        actionable: true
      });
    }

    // Photography suggestions for good conditions
    if (comfortIndex > 60 && veryWet < 30) {
      suggestions.push({
        id: 'photography',
        icon: Camera,
        emoji: '📸',
        title: 'Great lighting for photography',
        description: 'Clear skies and good visibility expected',
        category: 'opportunity',
        priority: 'low',
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-50 border-indigo-200',
        actionable: true
      });
    }

    // Sort by priority and limit to most relevant
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return suggestions
      .sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority])
      .slice(0, 6);
  };

  useEffect(() => {
    if (weatherData && selectedDate && selectedLocation) {
      const newSuggestions = generateSuggestions();
      setSuggestions(newSuggestions);
    }
  }, [weatherData, selectedDate, selectedLocation, selectedProfile]);

  const handleAskAI = (suggestion: Suggestion) => {
    if (onAskAI) {
      onAskAI(suggestion);
    }
  };

  const formatTriggerText = () => {
    if (triggerSource === 'calendar') return 'Smart suggestions based on selected date';
    if (triggerSource === 'dateSelector') return 'Recommendations for your chosen date';
    return 'Lifestyle suggestions for your weather analysis';
  };

  if (!isVisible || suggestions.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full"
      >
        <Card className="p-6 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 border-2 border-amber-200 shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-lg text-gray-800 font-medium">Smart Lifestyle Suggestions</h3>
                <p className="text-sm text-gray-600">{formatTriggerText()}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {selectedDate && (
                <Badge className="bg-amber-100 text-amber-800 border-amber-300">
                  {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </Badge>
              )}
              {onClose && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 p-1"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Suggestions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={suggestion.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="group"
              >
                <Card className={`p-4 ${suggestion.bgColor} border ${suggestion.priority === 'high' ? 'border-l-4 border-l-red-500' : ''} hover:shadow-md transition-all duration-200 transform hover:-translate-y-1`}>
                  <div className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 p-2 rounded-lg bg-white/50 ${suggestion.color}`}>
                      <suggestion.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-lg">{suggestion.emoji}</span>
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${
                            suggestion.priority === 'high' ? 'bg-red-100 text-red-800' :
                            suggestion.priority === 'medium' ? 'bg-orange-100 text-orange-800' :
                            'bg-green-100 text-green-800'
                          }`}
                        >
                          {suggestion.priority}
                        </Badge>
                      </div>
                      <h4 className="text-sm font-medium text-gray-800 mb-1">
                        {suggestion.title}
                      </h4>
                      <p className="text-xs text-gray-600 mb-2">
                        {suggestion.description}
                      </p>
                      
                      {suggestion.actionable && onAskAI && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAskAI(suggestion)}
                          className="text-xs h-7 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/70 hover:bg-white"
                        >
                          <MessageCircle className="w-3 h-3 mr-1" />
                          Ask AI
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Footer with Additional Info */}
          <div className="mt-6 pt-4 border-t border-amber-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Info className="w-4 h-4" />
                <span>
                  {selectedProfile ? 
                    `Personalized for ${selectedProfile} activities` : 
                    'Select a profile for personalized suggestions'
                  }
                </span>
              </div>
              
              {suggestions.length > 3 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDetailed(!showDetailed)}
                  className="text-amber-700 border-amber-300 hover:bg-amber-100"
                >
                  {showDetailed ? 'Show Less' : `+${suggestions.length - 3} More`}
                </Button>
              )}
            </div>
          </div>

          {/* AI Integration Hint */}
          {onAskAI && (
            <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-800">
                  💡 Tap "Ask AI" on any suggestion for detailed explanations with NASA data insights
                </span>
              </div>
            </div>
          )}
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}