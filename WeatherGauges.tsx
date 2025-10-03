import React from 'react';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Thermometer, CloudRain, Wind, Snowflake, Smile } from 'lucide-react';

interface WeatherData {
  veryHot: number;
  veryWet: number;
  veryWindy: number;
  veryCold: number;
  comfortIndex: number;
}

interface WeatherGaugesProps {
  data: WeatherData | null;
  isLoading?: boolean;
}

export function WeatherGauges({ data, isLoading }: WeatherGaugesProps) {
  const gauges = [
    {
      icon: Thermometer,
      label: 'Very Hot',
      emoji: '🌡️',
      value: data?.veryHot || 0,
      color: 'bg-gradient-to-r from-orange-400 to-red-500',
      bgColor: 'from-orange-50 to-red-50'
    },
    {
      icon: CloudRain,
      label: 'Very Wet',
      emoji: '🌧️',
      value: data?.veryWet || 0,
      color: 'bg-gradient-to-r from-blue-400 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100'
    },
    {
      icon: Wind,
      label: 'Very Windy',
      emoji: '🌬️',
      value: data?.veryWindy || 0,
      color: 'bg-gradient-to-r from-gray-400 to-gray-600',
      bgColor: 'from-gray-50 to-gray-100'
    },
    {
      icon: Snowflake,
      label: 'Very Cold',
      emoji: '❄️',
      value: data?.veryCold || 0,
      color: 'bg-gradient-to-r from-cyan-400 to-blue-500',
      bgColor: 'from-cyan-50 to-blue-50'
    }
  ];

  const CircularGauge = ({ value, color, size = 100, strokeWidth = 8, emoji }: { 
    value: number; 
    color: string; 
    size?: number; 
    strokeWidth?: number;
    emoji?: string;
  }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (value / 100) * circumference;

    // Generate unique gradient ID for each gauge
    const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="relative flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="1" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(0,0,0,0.1)"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`transition-all duration-2000 ease-out ${color.replace('bg-gradient-to-r', 'text-opacity-90')}`}
            style={{
              filter: value > 70 ? 'url(#glow)' : 'none'
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {emoji && <span className="text-xl mb-1">{emoji}</span>}
          <span className={`font-semibold ${size >= 100 ? 'text-xl' : 'text-lg'} text-gray-800`}>
            {value}%
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Main Weather Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {gauges.map((gauge, index) => (
          <Card key={index} className={`p-6 bg-gradient-to-br ${gauge.bgColor} border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1`}>
            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{gauge.emoji}</span>
                <gauge.icon className="w-6 h-6 text-gray-600" />
              </div>
              <h4 className="text-base font-medium text-gray-700 text-center">{gauge.label}</h4>
              
              {isLoading ? (
                <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-gray-300 animate-ping"></div>
                </div>
              ) : (
                <div className="relative">
                  <CircularGauge 
                    value={gauge.value} 
                    color={gauge.color}
                    size={100}
                    strokeWidth={10}
                    emoji={gauge.emoji}
                  />
                  {gauge.value > 70 && (
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                  )}
                </div>
              )}
              
              <div className="text-center">
                <p className="text-xs text-gray-600">
                  Historical probability
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  NASA satellite data
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Comfort Index - Enhanced */}
      <Card className="p-8 bg-gradient-to-br from-emerald-50 via-green-50 to-blue-50 border-0 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <Smile className="w-8 h-8 text-emerald-600" />
              <h3 className="text-2xl text-gray-800">Overall Comfort Index</h3>
              <span className="text-3xl">🙂</span>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Progress 
                  value={data?.comfortIndex || 0} 
                  className="h-4 flex-1"
                />
                <div className="text-3xl font-bold text-emerald-600 min-w-[80px]">
                  {isLoading ? '...' : `${data?.comfortIndex || 0}%`}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <p className="font-medium mb-2">Comfort Assessment:</p>
                  <ul className="space-y-1">
                    <li>• Temperature comfort</li>
                    <li>• Precipitation impact</li>
                    <li>• Wind conditions</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium mb-2">Data Sources:</p>
                  <ul className="space-y-1">
                    <li>• NASA POWER Dataset</li>
                    <li>• 20+ years historical data</li>
                    <li>• Seasonal pattern analysis</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {!isLoading && (
            <div className="lg:ml-8">
              <CircularGauge 
                value={data?.comfortIndex || 0} 
                color="text-emerald-500"
                size={120}
                strokeWidth={12}
                emoji="🙂"
              />
            </div>
          )}
        </div>
        
        {/* Comfort Level Indicator */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Risk Level:</span>
            <div className="flex items-center space-x-2">
              {!isLoading && data && (
                <>
                  <div className={`w-3 h-3 rounded-full ${
                    data.comfortIndex >= 70 ? 'bg-green-500' :
                    data.comfortIndex >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <span className={`font-medium ${
                    data.comfortIndex >= 70 ? 'text-green-600' :
                    data.comfortIndex >= 40 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {data.comfortIndex >= 70 ? 'Low Risk' :
                     data.comfortIndex >= 40 ? 'Moderate Risk' : 'High Risk'}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}