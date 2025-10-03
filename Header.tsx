import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Cloud, Satellite, Brain, Globe, Menu, X, Star, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Title */}
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                <Globe className="w-7 h-7 text-white animate-pulse" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                <Satellite className="w-2 h-2 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                WeatherWise
              </h1>
              <div className="flex items-center space-x-2">
                <Brain className="w-3 h-3 text-blue-200" />
                <p className="text-sm text-blue-100">AI-Powered Weather Intelligence</p>
              </div>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Badge className="bg-emerald-500/20 text-emerald-100 border-emerald-400/30 backdrop-blur-sm px-3 py-1">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <Satellite className="w-3 h-3" />
                  <span className="font-medium">NASA Data Live</span>
                </div>
              </Badge>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Badge className="bg-yellow-500/20 text-yellow-100 border-yellow-400/30 backdrop-blur-sm px-3 py-1">
                <div className="flex items-center space-x-2">
                  <Star className="w-3 h-3" />
                  <span className="font-medium">20+ Years Data</span>
                </div>
              </Badge>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Badge className="bg-purple-500/20 text-purple-100 border-purple-400/30 backdrop-blur-sm px-3 py-1">
                <div className="flex items-center space-x-2">
                  <Shield className="w-3 h-3" />
                  <span className="font-medium">Research Grade</span>
                </div>
              </Badge>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:bg-white/10"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/20 pt-4 pb-4"
            >
              <div className="space-y-3">
                <Badge className="bg-emerald-500/20 text-emerald-100 border-emerald-400/30 backdrop-blur-sm px-3 py-1 w-full justify-center">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <Satellite className="w-3 h-3" />
                    <span className="font-medium">NASA Data Live</span>
                  </div>
                </Badge>

                <Badge className="bg-yellow-500/20 text-yellow-100 border-yellow-400/30 backdrop-blur-sm px-3 py-1 w-full justify-center">
                  <div className="flex items-center space-x-2">
                    <Star className="w-3 h-3" />
                    <span className="font-medium">20+ Years Data</span>
                  </div>
                </Badge>

                <Badge className="bg-purple-500/20 text-purple-100 border-purple-400/30 backdrop-blur-sm px-3 py-1 w-full justify-center">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-3 h-3" />
                    <span className="font-medium">Research Grade</span>
                  </div>
                </Badge>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-4 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-8 right-20 w-24 h-24 bg-blue-300/10 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-4 left-1/3 w-20 h-20 bg-purple-300/10 rounded-full blur-md animate-pulse"></div>
      </div>
    </header>
  );
}