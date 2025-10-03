import React from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar } from './ui/avatar';
import { MapPin, Clock, ThumbsUp, MessageSquare } from 'lucide-react';

interface DiaryEntry {
  id: string;
  user: string;
  avatar: string;
  location: string;
  timestamp: string;
  weather: string;
  description: string;
  tags: string[];
  likes: number;
  comments: number;
}

const mockEntries: DiaryEntry[] = [
  {
    id: '1',
    user: 'Sarah M.',
    avatar: 'SM',
    location: 'Central Park, NYC',
    timestamp: '2 hours ago',
    weather: 'Sunny & Clear',
    description: 'Perfect weather for our family picnic! Light breeze, comfortable temperature. Kids loved it!',
    tags: ['Family', 'Outdoor', 'Perfect'],
    likes: 12,
    comments: 3
  },
  {
    id: '2',
    user: 'Mike R.',
    avatar: 'MR',
    location: 'Golden Gate Park, SF',
    timestamp: '5 hours ago',
    weather: 'Foggy Morning',
    description: 'Typical SF fog cleared by noon. Great for morning jog, visibility improved later.',
    tags: ['Exercise', 'Fog', 'Good'],
    likes: 8,
    comments: 1
  },
  {
    id: '3',
    user: 'Alex Chen',
    avatar: 'AC',
    location: 'Millennium Park, Chicago',
    timestamp: '1 day ago',
    weather: 'Windy & Cool',
    description: 'Strong winds made outdoor event challenging. Had to move activities indoors.',
    tags: ['Event', 'Windy', 'Challenging'],
    likes: 5,
    comments: 7
  },
  {
    id: '4',
    user: 'Emma L.',
    avatar: 'EL',
    location: 'Griffith Observatory, LA',
    timestamp: '1 day ago',
    weather: 'Clear Skies',
    description: 'Amazing stargazing conditions! No clouds, low humidity. Perfect for astrophotography.',
    tags: ['Stargazing', 'Clear', 'Perfect'],
    likes: 15,
    comments: 4
  }
];

export function WeatherDiary() {
  const getWeatherBadgeColor = (weather: string) => {
    if (weather.includes('Perfect') || weather.includes('Clear')) {
      return 'bg-green-100 text-green-700 border-green-200';
    } else if (weather.includes('Foggy') || weather.includes('Cloudy')) {
      return 'bg-gray-100 text-gray-700 border-gray-200';
    } else if (weather.includes('Windy') || weather.includes('Challenging')) {
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
    return 'bg-blue-100 text-blue-700 border-blue-200';
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-teal-50 to-cyan-50 border-0 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg text-gray-800">Weather Diary Feed</h3>
        <Badge variant="secondary" className="bg-teal-100 text-teal-700">
          Live Reports
        </Badge>
      </div>

      <div className="space-y-4 max-h-64 overflow-y-auto">
        {mockEntries.map((entry) => (
          <div key={entry.id} className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm">
                {entry.avatar}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-900">{entry.user}</span>
                    <Badge className={getWeatherBadgeColor(entry.weather)}>
                      {entry.weather}
                    </Badge>
                  </div>
                  <span className="text-xs text-gray-500">{entry.timestamp}</span>
                </div>
                
                <div className="flex items-center space-x-1 mb-2">
                  <MapPin className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-600">{entry.location}</span>
                </div>
                
                <p className="text-sm text-gray-700 mb-2">{entry.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {entry.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center space-x-3 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <ThumbsUp className="w-3 h-3" />
                      <span>{entry.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="w-3 h-3" />
                      <span>{entry.comments}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
        <p className="text-sm text-gray-600">
          Real-time weather reports from users in your area. Share your own experience to help others plan better.
        </p>
      </div>
    </Card>
  );
}