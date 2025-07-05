"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound, preloadSounds, toggleSoundMute, isSoundMuted } from '@/lib/sounds';
import { saveGameSession } from '@/lib/gameStorage';

export default function Game({ config, onEndGame }) {
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(config.timerMinutes * 60);
  const [isLoading, setIsLoading] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);
  const [soundMuted, setSoundMuted] = useState(false);
  const [stats, setStats] = useState({
    completedTasks: 0,
    skippedTasks: 0,
    totalTime: 0,
  });
  const [taskHistory, setTaskHistory] = useState([]);
  
  // Refs to track timer warning sound
  const hasPlayedWarningRef = useRef(false);
  const sessionStartTimeRef = useRef(Date.now());
  
  // Load initial sound mute state and preload sounds
  useEffect(() => {
    setSoundMuted(isSoundMuted());
    preloadSounds();
  }, []);
  
  // Load tasks on component mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const response = await fetch(`/data/tasks-${config.mode}.json`);
        const data = await response.json();
        setTasks(data.tasks);
        
        // Select first random task
        if (data.tasks && data.tasks.length > 0) {
          selectRandomTask(data.tasks);
          // Play task appear sound after a brief delay
          setTimeout(() => playSound('taskAppear'), 300);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading tasks:", error);
        setIsLoading(false);
      }
    };
    
    loadTasks();
  }, [config.mode]);
  
  // Set up timer
  useEffect(() => {
    if (isLoading || isGameOver) return;
    
    const timerInterval = setInterval(() => {
      setTimeRemaining((prev) => {
        // Play warning sound at 30 seconds remaining if not already played
        if (prev <= 30 && !hasPlayedWarningRef.current) {
          playSound('timerWarning');
          hasPlayedWarningRef.current = true;
        }
        
        if (prev <= 1) {
          // Time's up - play expire sound and show next task
          playSound('timerExpire');
          handleNextTask();
          // Reset warning flag
          hasPlayedWarningRef.current = false;
          return config.timerMinutes * 60;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Update total time every minute
    const statsInterval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalTime: prev.totalTime + 1
      }));
    }, 60000);
    
    return () => {
      clearInterval(timerInterval);
      clearInterval(statsInterval);
    };
  }, [isLoading, isGameOver, config.timerMinutes]);
  
  // Select a random task
  const selectRandomTask = (taskList) => {
    const availableTasks = taskList.filter(
      task => !taskHistory.some(histTask => histTask.id === task.id)
    );
    
    // If we've used all tasks, reset history but avoid repeating the last task
    if (availableTasks.length === 0) {
      const lastTaskId = taskHistory.length > 0 
        ? taskHistory[taskHistory.length - 1].id 
        : null;
        
      const resetAvailableTasks = taskList.filter(task => task.id !== lastTaskId);
      
      const randomIndex = Math.floor(Math.random() * resetAvailableTasks.length);
      setCurrentTask(resetAvailableTasks[randomIndex]);
      return;
    }
    
    const randomIndex = Math.floor(Math.random() * availableTasks.length);
    setCurrentTask(availableTasks[randomIndex]);
  };
  
  // Handle completing the current task
  const handleCompleteTask = () => {
    // Play sound effect
    playSound('taskComplete');
    
    // Add to history
    setTaskHistory(prev => [...prev, {...currentTask, completed: true, timestamp: Date.now()}]);
    
    // Update stats
    setStats(prev => ({
      ...prev,
      completedTasks: prev.completedTasks + 1
    }));
    
    // Pick a new random task
    selectRandomTask(tasks);
    
    // Reset timer
    setTimeRemaining(config.timerMinutes * 60);
    hasPlayedWarningRef.current = false;
  };
  
  // Handle skipping the current task
  const handleSkipTask = () => {
    // Play sound effect
    playSound('taskSkip');
    
    // Add to history
    setTaskHistory(prev => [...prev, {...currentTask, completed: false, timestamp: Date.now()}]);
    
    // Update stats
    setStats(prev => ({
      ...prev,
      skippedTasks: prev.skippedTasks + 1
    }));
    
    // Pick a new random task
    selectRandomTask(tasks);
    
    // Reset timer
    setTimeRemaining(config.timerMinutes * 60);
    hasPlayedWarningRef.current = false;
  };
  
  // Handle showing the next task (when timer expires)
  const handleNextTask = () => {
    // Consider current task as skipped
    if (currentTask) {
      setTaskHistory(prev => [...prev, {...currentTask, completed: false, timestamp: Date.now(), expired: true}]);
      setStats(prev => ({
        ...prev,
        skippedTasks: prev.skippedTasks + 1
      }));
    }
    
    // Pick a new random task
    selectRandomTask(tasks);
    
    // Reset warning flag
    hasPlayedWarningRef.current = false;
  };
  
  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Handle toggling sound mute
  const handleToggleSound = () => {
    const newMuteState = toggleSoundMute();
    setSoundMuted(newMuteState);
  };
  
  // Handle ending the game and saving to localStorage
  const handleEndGame = () => {
    setIsGameOver(true);
    
    // Prepare game session data to save
    const gameSessionData = {
      mode: config.mode,
      playerCount: config.playerCount,
      timerMinutes: config.timerMinutes,
      startTime: sessionStartTimeRef.current,
      endTime: Date.now(),
      stats: {
        ...stats,
        totalDuration: Math.floor((Date.now() - sessionStartTimeRef.current) / 1000)
      },
      taskHistory: taskHistory
    };
    
    // Save to localStorage
    saveGameSession(gameSessionData);
    
    // Notify parent component
    onEndGame(stats);
  };
  
  // Determine who should perform the task
  const getTaskTarget = (taskType) => {
    switch (taskType) {
      case 'all':
        return 'Wszyscy';
      case 'one':
        return 'Wybrany gracz';
      case 'two':
        return 'Dwóch graczy';
      default:
        return '';
    }
  };
  
  // Calculate circle progress for timer
  const calculateProgress = () => {
    const total = config.timerMinutes * 60;
    return ((total - timeRemaining) / total) * 100;
  };
  
  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[var(--primary)] mx-auto"></div>
          <p className="mt-4 text-lg">Ładowanie zadań...</p>
        </div>
      </div>
    );
  }
  
  return (
    <motion.div 
      className="w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center justify-center space-y-6 p-2 sm:p-6">
        {/* Header with mode and players */}
        <div className="w-full flex justify-between items-center">
          <div>
            <h2 className="text-xl font-medium">Tryb: <span className="gradient-text">{config.mode.toUpperCase()}</span></h2>
            <p className="text-sm text-[var(--text-gray)]">Graczy: {config.playerCount}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-[var(--text-gray)]">Wykonano: {stats.completedTasks}</p>
            <p className="text-sm text-[var(--text-gray)]">Pominięto: {stats.skippedTasks}</p>
          </div>
        </div>
        
        {/* Sound toggle button */}
        <button 
          className="absolute top-4 right-4 text-2xl p-2 rounded-full bg-[var(--container-color)]/50 hover:bg-[var(--container-color)]"
          onClick={handleToggleSound}
          aria-label={soundMuted ? "Włącz dźwięk" : "Wycisz dźwięk"}
        >
          {soundMuted ? '🔇' : '🔊'}
        </button>
        
        {/* Timer Circle */}
        <div className="relative flex items-center justify-center">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="58"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="12"
              fill="none"
            />
            <circle
              cx="64"
              cy="64"
              r="58"
              stroke={timeRemaining <= 30 ? "var(--accent)" : "var(--primary)"}
              strokeWidth="12"
              strokeDasharray="364.4"
              strokeDashoffset={364.4 - (364.4 * calculateProgress() / 100)}
              strokeLinecap="round"
              fill="none"
              className={timeRemaining <= 10 ? "animate-pulse" : ""}
            />
          </svg>
          <div className="absolute text-3xl font-bold">{formatTime(timeRemaining)}</div>
        </div>
        
        {/* Current Task */}
        <AnimatePresence mode="wait">
          {currentTask && (
            <motion.div 
              key={currentTask.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="card w-full max-w-lg my-6 p-6"
            >
              <div className="text-sm mb-2 text-[var(--accent)]">
                {getTaskTarget(currentTask.players)}
              </div>
              <h3 className="text-2xl font-bold mb-4">{currentTask.content}</h3>
              <div className="text-sm mb-4 text-[var(--text-gray)]">
                Poziom trudności: {Array(currentTask.difficulty).fill('★').join('')}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
          <button 
            className="btn btn-primary flex-1"
            onClick={handleCompleteTask}
          >
            Wykonane!
          </button>
          <button 
            className="btn btn-outline flex-1"
            onClick={handleSkipTask}
          >
            Pomiń
          </button>
        </div>
        
        {/* End Game Button */}
        <button 
          className="btn btn-outline border-red-500 text-red-500 hover:bg-red-500 mt-8"
          onClick={handleEndGame}
        >
          Zakończ Grę
        </button>
      </div>
    </motion.div>
  );
} 