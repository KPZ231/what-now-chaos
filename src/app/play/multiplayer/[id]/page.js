"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import Link from 'next/link';
import { QRCodeCanvas } from 'qrcode.react';
import { playSound } from '@/lib/sounds';

export default function MultiplayerGamePage() {
  const { id: gameId } = useParams();
  const searchParams = useSearchParams();
  const participantId = searchParams.get('participantId');
  
  const [game, setGame] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentParticipant, setCurrentParticipant] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [pollingInterval, setPollingInterval] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isLeavingSession, setIsLeavingSession] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '', visible: false });
  
  // Refs to track which tasks we've already played sounds for
  const lastPlayedTaskRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const notificationTimeoutRef = useRef(null);
  
  const { user } = useAuth();
  const router = useRouter();
  
  const gameUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/play/multiplayer/join?code=${game?.joinCode}` 
    : '';
  
  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Calculate timer progress
  const calculateProgress = () => {
    if (!game) return 0;
    const totalSeconds = game.timerMinutes * 60;
    return ((totalSeconds - timeRemaining) / totalSeconds) * 100;
  };
  
  // Start a timer when game is active
  useEffect(() => {
    if (game && game.status === 'active') {
      // Clear any existing timer
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      
      // Set initial time
      setTimeRemaining(game.timerMinutes * 60);
      
      // Set up timer
      timerIntervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Time's up - handle automatically if needed
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (game && game.status !== 'active') {
      // Clear timer when not user's turn
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
    
    // Clean up on unmount
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [game?.status, game?.currentTurn]);
  
  // Fetch game state
  const fetchGameState = useCallback(async () => {
    try {
      if (!gameId || !participantId) return;
      
      const response = await fetch(`/api/multiplayer/game/${gameId}?participantId=${participantId}`);
      
      if (!response.ok) {
        const data = await response.json();
        
        // These are critical errors that should redirect the user
        const criticalErrors = [
          'Game not found',
          'Invalid participant',
          'Participant ID is required'
        ];
        
        const errorMessage = data.error || 'Failed to fetch game state';
        const isCritical = criticalErrors.some(msg => errorMessage.includes(msg));
        
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      
      if (data.success && data.game) {
        setGame(data.game);
        
        // Find current participant
        const participant = data.game.participants.find(p => p.id === participantId);
        setCurrentParticipant(participant);
        
        if (participant) {
          setIsReady(participant.isReady);
        }
        
        // Check if it's this user's turn and the currentTaskId has changed
        const wasMyTurn = isMyTurn;
        const newIsMyTurn = data.game.currentTurn === participantId;
        setIsMyTurn(newIsMyTurn);
        
        // Play sound if it's now my turn but wasn't before OR
        // if it's my turn and the task has changed
        if (
          (newIsMyTurn && !wasMyTurn) || 
          (newIsMyTurn && lastPlayedTaskRef.current !== data.game.currentTaskId)
        ) {
          playSound('taskAppear');
          // Update the last played task
          lastPlayedTaskRef.current = data.game.currentTaskId;
        }
        
        // Reset timer whenever the current turn changes
        if (data.game.currentTurn !== game?.currentTurn) {
          setTimeRemaining(data.game.timerMinutes * 60);
        }
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching game state:', error);
      
      // These are critical errors that should redirect the user
      const criticalErrors = [
        'Game not found',
        'Invalid participant',
        'Participant ID is required'
      ];
      
      const isCritical = criticalErrors.some(msg => 
        error.message && error.message.includes(msg)
      );
      
      handleError(error.message || 'Failed to fetch game state', isCritical);
      setIsLoading(false);
    }
  }, [gameId, participantId, isMyTurn, game?.currentTurn]);
  
  // Set up polling for game state updates
  useEffect(() => {
    // Initial fetch
    fetchGameState();
    
    // Set up polling
    const interval = setInterval(() => {
      fetchGameState();
    }, 3000); // Poll every 3 seconds
    
    setPollingInterval(interval);
    
    // Clean up on unmount
    return () => {
      if (interval) clearInterval(interval);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (notificationTimeoutRef.current) clearTimeout(notificationTimeoutRef.current);
      
      // Ensure the participant is marked as inactive when leaving the page
      if (gameId && participantId) {
        fetch(`/api/multiplayer/game/${gameId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            participantId,
            isActive: false
          }),
        }).catch(err => console.error('Failed to mark participant as inactive on unmount:', err));
      }
    };
  }, [fetchGameState, gameId, participantId]);
  
  // Handle ready toggle
  const handleReadyToggle = async () => {
    try {
      const response = await fetch(`/api/multiplayer/game/${gameId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          participantId,
          isReady: !isReady
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setIsReady(!isReady);
      } else {
        throw new Error(data.error || 'Failed to update ready status');
      }
    } catch (error) {
      console.error('Error toggling ready status:', error);
      handleError(error.message || 'Failed to update ready status');
    }
  };
  
  // Handle start game
  const handleStartGame = async (forceStart = false) => {
    try {
      const response = await fetch(`/api/multiplayer/game/${gameId}/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          participantId,
          forceStart
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        // Non-critical errors when starting a game
        const nonCriticalErrors = [
          'Not all participants are ready',
          'Need at least 2 players to start'
        ];
        
        const errorMessage = data.error || 'Failed to start game';
        const isCritical = !nonCriticalErrors.some(msg => errorMessage.includes(msg));
        
        throw new Error(errorMessage);
      }
      
      // Refresh game state
      fetchGameState();
      
    } catch (error) {
      console.error('Error starting game:', error);
      
      // Check if this is a non-critical error
      const nonCriticalErrors = [
        'Not all participants are ready',
        'Need at least 2 players to start'
      ];
      
      const isCritical = !nonCriticalErrors.some(msg => 
        error.message && error.message.includes(msg)
      );
      
      handleError(error.message || 'Failed to start game', isCritical);
    }
  };
  
  // Handle task complete/skip
  const handleTaskAction = async (action) => {
    try {
      if (action === 'complete') {
        playSound('taskComplete');
      } else {
        playSound('taskSkip');
      }
      
      const response = await fetch(`/api/multiplayer/game/${gameId}/task`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          participantId,
          action
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        // Non-critical errors when performing task actions
        const nonCriticalErrors = [
          'It is not your turn',
          'Game is not active',
          'No active task'
        ];
        
        const errorMessage = data.error || 'Failed to process task action';
        throw new Error(errorMessage);
      }
      
      // Clear timer
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      
      // Reset lastPlayedTask to allow playing sound for the next task
      lastPlayedTaskRef.current = null;
      
      // Refresh game state
      fetchGameState();
      
    } catch (error) {
      console.error('Error processing task action:', error);
      
      // Check if this is a non-critical error
      const nonCriticalErrors = [
        'It is not your turn',
        'Game is not active',
        'No active task'
      ];
      
      const isCritical = !nonCriticalErrors.some(msg => 
        error.message && error.message.includes(msg)
      );
      
      handleError(error.message || 'Failed to process task action', isCritical);
    }
  };
  
  // Handle leaving session
  const handleLeaveSession = async (showConfirmation = true) => {
    try {
      if (showConfirmation && !isLeavingSession) {
        setIsLeavingSession(true);
        return;
      }
      
      if (!gameId || !participantId) return;
      
      // Mark participant as inactive
      const response = await fetch(`/api/multiplayer/game/${gameId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          participantId,
          isActive: false
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to leave session');
      }
      
      // Clear any intervals
      if (pollingInterval) clearInterval(pollingInterval);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      
      // Redirect back to play page
      router.push('/play');
      
    } catch (error) {
      console.error('Error leaving session:', error);
      setError(error.message || 'Failed to leave session');
    }
  };

  // Close leave confirmation dialog
  const cancelLeaveSession = () => {
    setIsLeavingSession(false);
  };
  
  // Copy join code to clipboard
  const copyJoinCode = () => {
    if (!game?.joinCode) return;
    
    navigator.clipboard.writeText(game.joinCode);
    alert(`Kod gry ${game.joinCode} skopiowany do schowka!`);
  };
  
  // Find whose turn it is
  const getCurrentPlayerName = () => {
    if (!game || !game.participants) return '';
    
    const currentPlayer = game.participants.find(p => p.id === game.currentTurn);
    return currentPlayer?.nickname || '';
  };
  
  // Show loading state
  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[var(--primary)] mx-auto"></div>
          <p className="mt-4 text-lg">Ładowanie gry...</p>
        </div>
      </main>
    );
  }
  
  // Show error state - only for critical errors that prevent the game from continuing
  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Wystąpił błąd</h1>
          <p className="mb-6">{error}</p>
          <Link href="/play" className="btn btn-primary">
            Wróć do menu
          </Link>
        </div>
      </main>
    );
  }
  
  // Game not found
  if (!game) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Gra nie została znaleziona</h1>
          <p className="mb-6">Ta gra może już nie istnieć lub nie masz do niej dostępu.</p>
          <Link href="/play" className="btn btn-primary">
            Wróć do menu
          </Link>
        </div>
      </main>
    );
  }
  
  // Render lobby or game based on status
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-900 to-indigo-950 text-white">
      {/* Navigation Header */}
      <header className="sticky top-0 z-10 bg-black/60 backdrop-blur-lg border-b border-white/10 py-3 px-4 flex justify-between items-center">
        <div>
          <Link href="/play" className="text-sm font-medium opacity-80 hover:opacity-100 transition-opacity flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
            </svg>
            Wróć
          </Link>
        </div>
        <div className="font-bold text-center text-lg">
          {game?.joinCode && <span className="text-sm mr-2">Kod: {game.joinCode}</span>}
          WhatNow?! Multiplayer
        </div>
        <div>
          <button
            onClick={() => handleLeaveSession(true)}
            className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
          >
            Opuść grę
          </button>
        </div>
      </header>
      
      <main className="flex flex-1 flex-col items-center justify-between p-4 sm:p-8 pt-16">
        {/* Notification toast */}
        {notification.visible && (
          <div className={`fixed top-20 right-4 z-50 max-w-xs w-full p-4 rounded-lg shadow-lg transition-all duration-300 transform ${
            notification.type === 'error' ? 'bg-red-900 border border-red-700' : 
            notification.type === 'success' ? 'bg-green-900 border border-green-700' :
            'bg-blue-900 border border-blue-700'
          }`}>
            <div className="flex justify-between items-start">
              <div className="flex-grow">
                <p className="text-sm text-white">{notification.message}</p>
              </div>
              <button 
                onClick={hideNotification}
                className="text-white opacity-70 hover:opacity-100 transition-opacity ml-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                </svg>
              </button>
            </div>
          </div>
        )}
        
        <div className="w-full max-w-5xl">
          {/* Game header */}
          <div className="flex justify-between items-center w-full mb-6">
            <div>
              <h1 className="text-2xl font-bold gradient-text">
                {game.status === 'lobby' ? 'Lobby Gry' : 'WhatNow?! Multiplayer'}
              </h1>
              <p className="text-[var(--text-gray)]">
                Tryb: {game.mode.charAt(0).toUpperCase() + game.mode.slice(1)}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                game.status === 'lobby' ? 'bg-yellow-500' : 
                game.status === 'active' ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span className="text-sm">
                {game.status === 'lobby' ? 'W lobby' : 
                 game.status === 'active' ? 'Gra aktywna' : 'Zakończona'}
              </span>
            </div>
          </div>
        
        {game.status === 'lobby' ? (
          <AnimatePresence mode="wait">
            <motion.div
              key="lobby"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col md:flex-row gap-6"
            >
              {/* Lobby info */}
              <div className="w-full md:w-1/2 card p-6">
                <h2 className="text-xl font-bold mb-4">Zaproś znajomych</h2>
                
                <div className="mb-6">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="bg-white p-4 rounded-lg">
                      <QRCodeCanvas 
                        value={gameUrl}
                        size={200}
                        bgColor="#ffffff"
                        fgColor="#000000"
                        level="H"
                      />
                    </div>
                    
                    <div className="text-center">
                      <p className="mb-2">lub podaj kod do gry:</p>
                      <div 
                        className="bg-[var(--container-color)] p-3 rounded-lg text-3xl font-mono tracking-wider text-center cursor-pointer hover:bg-[var(--container-color)]/80"
                        onClick={copyJoinCode}
                      >
                        {game.joinCode}
                      </div>
                      <p className="text-sm text-[var(--text-gray)] mt-2">
                        Kliknij kod aby skopiować
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Game settings */}
                <div className="border-t border-[var(--border-color)] pt-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-gray)]">Tryb gry:</span>
                    <span className="font-medium">{game.mode.charAt(0).toUpperCase() + game.mode.slice(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-gray)]">Limit graczy:</span>
                    <span className="font-medium">{game.maxPlayers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-gray)]">Czas na turę:</span>
                    <span className="font-medium">{game.timerMinutes} min</span>
                  </div>
                </div>
                
                {/* Ready toggle and start game buttons */}
                <div className="mt-6 space-y-3">
                  <button 
                    className={`btn w-full ${isReady ? 'btn-success' : 'btn-outline'}`}
                    onClick={handleReadyToggle}
                  >
                    {isReady ? 'Gotowy' : 'Oznacz jako gotowy'}
                  </button>
                  
                  {/* Only host can start the game */}
                  {currentParticipant && currentParticipant.turnOrder === 0 && (
                    <div className="space-y-2">
                      <button 
                        className="btn btn-primary w-full"
                        onClick={() => handleStartGame(false)}
                      >
                        Rozpocznij grę
                      </button>
                      <button 
                        className="btn btn-outline w-full"
                        onClick={() => handleStartGame(true)}
                      >
                        Wymuś start
                      </button>
                      <p className="text-xs text-[var(--text-gray)] text-center">
                        Wymuś start pomija sprawdzanie gotowości graczy
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Players list */}
              <div className="w-full md:w-1/2 card p-6">
                <h2 className="text-xl font-bold mb-4">
                  Gracze ({game.participants.length}/{game.maxPlayers})
                </h2>
                
                <div className="space-y-3">
                  {game.participants.map((participant) => (
                    <div 
                      key={participant.id}
                      className={`p-3 rounded-lg border ${
                        participant.id === participantId
                          ? 'border-[var(--primary)] bg-[var(--primary)]/10'
                          : 'border-[var(--border-color)] bg-[var(--container-color)]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {participant.turnOrder === 0 && (
                            <span className="bg-[var(--primary)] text-white text-xs px-2 py-0.5 rounded">
                              HOST
                            </span>
                          )}
                          <span className="font-medium">{participant.nickname}</span>
                          {participant.id === participantId && (
                            <span className="text-xs text-[var(--text-gray)]">(Ty)</span>
                          )}
                        </div>
                        <div className={`w-3 h-3 rounded-full ${
                          participant.isReady ? 'bg-green-500' : 'bg-yellow-500'
                        }`}></div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Empty slots */}
                  {Array.from({ length: game.maxPlayers - game.participants.length }).map((_, i) => (
                    <div 
                      key={`empty-${i}`}
                      className="p-3 rounded-lg border border-dashed border-[var(--border-color)] flex items-center justify-center text-[var(--text-gray)]"
                    >
                      Wolne miejsce...
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-[var(--text-gray)]">
                    {game.participants.filter(p => p.isReady).length} z {game.participants.length} graczy jest gotowych
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key="gameplay"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col md:flex-row gap-6"
            >
              {/* Player list and stats */}
              <div className="w-full md:w-1/3">
                <div className="card h-full">
                  <h2 className="text-xl font-bold mb-4">Gracze</h2>
                  
                  <div className="space-y-3">
                    {game.participants.map((participant) => (
                      <div 
                        key={participant.id}
                        className={`p-3 rounded-lg ${
                          participant.id === game.currentTurn
                            ? 'bg-[var(--primary)]/20 border border-[var(--primary)]'
                            : 'bg-[var(--container-color)]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {participant.id === participantId && (
                              <span className="text-xs text-[var(--text-gray)]">(Ty)</span>
                            )}
                            <span className="font-medium">{participant.nickname}</span>
                            {participant.id === game.currentTurn && (
                              <span className="text-xs bg-[var(--primary)] text-white px-2 py-0.5 rounded">
                                TURA
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="mt-2 flex justify-between text-xs text-[var(--text-gray)]">
                          <span>Wykonane: {participant.tasksCompleted}</span>
                          <span>Pominięte: {participant.tasksSkipped}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Task area */}
              <div className="w-full md:w-2/3">
                <div className="card relative">
                  {/* Timer Circle - zawsze widoczny */}
                  <div className="absolute -top-5 right-6">
                    <div className="w-20 h-20 rounded-full bg-[var(--container-color)] border-4 border-[var(--border-color)] flex items-center justify-center shadow-lg">
                      <div className="relative w-full h-full flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90 absolute">
                          <circle
                            cx="40"
                            cy="40"
                            r="36"
                            strokeWidth="4"
                            stroke="var(--primary)"
                            fill="transparent"
                            strokeDasharray={`${2 * Math.PI * 36}`}
                            strokeDashoffset={`${2 * Math.PI * 36 * (1 - calculateProgress() / 100)}`}
                            className="transition-all duration-1000"
                          />
                        </svg>
                        <span className={`text-xl font-bold ${timeRemaining <= 30 ? 'text-red-500 animate-pulse' : ''}`}>
                          {formatTime(timeRemaining)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="text-xs text-[var(--text-gray)]">Tura gracza</span>
                      <h2 className="text-2xl font-bold gradient-text">
                        {getCurrentPlayerName()}
                      </h2>
                    </div>
                  </div>
                  
                  {/* Task content */}
                  <div className="bg-[var(--container-color)]/50 p-6 rounded-lg mb-6 min-h-[120px] flex items-center justify-center">
                    <p className="text-xl sm:text-2xl text-center">
                      {game.currentTaskContent || "Oczekiwanie na zadanie..."}
                    </p>
                  </div>
                  
                  {/* Action buttons - only visible if it's your turn */}
                  {isMyTurn ? (
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button 
                        onClick={() => handleTaskAction('complete')}
                        className="btn btn-primary flex-1"
                      >
                        Wykonane
                      </button>
                      <button 
                        onClick={() => handleTaskAction('skip')}
                        className="btn btn-outline flex-1"
                      >
                        Pomiń
                      </button>
                    </div>
                  ) : (
                    <div className="text-center p-4 bg-[var(--container-color)]/30 rounded-lg">
                      <p>Oczekiwanie na ruch gracza {getCurrentPlayerName()}</p>
                    </div>
                  )}
                </div>
                
                {/* Recent task history */}
                {game.completedTasks && game.completedTasks.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">Ostatnie wyzwania</h3>
                    <div className="space-y-2">
                      {game.completedTasks.slice(0, 3).map((task) => (
                        <div 
                          key={task.id}
                          className={`p-3 rounded-lg border ${
                            task.skipped 
                              ? 'border-red-500/30 bg-red-500/10'
                              : 'border-green-500/30 bg-green-500/10'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <p className="text-sm">{task.taskContent}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              task.skipped 
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-green-500/20 text-green-400'
                            }`}>
                              {task.skipped ? 'Pominięte' : 'Wykonane'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Leave session confirmation */}
      {isLeavingSession && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Opuścić sesję?</h3>
            <p className="mb-6 text-gray-300">
              Czy na pewno chcesz opuścić tę grę? Twój status zostanie zmieniony na nieaktywny.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelLeaveSession}
                className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                Anuluj
              </button>
              <button
                onClick={() => handleLeaveSession(false)}
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-500 transition-colors"
              >
                Opuść
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  </div>
  );
} 