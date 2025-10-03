import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CalendarIcon, Clock, TrendingUp, Calendar, Star } from 'lucide-react';
import { motion } from 'motion/react';

// Simple date formatting without external dependency
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatDateShort = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

interface DateSelectorProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  onSuggestionsTriggered?: () => void;
}

export function DateSelector({ selectedDate, onDateSelect, onSuggestionsTriggered }: DateSelectorProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    if (dateValue) {
      const date = new Date(dateValue);
      onDateSelect(date);
      onSuggestionsTriggered?.();
    }
  };

  const formatForInput = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  // Generate some quick date options
  const getQuickDates = () => {
    const today = new Date();
    const options = [];
    
    // Today
    options.push({ label: 'Today', date: new Date(today) });
    
    // Tomorrow
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    options.push({ label: 'Tomorrow', date: tomorrow });
    
    // Next week
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    options.push({ label: 'Next Week', date: nextWeek });
    
    // Next month
    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 1);
    options.push({ label: 'Next Month', date: nextMonth });
    
    return options;
  };

  const getSeasonInfo = (date: Date) => {
    const month = date.getMonth();
    if (month >= 2 && month <= 4) return { season: 'Spring', emoji: '🌸', color: 'text-green-600' };
    if (month >= 5 && month <= 7) return { season: 'Summer', emoji: '☀️', color: 'text-yellow-600' };
    if (month >= 8 && month <= 10) return { season: 'Autumn', emoji: '🍂', color: 'text-orange-600' };
    return { season: 'Winter', emoji: '❄️', color: 'text-blue-600' };
  };

  const getDaysUntilDate = (date: Date) => {
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 border-0 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg text-gray-800 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-600" />
          Date Selection
        </h3>
        {selectedDate && (
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            <Clock className="w-3 h-3 mr-1" />
            {getDaysUntilDate(selectedDate) === 0 ? 'Today' : 
             getDaysUntilDate(selectedDate) === 1 ? 'Tomorrow' :
             `${getDaysUntilDate(selectedDate)} days`}
          </Badge>
        )}
      </div>
      
      {/* Enhanced Date Input */}
      <div className="space-y-6">
        <div className="relative">
          <input
            type="date"
            value={selectedDate ? formatForInput(selectedDate) : ''}
            onChange={handleDateChange}
            className="w-full h-14 px-4 pr-12 bg-white border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none text-lg transition-all duration-200"
            min={new Date().toISOString().split('T')[0]}
          />
          <CalendarIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-600 pointer-events-none" />
        </div>

        {/* Quick Date Options with Enhanced Design */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 mb-3">
            <Star className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">Quick Select</span>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {getQuickDates().map((option, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  onClick={() => {
                    onDateSelect(option.date);
                    onSuggestionsTriggered?.();
                  }}
                  className={`w-full h-12 text-sm transition-all duration-200 ${
                    selectedDate && selectedDate.toDateString() === option.date.toDateString()
                      ? 'bg-purple-100 border-purple-300 text-purple-700 shadow-md'
                      : 'bg-white border-purple-200 hover:bg-purple-50 hover:border-purple-300'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-1">
                    <span className="font-medium">{option.label}</span>
                    <span className="text-xs text-gray-500">{formatDateShort(option.date)}</span>
                  </div>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {selectedDate && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-6 p-4 bg-white rounded-xl border-2 border-purple-200 shadow-sm"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Analyzing weather for:</p>
              <p className="text-gray-800 font-medium">{formatDate(selectedDate)}</p>
              
              {(() => {
                const seasonInfo = getSeasonInfo(selectedDate);
                return (
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="secondary" className="bg-purple-50 text-purple-700">
                      {seasonInfo.emoji} {seasonInfo.season}
                    </Badge>
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Historical Analysis
                    </Badge>
                  </div>
                );
              })()}
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">
                {getDaysUntilDate(selectedDate) >= 0 ? `+${getDaysUntilDate(selectedDate)}` : getDaysUntilDate(selectedDate)}
              </div>
              <div className="text-xs text-gray-500">days from today</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Smart Features Info */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-purple-200">
        <div className="flex items-center space-x-2 mb-2">
          <CalendarIcon className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-medium text-gray-700">Smart Features</span>
        </div>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• 🤖 AI generates lifestyle suggestions for selected dates</li>
          <li>• 📊 Historical data covers 20+ years of patterns</li>
          <li>• 🎯 Personalized recommendations based on user profile</li>
          <li>• 💡 Tap suggestions to get detailed NASA data insights</li>
        </ul>
      </div>
    </Card>
  );
}