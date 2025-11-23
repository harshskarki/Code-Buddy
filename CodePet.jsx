import React, { useState, useEffect } from 'react';
import { Code, Zap, Heart, TrendingUp } from 'lucide-react';

export default function CodePet() {
  const [pet, setPet] = useState({
    name: 'CodeBuddy',
    level: 1,
    xp: 0,
    health: 100,
    happiness: 80,
    stage: 'egg',
    lastCoded: null
  });
  
  const [codingSession, setCodingSession] = useState({
    minutes: 0,
    linesOfCode: 0
  });

  // Evolution stages with XP requirements
  const stages = {
    egg: { name: 'Egg', xpNeeded: 0, emoji: '🥚', size: 'text-6xl' },
    hatchling: { name: 'Hatchling', xpNeeded: 100, emoji: '🐣', size: 'text-7xl' },
    juvenile: { name: 'Juvenile', xpNeeded: 300, emoji: '🐥', size: 'text-8xl' },
    adult: { name: 'Adult', xpNeeded: 600, emoji: '🐦', size: 'text-9xl' },
    master: { name: 'Code Master', xpNeeded: 1000, emoji: '🦅', size: 'text-9xl' }
  };

  const xpForNextLevel = pet.level * 100;
  const currentStage = stages[pet.stage];

  // Calculate next evolution stage
  const getNextStage = (totalXP) => {
    if (totalXP >= stages.master.xpNeeded) return 'master';
    if (totalXP >= stages.adult.xpNeeded) return 'adult';
    if (totalXP >= stages.juvenile.xpNeeded) return 'juvenile';
    if (totalXP >= stages.hatchling.xpNeeded) return 'hatchling';
    return 'egg';
  };

  const logCodingSession = () => {
    const { minutes, linesOfCode } = codingSession;
    if (minutes <= 0 && linesOfCode <= 0) return;

    const xpGained = Math.floor(minutes * 2 + linesOfCode * 0.5);
    const newTotalXP = (pet.level - 1) * 100 + pet.xp + xpGained;
    const newLevel = Math.floor(newTotalXP / 100) + 1;
    const newXP = newTotalXP % 100;
    const newStage = getNextStage(newTotalXP);
    const happinessBoost = Math.min(20, Math.floor(xpGained / 5));

    setPet(prev => ({
      ...prev,
      xp: newXP,
      level: newLevel,
      stage: newStage,
      happiness: Math.min(100, prev.happiness + happinessBoost),
      health: Math.min(100, prev.health + 5),
      lastCoded: new Date()
    }));

    setCodingSession({ minutes: 0, linesOfCode: 0 });
  };

  const feedPet = () => {
    setPet(prev => ({
      ...prev,
      health: Math.min(100, prev.health + 10),
      happiness: Math.min(100, prev.happiness + 5)
    }));
  };

  const playWithPet = () => {
    setPet(prev => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 15),
      health: Math.max(0, prev.health - 2)
    }));
  };

  // Decay over time (simulated - in production would track actual time)
  useEffect(() => {
    const interval = setInterval(() => {
      setPet(prev => ({
        ...prev,
        happiness: Math.max(0, prev.happiness - 0.5),
        health: Math.max(0, prev.health - 0.3)
      }));
    }, 60000); // Every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur rounded-2xl p-6 shadow-2xl mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{pet.name}</h1>
              <p className="text-gray-600">{currentStage.name} • Level {pet.level}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">XP Progress</div>
              <div className="text-2xl font-bold text-purple-600">{pet.xp}/{xpForNextLevel}</div>
            </div>
          </div>
          
          {/* XP Bar */}
          <div className="mt-4 bg-gray-200 rounded-full h-4 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-500"
              style={{ width: `${(pet.xp / xpForNextLevel) * 100}%` }}
            />
          </div>
        </div>

        {/* Pet Display */}
        <div className="bg-white/90 backdrop-blur rounded-2xl p-8 shadow-2xl mb-6">
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className={`${currentStage.size} animate-bounce transition-all duration-300`}>
              {currentStage.emoji}
            </div>
            
            {/* Stats */}
            <div className="w-full max-w-md space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="flex items-center text-sm font-medium text-gray-700">
                    <Heart className="w-4 h-4 mr-1 text-red-500" />
                    Health
                  </span>
                  <span className="text-sm font-bold">{Math.round(pet.health)}%</span>
                </div>
                <div className="bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-red-500 h-full rounded-full transition-all"
                    style={{ width: `${pet.health}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="flex items-center text-sm font-medium text-gray-700">
                    <Zap className="w-4 h-4 mr-1 text-yellow-500" />
                    Happiness
                  </span>
                  <span className="text-sm font-bold">{Math.round(pet.happiness)}%</span>
                </div>
                <div className="bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-yellow-500 h-full rounded-full transition-all"
                    style={{ width: `${pet.happiness}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-3">
              <button
                onClick={feedPet}
                className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
              >
                🍎 Feed
              </button>
              <button
                onClick={playWithPet}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
              >
                🎾 Play
              </button>
            </div>
          </div>
        </div>

        {/* Coding Session Logger */}
        <div className="bg-white/90 backdrop-blur rounded-2xl p-6 shadow-2xl">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Code className="w-5 h-5 mr-2" />
            Log Coding Session
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minutes Coded
              </label>
              <input
                type="number"
                min="0"
                value={codingSession.minutes}
                onChange={(e) => setCodingSession(prev => ({ ...prev, minutes: parseInt(e.target.value) || 0 }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="30"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lines of Code (Optional)
              </label>
              <input
                type="number"
                min="0"
                value={codingSession.linesOfCode}
                onChange={(e) => setCodingSession(prev => ({ ...prev, linesOfCode: parseInt(e.target.value) || 0 }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="50"
              />
            </div>
          </div>

          <button
            onClick={logCodingSession}
            disabled={codingSession.minutes <= 0 && codingSession.linesOfCode <= 0}
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <TrendingUp className="w-5 h-5 mr-2" />
            Submit & Gain XP
          </button>
          
          {codingSession.minutes > 0 || codingSession.linesOfCode > 0 ? (
            <p className="mt-3 text-sm text-center text-gray-600">
              You'll gain ~{Math.floor(codingSession.minutes * 2 + codingSession.linesOfCode * 0.5)} XP
            </p>
          ) : null}
        </div>

        {/* Evolution Progress */}
        <div className="mt-6 bg-white/90 backdrop-blur rounded-2xl p-6 shadow-2xl">
          <h3 className="text-lg font-bold text-gray-800 mb-3">Evolution Path</h3>
          <div className="flex justify-between items-center">
            {Object.entries(stages).map(([key, stage], idx) => (
              <div key={key} className="flex flex-col items-center">
                <div className={`text-3xl ${pet.stage === key ? 'scale-125' : pet.level * 100 >= stage.xpNeeded ? 'opacity-100' : 'opacity-30'} transition-all`}>
                  {stage.emoji}
                </div>
                <div className="text-xs text-gray-600 mt-1">{stage.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
