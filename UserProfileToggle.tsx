import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Users, Briefcase, Mountain, Heart } from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  color: string;
  priorities: string[];
}

const profiles: UserProfile[] = [
  {
    id: 'family',
    name: 'Family',
    icon: Heart,
    description: 'Family-friendly activities and safety',
    color: 'bg-pink-100 text-pink-700 border-pink-200',
    priorities: ['Safety', 'Comfort', 'Mild Weather']
  },
  {
    id: 'farmer',
    name: 'Farmer',
    icon: Users,
    description: 'Agricultural planning and crop management',
    color: 'bg-green-100 text-green-700 border-green-200',
    priorities: ['Precipitation', 'Temperature', 'Growing Season']
  },
  {
    id: 'planner',
    name: 'Event Planner',
    icon: Briefcase,
    description: 'Outdoor events and venue planning',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    priorities: ['Clear Skies', 'Low Wind', 'Optimal Comfort']
  },
  {
    id: 'adventurer',
    name: 'Adventurer',
    icon: Mountain,
    description: 'Outdoor activities and extreme sports',
    color: 'bg-orange-100 text-orange-700 border-orange-200',
    priorities: ['Wind Conditions', 'Visibility', 'Weather Patterns']
  }
];

interface UserProfileToggleProps {
  selectedProfile: string | null;
  onProfileSelect: (profileId: string) => void;
}

export function UserProfileToggle({ selectedProfile, onProfileSelect }: UserProfileToggleProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="p-4 bg-gradient-to-br from-slate-50 to-gray-50 border-0 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg text-gray-800">User Profile</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm"
        >
          {isExpanded ? 'Collapse' : 'Customize'}
        </Button>
      </div>

      {isExpanded && (
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Select your profile to get personalized weather insights
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {profiles.map((profile) => {
              const IconComponent = profile.icon;
              const isSelected = selectedProfile === profile.id;
              
              return (
                <button
                  key={profile.id}
                  onClick={() => onProfileSelect(profile.id)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                    isSelected 
                      ? 'border-blue-300 bg-blue-50 shadow-md' 
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <IconComponent className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
                    <span className={`font-medium ${isSelected ? 'text-blue-800' : 'text-gray-800'}`}>
                      {profile.name}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{profile.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {profile.priorities.map((priority, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className={`text-xs ${isSelected ? profile.color : 'bg-gray-100 text-gray-600'}`}
                      >
                        {priority}
                      </Badge>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {selectedProfile && !isExpanded && (
        <div className="flex items-center space-x-2">
          <Badge className={profiles.find(p => p.id === selectedProfile)?.color}>
            Active: {profiles.find(p => p.id === selectedProfile)?.name}
          </Badge>
        </div>
      )}
    </Card>
  );
}