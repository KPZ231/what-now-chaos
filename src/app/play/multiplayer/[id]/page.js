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
  const hasPlayedWarningRef = useRef(false); // New ref for warning sound
  const fetchGameStateRef = useRef(null); // Ref for fetchGameState function
  
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

  // Handle errors
  const handleError = useCallback((message, isCritical = false) => {
    setError(message);
    
    if (isCritical) {
      // Redirect to join page for critical errors
      router.push('/play/multiplayer/join');
    } else {
      // Show notification for non-critical errors
      setNotification({
        message,
        type: 'error',
        visible: true
      });
      
      // Hide notification after 5 seconds
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
      
      notificationTimeoutRef.current = setTimeout(() => {
        setNotification(prev => ({...prev, visible: false}));
      }, 5000);
    }
  }, [router]);

  // Hide notification
  const hideNotification = () => {
    setNotification(prev => ({...prev, visible: false}));
  };

  // Handle task complete/skip
  const handleTaskAction = useCallback(async (action) => {
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
      
      // Refresh game state using the ref to avoid circular dependency
      if (fetchGameStateRef.current) {
        fetchGameStateRef.current();
      }
      
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
  }, [gameId, participantId, playSound, handleError]);
  
  // Start a timer when game is active
  useEffect(() => {
    // Only set up timer if game is active and it's someone's turn
    if (game?.status !== 'active' || !game?.currentTurn) return;
    
    // Clear any existing timer
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    
    // Set up new timer
    timerIntervalRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        // If it's this user's turn, play warning sound at 30 seconds
        if (isMyTurn && prev <= 30 && !hasPlayedWarningRef.current) {
          playSound('timerWarning');
          hasPlayedWarningRef.current = true;
        }
        
        // Time's up
        if (prev <= 1) {
          // Only the current player should handle the task expiration
          if (isMyTurn) {
            playSound('timerExpire');
            handleTaskAction('skip');
          }
          
          // Reset timer for everyone
          hasPlayedWarningRef.current = false;
          return game?.timerMinutes * 60 || 60;
        }
        
        return prev - 1;
      });
    }, 1000);
    
    // Clean up on unmount
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [game?.status, game?.currentTurn, game, isMyTurn, handleTaskAction, game?.timerMinutes]);
  
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
  }, [gameId, participantId, isMyTurn, game?.currentTurn, handleError]);
  
  // Store fetchGameState in ref to avoid circular dependencies
  useEffect(() => {
    fetchGameStateRef.current = fetchGameState;
  }, [fetchGameState]);

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
      
      // Store ref value in a variable to use in cleanup
      const notificationTimeout = notificationTimeoutRef.current;
      if (notificationTimeout) clearTimeout(notificationTimeout);
      
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
    <>
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
                    className={`
                      w-full btn ${isReady ? 'btn-secondary' : 'btn-primary'}`}
                    onClick={handleReadyToggle}
                  >
                    {isReady ? 'Nie jestem gotowy' : 'Jestem gotowy'}
                  </button>
                  
                  {currentParticipant?.isHost && (
                    <button 
                      className="w-full btn btn-accent"
                      onClick={() => handleStartGame(false)}
                    >
                      Rozpocznij grę
                    </button>
                  )}
                  
                  {currentParticipant?.isHost && (
                    <button 
                      className="w-full btn btn-outline"
                      onClick={() => handleStartGame(true)}
                    >
                      Rozpocznij bez czekania
                    </button>
                  )}
                </div>
              </div>
              
              {/* Participants */}
              <div className="w-full md:w-1/2 card p-6">
                <h2 className="text-xl font-bold mb-4">Uczestnicy ({game.participants.filter(p => p.isActive).length}/{game.maxPlayers})</h2>
                
                <div className="space-y-3">
                  {game.participants
                    .filter(p => p.isActive)
                    .map(participant => (
                      <div 
                        key={participant.id}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          participant.id === participantId 
                            ? 'bg-[var(--primary)]/20 border border-[var(--primary)]/50' 
                            : 'bg-[var(--container-color)]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-lg font-bold">
                            {participant.nickname.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium">{participant.nickname}</p>
                            <p className="text-xs text-[var(--text-gray)]">
                              {participant.isHost ? 'Host' : 'Gracz'}
                            </p>
                          </div>
                        </div>
                        
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          participant.isReady 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {participant.isReady ? 'Gotowy' : 'Nie gotowy'}
                        </div>
                      </div>
                    ))}
                </div>
                
                {game.participants.filter(p => p.isActive).length < 2 && (
                  <div className="mt-4 p-4 bg-yellow-900/30 border border-yellow-700/30 rounded-lg">
                    <p className="text-sm text-yellow-300">
                      Potrzeba co najmniej 2 graczy, aby rozpocząć grę.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key="game"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              {/* Active game UI */}
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Current task */}
                <div className="w-full lg:w-2/3 card p-6">
                  <div className="mb-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold">Aktualne zadanie</h2>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[var(--text-gray)]">Tura:</span>
                      <span className="font-medium">{getCurrentPlayerName()}</span>
                    </div>
                  </div>
                  
                  {/* Timer */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-[var(--text-gray)]">Pozostały czas:</span>
                      <span className="font-mono text-lg">{formatTime(timeRemaining)}</span>
                    </div>
                    <div className="w-full h-2 bg-[var(--container-color)] rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${timeRemaining <= 30 ? 'bg-red-500' : 'bg-[var(--primary)]'}`}
                        style={{ width: `${calculateProgress()}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Task content */}
                  <div className="mb-8">
                    {isMyTurn && game.currentTask ? (
                      <motion.div
                        key={game.currentTaskId}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-6 bg-gradient-to-br from-[var(--primary)]/20 to-[var(--secondary)]/20 rounded-xl border border-[var(--primary)]/30"
                      >
                        <h3 className="text-2xl font-bold mb-3 gradient-text">Twoja kolej!</h3>
                        <p className="text-xl">{game.currentTask.content}</p>
                      </motion.div>
                    ) : game.currentTask ? (
                      <motion.div
                        key={game.currentTaskId}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-6 bg-[var(--container-color)] rounded-xl"
                      >
                        <h3 className="text-xl font-bold mb-3">Zadanie dla: {getCurrentPlayerName()}</h3>
                        <p className="text-lg opacity-75">{game.currentTask.content}</p>
                      </motion.div>
                    ) : (
                      <div className="p-6 bg-[var(--container-color)] rounded-xl text-center">
                        <p className="text-lg opacity-75">Oczekiwanie na rozpoczęcie tury...</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Action buttons */}
                  {isMyTurn && game.currentTask && (
                    <div className="flex gap-4">
                      <button 
                        className="flex-1 btn btn-success"
                        onClick={() => handleTaskAction('complete')}
                      >
                        Wykonano
                      </button>
                      <button 
                        className="flex-1 btn btn-error"
                        onClick={() => handleTaskAction('skip')}
                      >
                        Pomiń
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Players list */}
                <div className="w-full lg:w-1/3 card p-6">
                  <h2 className="text-xl font-bold mb-4">Gracze</h2>
                  
                  <div className="space-y-3">
                    {game.participants
                      .filter(p => p.isActive)
                      .map(participant => (
                        <div 
                          key={participant.id}
                          className={`flex items-center justify-between p-3 rounded-lg ${
                            participant.id === game.currentTurn 
                              ? 'bg-[var(--primary)]/20 border border-[var(--primary)]/50' 
                              : 'bg-[var(--container-color)]'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-lg font-bold">
                              {participant.nickname.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium">{participant.nickname}</p>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-[var(--text-gray)]">
                                  {participant.tasksCompleted} wykonanych
                                </span>
                                <span className="text-xs text-[var(--text-gray)]">
                                  {participant.tasksSkipped} pominiętych
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {participant.id === game.currentTurn && (
                            <div className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--primary)]/20 text-[var(--primary)]">
                              Teraz gra
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
        </div>
      </main>
    </div>
    
    {/* Leave session confirmation modal */}
    {isLeavingSession && (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div className="bg-[var(--background)] rounded-xl p-6 max-w-md w-full">
          <h3 className="text-xl font-bold mb-4">Opuścić grę?</h3>
          <p className="mb-6">Czy na pewno chcesz opuścić tę grę? Jeśli jesteś hostem, gra będzie kontynuowana, ale nie będziesz mógł do niej wrócić.</p>
          
          <div className="flex gap-4">
            <button 
              className="flex-1 btn btn-outline"
              onClick={cancelLeaveSession}
            >
              Anuluj
            </button>
            <button 
              className="flex-1 btn btn-error"
              onClick={() => handleLeaveSession(false)}
            >
              Opuść grę
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}