"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import GameCreator from './GameCreator';
import Game from './Game';
import GameHistory from './GameHistory';

export default function PlayPage() {
  const [gameState, setGameState] = useState('setup'); // setup, play, summary, history
  const [gameConfig, setGameConfig] = useState(null);
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const handleStartGame = (config) => {
    setGameConfig(config);
    setGameState('play');
  };

  const handleEndGame = (stats) => {
    // Update game config with stats
    setGameConfig(prev => ({
      ...prev,
      stats: stats
    }));
    setGameState('summary');
  };

  const handlePlayAgain = () => {
    setGameState('setup');
  };

  const handleViewHistory = () => {
    setGameState('history');
  };

  const handleBackToSetup = () => {
    setGameState('setup');
  };

  // Render content based on game state
  const renderContent = () => {
    switch (gameState) {
      case 'setup':
        return (
          <div className="w-full">
            <GameCreator onStartGame={handleStartGame} user={user} />
            <div className="flex justify-center mt-8">
              <button 
                className="btn btn-outline"
                onClick={handleViewHistory}
              >
                Zobacz historię gier
              </button>
            </div>
          </div>
        );
      case 'play':
        return <Game config={gameConfig} onEndGame={handleEndGame} />;
      case 'summary':
        return (
          <motion.div 
            className="flex flex-col items-center justify-center space-y-6 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold gradient-text">Koniec Gry!</h1>
            <div className="card w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Statystyki</h2>
              <p>Tryb: {gameConfig?.mode}</p>
              <p>Liczba graczy: {gameConfig?.playerCount}</p>
              <p>Wykonane zadania: {gameConfig?.stats?.completedTasks}</p>
              <p>Pominięte zadania: {gameConfig?.stats?.skippedTasks}</p>
              <p>Całkowity czas: {gameConfig?.stats?.totalTime} min</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button 
                className="btn btn-primary"
                onClick={handlePlayAgain}
              >
                Zagraj Ponownie
              </button>
              <button 
                className="btn btn-outline"
                onClick={handleViewHistory}
              >
                Zobacz Historię
              </button>
              <button 
                className="btn btn-outline"
                onClick={() => router.push('/')}
              >
                Wróć do Menu
              </button>
            </div>
          </motion.div>
        );
      case 'history':
        return (
          <AnimatePresence mode="wait">
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <GameHistory onBack={handleBackToSetup} user={user} />
            </motion.div>
          </AnimatePresence>
        );
      default:
        return <div>Ładowanie...</div>;
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 sm:p-8">
      <div className="w-full max-w-5xl">
        {renderContent()}
      </div>
    </main>
  );
} 