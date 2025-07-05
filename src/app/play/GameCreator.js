"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function GameCreator({ onStartGame, user }) {
  const [mode, setMode] = useState('soft');
  const [playerCount, setPlayerCount] = useState(4);
  const [timerMinutes, setTimerMinutes] = useState(5);
  const [isPremium, setIsPremium] = useState(false);
  
  // Check if mode requires premium
  const requiresPremium = (mode) => {
    return ['hardcore', 'quick'].includes(mode) && !isPremium;
  };

  // Check if user has premium access
  useEffect(() => {
    if (user && user.hasPremium) {
      setIsPremium(true);
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if premium required but not available
    if (requiresPremium(mode)) {
      return;
    }

    onStartGame({
      mode,
      playerCount,
      timerMinutes,
      startTime: Date.now(),
    });
  };

  return (
    <motion.div 
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center justify-center space-y-6 p-2 sm:p-6">
        <h1 className="text-3xl sm:text-4xl font-bold gradient-text text-center">
          Stwórz Nową Grę
        </h1>
        
        <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-8">
          {/* Game Modes Selection */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Wybierz Tryb Gry</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setMode('soft')}
                className={`card p-4 flex flex-col items-center transition-all ${mode === 'soft' ? 'ring-2 ring-[var(--primary)]' : 'opacity-80 hover:opacity-100'}`}
              >
                <h3 className="text-lg font-medium">Soft</h3>
                <p className="text-sm text-center text-[var(--text-gray)]">Łagodne zadania towarzyskie</p>
              </button>
              
              <button
                type="button"
                onClick={() => setMode('chaos')}
                className={`card p-4 flex flex-col items-center transition-all ${mode === 'chaos' ? 'ring-2 ring-[var(--primary)]' : 'opacity-80 hover:opacity-100'}`}
              >
                <h3 className="text-lg font-medium">Chaos</h3>
                <p className="text-sm text-center text-[var(--text-gray)]">Szalone i zabawne wyzwania</p>
              </button>
              
              <button
                type="button"
                onClick={() => setMode('hardcore')}
                className={`card p-4 flex flex-col items-center transition-all ${
                  mode === 'hardcore' ? 'ring-2 ring-[var(--primary)]' : 'opacity-80 hover:opacity-100'
                } ${requiresPremium('hardcore') ? 'relative' : ''}`}
              >
                <h3 className="text-lg font-medium">Hardcore</h3>
                <p className="text-sm text-center text-[var(--text-gray)]">Odważne zadania dla dorosłych</p>
                {requiresPremium('hardcore') && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-xl">
                    <span className="bg-[var(--primary)] px-2 py-1 rounded text-sm font-bold">PREMIUM</span>
                  </div>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => setMode('quick')}
                className={`card p-4 flex flex-col items-center transition-all ${
                  mode === 'quick' ? 'ring-2 ring-[var(--primary)]' : 'opacity-80 hover:opacity-100'
                } ${requiresPremium('quick') ? 'relative' : ''}`}
              >
                <h3 className="text-lg font-medium">Quick</h3>
                <p className="text-sm text-center text-[var(--text-gray)]">Szybkie zadania refleksowe</p>
                {requiresPremium('quick') && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-xl">
                    <span className="bg-[var(--primary)] px-2 py-1 rounded text-sm font-bold">PREMIUM</span>
                  </div>
                )}
              </button>
            </div>
          </div>
          
          {/* Player Count */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Liczba Graczy</h2>
            <div className="flex items-center justify-center space-x-4">
              <button 
                type="button"
                onClick={() => playerCount > 2 && setPlayerCount(playerCount - 1)}
                className="btn btn-outline p-2 px-4"
              >
                -
              </button>
              <span className="text-2xl font-bold w-12 text-center">{playerCount}</span>
              <button 
                type="button"
                onClick={() => playerCount < 16 && setPlayerCount(playerCount + 1)}
                className="btn btn-outline p-2 px-4"
              >
                +
              </button>
            </div>
          </div>
          
          {/* Timer Setting */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Czas Między Zadaniami</h2>
            <div className="flex flex-col items-center space-y-2">
              <input
                type="range"
                min="1"
                max="15"
                value={timerMinutes}
                onChange={(e) => setTimerMinutes(parseInt(e.target.value))}
                className="w-full"
              />
              <span className="text-lg">{timerMinutes} minut</span>
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="flex flex-col space-y-4">
            <button
              type="submit"
              className={`btn btn-primary w-full ${requiresPremium(mode) ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={requiresPremium(mode)}
            >
              {requiresPremium(mode) ? 'Wymagane Premium' : 'Rozpocznij Grę'}
            </button>
            
            {requiresPremium(mode) && (
              <Link href="/premium" className="text-center text-[var(--primary)] hover:underline">
                Odblokuj tryb premium
              </Link>
            )}
          </div>
        </form>
      </div>
    </motion.div>
  );
} 