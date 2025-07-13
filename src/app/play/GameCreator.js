"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function GameCreator({ onStartGame, user }) {
  const [mode, setMode] = useState('soft');
  const [playerCount, setPlayerCount] = useState(4);
  const [timerMinutes, setTimerMinutes] = useState(5);
  const [isPremium, setIsPremium] = useState(false);
  const [isMultiplayer, setIsMultiplayer] = useState(false);
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [freeTrialGamesLeft, setFreeTrialGamesLeft] = useState(0);
  const [usingFreeTrial, setUsingFreeTrial] = useState(false);
  
  const router = useRouter();
  
  // Check if mode requires premium
  const requiresPremium = (mode) => {
    return ['hardcore', 'quick'].includes(mode) && !isPremium && freeTrialGamesLeft <= 0;
  };

  // Check if user has premium access
  useEffect(() => {
    if (user) {
      if (user.hasPremium) {
        setIsPremium(true);
      }
      
      if (user.freeTrialGamesLeft && user.freeTrialGamesLeft > 0) {
        setFreeTrialGamesLeft(user.freeTrialGamesLeft);
      }
      
      // Set nickname from user data if available
      if (user.name) {
        setNickname(user.name);
      }
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Check if premium required but not available
    if (requiresPremium(mode)) {
      setIsLoading(false);
      return;
    }
    
    // Check if we're using a free trial game
    const useFreeTrial = !isPremium && ['hardcore', 'quick'].includes(mode) && freeTrialGamesLeft > 0;
    
    // For multiplayer games, create a game session through the API
    if (isMultiplayer) {
      try {
        // Validate nickname for non-logged in users
        if (!user && (!nickname || nickname.trim().length < 2)) {
          setError('Wprowadź nick (min. 2 znaki) aby stworzyć grę multiplayer');
          setIsLoading(false);
          return;
        }
        
        console.log('Creating multiplayer game with data:', {
          mode,
          timerMinutes,
          maxPlayers: playerCount,
          nickname,
          useFreeTrial
        });
        
        const response = await fetch('/api/multiplayer/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            mode,
            timerMinutes,
            maxPlayers: playerCount,
            nickname,
            useFreeTrial
          }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          console.error('Failed to create multiplayer game:', data);
          throw new Error(data.error || 'Failed to create multiplayer game');
        }
        
        console.log('Multiplayer game created successfully:', data);
        
        // Redirect to multiplayer game page
        router.push(`/play/multiplayer/${data.gameId}?participantId=${data.participantId}`);
        
      } catch (error) {
        console.error('Error creating multiplayer game:', error);
        setError(error.message || 'Nie udało się stworzyć gry multiplayer');
        setIsLoading(false);
      }
      
      return;
    }
    
    // For single player games, use the existing flow but set the useFreeTrial flag
    if (useFreeTrial) {
      setUsingFreeTrial(true);
    }
    
    onStartGame({
      mode,
      playerCount,
      timerMinutes,
      useFreeTrial
    });
    
    setIsLoading(false);
  };

  // Disabled state for premium modes when user doesn't have access
  const isDisabled = (selectedMode) => {
    if (!['hardcore', 'quick'].includes(selectedMode)) return false;
    return !isPremium && freeTrialGamesLeft <= 0;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSubmit}>
        <div className="card mb-6 p-6">
          <h2 className="text-xl font-bold mb-4">Wybierz tryb gry</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <input 
                type="radio" 
                id="soft" 
                name="mode" 
                value="soft" 
                className="hidden peer"
                onChange={() => setMode('soft')}
                checked={mode === 'soft'} 
              />
              <label 
                htmlFor="soft" 
                className={`block p-4 border-2 rounded-lg text-center cursor-pointer ${mode === 'soft' ? 'border-[var(--primary)] bg-[var(--primary-light)]' : 'border-[var(--border-color)] hover:bg-[var(--bg-hover)]'} transition duration-200`}
              >
                <div className="text-xl font-bold mb-1">Soft</div>
                <div className="text-sm text-[var(--text-gray)]">Łagodne zadania</div>
              </label>
            </div>
            
            <div>
              <input 
                type="radio" 
                id="chaos" 
                name="mode" 
                value="chaos" 
                className="hidden peer"
                onChange={() => setMode('chaos')}
                checked={mode === 'chaos'} 
              />
              <label 
                htmlFor="chaos" 
                className={`block p-4 border-2 rounded-lg text-center cursor-pointer ${mode === 'chaos' ? 'border-[var(--primary)] bg-[var(--primary-light)]' : 'border-[var(--border-color)] hover:bg-[var(--bg-hover)]'} transition duration-200`}
              >
                <div className="text-xl font-bold mb-1">Chaos</div>
                <div className="text-sm text-[var(--text-gray)]">Średni poziom</div>
              </label>
            </div>
            
            <div>
              <input 
                type="radio" 
                id="hardcore" 
                name="mode" 
                value="hardcore" 
                className="hidden peer"
                onChange={() => setMode('hardcore')}
                checked={mode === 'hardcore'}
                disabled={isDisabled('hardcore')}
              />
              <label 
                htmlFor="hardcore" 
                className={`block p-4 border-2 rounded-lg text-center cursor-pointer ${isDisabled('hardcore') ? 'opacity-50 cursor-not-allowed' : ''} ${mode === 'hardcore' ? 'border-[var(--primary)] bg-[var(--primary-light)]' : 'border-[var(--border-color)] hover:bg-[var(--bg-hover)]'} transition duration-200`}
              >
                <div className="text-xl font-bold mb-1">
                  Hardcore
                  {!isPremium && freeTrialGamesLeft <= 0 && (
                    <span className="bg-yellow-500 text-black text-xs px-1 py-0.5 rounded ml-2">PRO</span>
                  )}
                </div>
                <div className="text-sm text-[var(--text-gray)]">Impreza hardcore</div>
              </label>
            </div>
            
            <div>
              <input 
                type="radio" 
                id="quick" 
                name="mode" 
                value="quick" 
                className="hidden peer"
                onChange={() => setMode('quick')}
                checked={mode === 'quick'}
                disabled={isDisabled('quick')}
              />
              <label 
                htmlFor="quick" 
                className={`block p-4 border-2 rounded-lg text-center cursor-pointer ${isDisabled('quick') ? 'opacity-50 cursor-not-allowed' : ''} ${mode === 'quick' ? 'border-[var(--primary)] bg-[var(--primary-light)]' : 'border-[var(--border-color)] hover:bg-[var(--bg-hover)]'} transition duration-200`}
              >
                <div className="text-xl font-bold mb-1">
                  Szybki
                  {!isPremium && freeTrialGamesLeft <= 0 && (
                    <span className="bg-yellow-500 text-black text-xs px-1 py-0.5 rounded ml-2">PRO</span>
                  )}
                </div>
                <div className="text-sm text-[var(--text-gray)]">Krótkie wyzwania</div>
              </label>
            </div>
          </div>
          
          {freeTrialGamesLeft > 0 && ['hardcore', 'quick'].includes(mode) && !isPremium && (
            <div className="mt-4 p-3 bg-yellow-100 text-yellow-800 rounded-lg">
              <p className="font-medium">Dostępne darmowe próby: {freeTrialGamesLeft}</p>
              <p className="text-sm">Po rejestracji masz {freeTrialGamesLeft} darmowych gier premium! Wykorzystaj je mądrze.</p>
            </div>
          )}
          
          {requiresPremium(mode) && (
            <div className="mt-4 p-3 bg-[var(--bg-light)] rounded-lg">
              <p className="font-medium">Ten tryb wymaga wersji Premium</p>
              <p className="text-sm">
                <Link href="/premium" className="text-[var(--primary)] hover:underline">
                  Odkryj korzyści Premium
                </Link>
              </p>
            </div>
          )}
        </div>
        
        <div className="card mb-6 p-6">
          <h2 className="text-xl font-bold mb-4">Ustawienia gry</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Liczba graczy</label>
            <div className="flex items-center">
              <input 
                type="range" 
                min="1" 
                max="20"
                value={playerCount}
                onChange={(e) => setPlayerCount(parseInt(e.target.value))}
                className="w-full mr-4" 
              />
              <span className="font-bold text-lg w-8 text-center">{playerCount}</span>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Czas między zadaniami (minuty)</label>
            <div className="flex items-center">
              <input 
                type="range" 
                min="1" 
                max="15"
                value={timerMinutes}
                onChange={(e) => setTimerMinutes(parseInt(e.target.value))}
                className="w-full mr-4" 
              />
              <span className="font-bold text-lg w-8 text-center">{timerMinutes}</span>
            </div>
          </div>
          
          <div className="mt-6">
            <label className="inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={isMultiplayer}
                onChange={(e) => setIsMultiplayer(e.target.checked)}
              />
              <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary)]"></div>
              <span className="ms-3 font-medium text-sm">Tryb multiplayer</span>
              {isMultiplayer && !user && (
                <span className="text-xs text-[var(--text-gray)] ml-2">(Bez logowania)</span>
              )}
            </label>
          </div>
          
          {/* Show nickname field for multiplayer mode */}
          {isMultiplayer && !user && (
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">Twój nick w grze</label>
              <input 
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="input"
                placeholder="Wprowadź swój nick"
                required
              />
            </div>
          )}
        </div>
        
        {error && (
          <div className="alert alert-error mb-6">
            <p>{error}</p>
          </div>
        )}
        
        <div className="flex justify-end">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isLoading || requiresPremium(mode)}
          >
            {isLoading ? (
              <span className="flex items-center">
                <span className="animate-spin h-5 w-5 mr-2 border-t-2 border-white rounded-full"></span>
                Tworzenie gry...
              </span>
            ) : (
              'Rozpocznij grę'
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
} 