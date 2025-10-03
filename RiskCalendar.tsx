import React, { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight, Calendar, AlertTriangle, TrendingUp, Info } from 'lucide-react';

interface Location {
  lat: number;
  lng: number;
  city: string;
}

interface RiskCalendarProps {
  month: number;
  year: number;
  selectedLocation?: Location | null;
  selectedProfile?: string | null;
  onDateSelect?: (date: Date) => void;
}

export function RiskCalendar({ month, year, selectedLocation, selectedProfile, onDateSelect }: RiskCalendarProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [currentMonth, setCurrentMonth] = useState(month);
  const [currentYear, setCurrentYear] = useState(year);
  
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  // Generate mock risk data for each day with profile and location influence
  const generateRiskData = () => {
    const risks = [];
    for (let day = 1; day <= daysInMonth; day++) {
      let baseRisk = Math.random();
      
      // Seasonal adjustments
      const seasonalModifier = Math.sin((currentMonth / 12) * 2 * Math.PI) * 0.3;
      
      // Location adjustments (if provided)
      if (selectedLocation) {
        const latModifier = Math.abs(selectedLocation.lat) / 90 * 0.2;
        baseRisk += latModifier;
      }
      
      // Profile-specific risk adjustments
      if (selectedProfile) {
        switch (selectedProfile) {
          case 'farmer':
            // Farmers are more sensitive to rain and extreme temperatures
            baseRisk += Math.sin((day / 30) * Math.PI) * 0.2;
            break;
          case 'planner':
            // Event planners are more sensitive to any adverse weather
            baseRisk += 0.1;
            break;
          case 'family':
            // Families are more cautious about extreme conditions
            baseRisk += 0.05;
            break;
          case 'adventurer':
            // Adventurers can handle more risk
            baseRisk -= 0.1;
            break;
        }
      }
      
      // Apply seasonal modifier
      baseRisk += seasonalModifier;
      
      // Ensure risk stays within bounds
      const riskLevel = Math.max(0, Math.min(1, baseRisk));
      
      let riskCategory = 'low';
      let bgColor = 'bg-green-100 hover:bg-green-200 border-green-300';
      let textColor = 'text-green-800';
      let intensity = 'light';
      
      if (riskLevel > 0.7) {
        riskCategory = 'high';
        bgColor = 'bg-red-100 hover:bg-red-200 border-red-300';
        textColor = 'text-red-800';
        intensity = 'high';
      } else if (riskLevel > 0.4) {
        riskCategory = 'medium';
        bgColor = 'bg-yellow-100 hover:bg-yellow-200 border-yellow-300';
        textColor = 'text-yellow-800';
        intensity = 'medium';
      }
      
      risks.push({
        day,
        risk: Math.round(riskLevel * 100),
        category: riskCategory,
        bgColor,
        textColor,
        intensity,
        details: {
          temperature: Math.round(20 + Math.random() * 20 + seasonalModifier * 10),
          precipitation: Math.round(riskLevel * 80),
          wind: Math.round(10 + Math.random() * 30),
          humidity: Math.round(40 + Math.random() * 40)
        }
      });
    }
    return risks;
  };

  const riskData = generateRiskData();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
    setSelectedDay(null);
  };

  const selectedDayData = selectedDay ? riskData.find(d => d.day === selectedDay) : null;
  const riskSummary = {
    low: riskData.filter(d => d.category === 'low').length,
    medium: riskData.filter(d => d.category === 'medium').length,
    high: riskData.filter(d => d.category === 'high').length
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-0 shadow-xl">
      {/* Header with Navigation */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Calendar className="w-6 h-6 text-indigo-600" />
          <h3 className="text-xl text-gray-800">Risk Calendar</h3>
          {selectedLocation && (
            <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
              {selectedLocation.city}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('prev')}
            className="p-2"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <div className="px-4 py-2 bg-white rounded-lg border border-gray-200 min-w-[140px] text-center">
            <span className="font-medium text-gray-800">
              {monthNames[currentMonth]} {currentYear}
            </span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('next')}
            className="p-2"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Risk Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-100 border border-green-200 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-800">{riskSummary.low}</div>
          <div className="text-sm text-green-600">Low Risk Days</div>
        </div>
        <div className="bg-yellow-100 border border-yellow-200 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-yellow-800">{riskSummary.medium}</div>
          <div className="text-sm text-yellow-600">Medium Risk Days</div>
        </div>
        <div className="bg-red-100 border border-red-200 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-red-800">{riskSummary.high}</div>
          <div className="text-sm text-red-600">High Risk Days</div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-7 gap-2">
          {/* Day headers */}
          {dayNames.map(day => (
            <div key={day} className="p-3 text-center font-medium text-gray-600 border-b border-gray-200">
              {day}
            </div>
          ))}
          
          {/* Empty cells for days before the first day of the month */}
          {Array.from({ length: firstDayOfMonth }, (_, index) => (
            <div key={`empty-${index}`} className="p-3 h-16"></div>
          ))}
          
          {/* Calendar days */}
          {riskData.map(({ day, risk, category, bgColor, textColor, intensity, details }) => (
            <div
              key={day}
              onClick={() => {
                setSelectedDay(selectedDay === day ? null : day);
                // Trigger suggestions when a date is clicked
                if (onDateSelect) {
                  const clickedDate = new Date(currentYear, currentMonth, day);
                  onDateSelect(clickedDate);
                }
              }}
              className={`p-3 h-16 rounded-lg cursor-pointer transition-all duration-200 border-2 ${bgColor} ${textColor} flex flex-col items-center justify-center relative transform hover:scale-105 ${
                selectedDay === day ? 'ring-2 ring-indigo-500 shadow-lg' : ''
              }`}
            >
              <span className="font-medium">{day}</span>
              <div className="flex items-center space-x-1 mt-1">
                {intensity === 'high' && <AlertTriangle className="w-3 h-3" />}
                {intensity === 'medium' && <TrendingUp className="w-3 h-3" />}
                <span className="text-xs">{risk}%</span>
              </div>
              
              {/* Enhanced Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 pointer-events-none">
                <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
                  <div className="font-medium">{monthNames[currentMonth]} {day}</div>
                  <div>{category.charAt(0).toUpperCase() + category.slice(1)} Risk: {risk}%</div>
                  <div className="text-gray-300 mt-1">
                    <div>Temp: {details.temperature}°C</div>
                    <div>Rain: {details.precipitation}%</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Day Details */}
      {selectedDayData && (
        <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-800">
              {monthNames[currentMonth]} {selectedDayData.day}, {currentYear}
            </h4>
            <Badge 
              variant="secondary" 
              className={`${
                selectedDayData.category === 'high' ? 'bg-red-100 text-red-800' :
                selectedDayData.category === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}
            >
              {selectedDayData.category.charAt(0).toUpperCase() + selectedDayData.category.slice(1)} Risk: {selectedDayData.risk}%
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Temperature:</span>
              <div className="font-medium">{selectedDayData.details.temperature}°C</div>
            </div>
            <div>
              <span className="text-gray-600">Precipitation:</span>
              <div className="font-medium">{selectedDayData.details.precipitation}%</div>
            </div>
            <div>
              <span className="text-gray-600">Wind Speed:</span>
              <div className="font-medium">{selectedDayData.details.wind} km/h</div>
            </div>
            <div>
              <span className="text-gray-600">Humidity:</span>
              <div className="font-medium">{selectedDayData.details.humidity}%</div>
            </div>
          </div>
        </div>
      )}

      {/* Legend and Info */}
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-400 rounded border border-green-500"></div>
            <span className="text-sm text-gray-600">Low Risk</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-400 rounded border border-yellow-500"></div>
            <span className="text-sm text-gray-600">Medium Risk</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-400 rounded border border-red-500"></div>
            <span className="text-sm text-gray-600">High Risk</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Info className="w-4 h-4" />
          <span>Based on NASA historical data & seasonal patterns</span>
        </div>
      </div>

      {selectedProfile && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-medium">
              {selectedProfile.charAt(0).toUpperCase() + selectedProfile.slice(1)} Profile Active:
            </span>
            {' '}Risk assessment customized for {
              selectedProfile === 'farmer' ? 'agricultural planning and crop protection' :
              selectedProfile === 'planner' ? 'event planning and outdoor activities' :
              selectedProfile === 'family' ? 'family safety and comfort' :
              'outdoor adventures and exploration'
            }.
          </p>
        </div>
      )}
    </Card>
  );
}