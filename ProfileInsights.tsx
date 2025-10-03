import React from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Heart, Users, Briefcase, Mountain, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface WeatherData {
  veryHot: number;
  veryWet: number;
  veryWindy: number;
  veryCold: number;
  comfortIndex: number;
}

interface ProfileInsightsProps {
  profile: string | null;
  weatherData: WeatherData | null;
  location: string;
  date: string;
}

export function ProfileInsights({ profile, weatherData, location, date }: ProfileInsightsProps) {
  if (!profile || !weatherData) return null;

  const getProfileInfo = (profileId: string) => {
    const profiles = {
      family: {
        name: 'Family',
        icon: Heart,
        color: 'text-pink-600',
        bgColor: 'bg-pink-50',
        borderColor: 'border-pink-200'
      },
      farmer: {
        name: 'Farmer',
        icon: Users,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      },
      planner: {
        name: 'Event Planner',
        icon: Briefcase,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200'
      },
      adventurer: {
        name: 'Adventurer',
        icon: Mountain,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200'
      }
    };
    return profiles[profileId as keyof typeof profiles];
  };

  const generateRecommendations = () => {
    const recommendations = [];
    const warnings = [];
    const insights = [];

    switch (profile) {
      case 'family':
        if (weatherData.veryCold > 70) {
          warnings.push('Very cold conditions expected - pack warm clothing for children');
        }
        if (weatherData.veryHot > 70) {
          warnings.push('High heat probability - plan indoor activities during peak hours');
        }
        if (weatherData.veryWet > 60) {
          recommendations.push('Bring rain gear and plan backup indoor activities');
        }
        if (weatherData.comfortIndex > 70) {
          insights.push('Great conditions for family outdoor activities and picnics');
        }
        break;

      case 'farmer':
        if (weatherData.veryWet > 80) {
          warnings.push('High precipitation risk - delay planting or harvesting operations');
        }
        if (weatherData.veryWet < 20 && weatherData.veryHot > 60) {
          warnings.push('Dry and hot conditions - increase irrigation planning');
        }
        if (weatherData.veryWet >= 30 && weatherData.veryWet <= 60) {
          insights.push('Moderate moisture levels - good for crop growth');
        }
        if (weatherData.veryCold > 70) {
          warnings.push('Frost risk - protect sensitive crops');
        }
        break;

      case 'planner':
        if (weatherData.veryWet > 50) {
          warnings.push('Rain probability high - consider covered venues or tent rentals');
        }
        if (weatherData.veryWindy > 60) {
          warnings.push('High wind probability - secure decorations and outdoor setups');
        }
        if (weatherData.comfortIndex > 80) {
          insights.push('Excellent conditions for outdoor events and gatherings');
        }
        if (weatherData.veryHot > 75) {
          recommendations.push('Provide shade, cooling stations, and extra hydration');
        }
        break;

      case 'adventurer':
        if (weatherData.veryWindy > 70) {
          warnings.push('High wind conditions - check equipment and route safety');
        }
        if (weatherData.veryWet > 70) {
          recommendations.push('Waterproof gear essential - consider alternative routes');
        }
        if (weatherData.comfortIndex > 60 && weatherData.veryWindy < 50) {
          insights.push('Good conditions for outdoor adventures and hiking');
        }
        if (weatherData.veryCold > 60) {
          recommendations.push('Cold weather gear required - check for altitude effects');
        }
        break;
    }

    // Add general insights
    if (weatherData.comfortIndex < 40) {
      warnings.push('Overall challenging weather conditions expected');
    }

    return { recommendations, warnings, insights };
  };

  const profileInfo = getProfileInfo(profile);
  const { recommendations, warnings, insights } = generateRecommendations();
  const IconComponent = profileInfo.icon;

  return (
    <Card className={`p-6 ${profileInfo.bgColor} border-0 shadow-lg`}>
      <div className="flex items-center space-x-3 mb-4">
        <IconComponent className={`w-6 h-6 ${profileInfo.color}`} />
        <h3 className="text-lg text-gray-800">
          {profileInfo.name} Weather Insights
        </h3>
        <Badge className={`${profileInfo.bgColor} ${profileInfo.color} ${profileInfo.borderColor}`}>
          Personalized
        </Badge>
      </div>

      <div className="space-y-4">
        {/* Warnings */}
        {warnings.length > 0 && (
          <div className="space-y-2">
            {warnings.map((warning, index) => (
              <Alert key={index} className="border-orange-200 bg-orange-50">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  {warning}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="space-y-2">
            {recommendations.map((rec, index) => (
              <Alert key={index} className="border-blue-200 bg-blue-50">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  {rec}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* Positive Insights */}
        {insights.length > 0 && (
          <div className="space-y-2">
            {insights.map((insight, index) => (
              <Alert key={index} className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  {insight}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* Profile-specific metrics */}
        <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Key Metrics for {profileInfo.name}:</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {profile === 'family' && (
              <>
                <div>Safety Score: <span className="text-blue-600">{Math.max(0, 100 - Math.max(weatherData.veryHot, weatherData.veryCold))}%</span></div>
                <div>Comfort Level: <span className="text-green-600">{weatherData.comfortIndex}%</span></div>
              </>
            )}
            {profile === 'farmer' && (
              <>
                <div>Crop Conditions: <span className="text-green-600">{Math.min(100, 100 - weatherData.veryWet + 30)}%</span></div>
                <div>Growing Score: <span className="text-blue-600">{Math.max(0, 100 - weatherData.veryCold)}%</span></div>
              </>
            )}
            {profile === 'planner' && (
              <>
                <div>Event Viability: <span className="text-blue-600">{Math.max(0, 100 - Math.max(weatherData.veryWet, weatherData.veryWindy))}%</span></div>
                <div>Outdoor Rating: <span className="text-green-600">{weatherData.comfortIndex}%</span></div>
              </>
            )}
            {profile === 'adventurer' && (
              <>
                <div>Adventure Score: <span className="text-orange-600">{Math.max(0, weatherData.comfortIndex - weatherData.veryWindy * 0.3)}%</span></div>
                <div>Visibility: <span className="text-blue-600">{Math.max(0, 100 - weatherData.veryWet)}%</span></div>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}