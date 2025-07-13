"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
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
  const [decrementedFreeTrial, setDecrementedFreeTrial] = useState(false);
  
  // Refs to track timer warning sound
  const hasPlayedWarningRef = useRef(false);
  const sessionStartTimeRef = useRef(Date.now());
  
  // Load initial sound mute state and preload sounds
  useEffect(() => {
    setSoundMuted(isSoundMuted());
    preloadSounds();
  }, []);
  
  // Select a random task
  const selectRandomTask = useCallback((taskList) => {
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
  }, [taskHistory]);

  // Load tasks based on selected game mode
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // Check if we're using premium mode
        const isPremiumMode = ['hardcore', 'quick'].includes(config.mode);

        // If using premium mode with free trial, check access
        if (isPremiumMode && config.useFreeTrial) {
          // This is a premium mode with free trial usage
          console.log('Using free trial for premium mode:', config.mode);
        }
        
        // Load task data from JSON file
        const response = await fetch(`/data/tasks-${config.mode}.json`);
        if (!response.ok) throw new Error(`Failed to load tasks for mode: ${config.mode}`);
        
        const data = await response.json();
        
        // Process tasks
        const processedTasks = data.tasks.map((task, index) => ({
          ...task,
          id: `${config.mode}-${index}` // Generate deterministic ID
        }));
        
        setTasks(processedTasks);
        
        // Select first task
        if (processedTasks.length > 0) {
          selectRandomTask(processedTasks);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading tasks:', error);
        // Set default tasks in case of error
        const fallbackTasks = [
          { id: 'fallback-1', content: 'Wszyscy gracze klaszczą 3 razy', type: 'all' },
          { id: 'fallback-2', content: 'Opowiedz krótką historię', type: 'one' },
        ];
        setTasks(fallbackTasks);
        setCurrentTask(fallbackTasks[0]);
        setIsLoading(false);
      }
    };
    
    fetchTasks();
  }, [config.mode, selectRandomTask, config.useFreeTrial]);

  // Timer effect
  useEffect(() => {
    // Skip timer setup if game is over or still loading
    if (isGameOver || isLoading || !currentTask) return;
    
    const timerInterval = setInterval(() => {
      setTimeRemaining((prevTime) => {
        // Play warning sound at 30 seconds
        if (prevTime === 30 && !soundMuted) {
          if (!hasPlayedWarningRef.current) {
            playSound('timer-warning');
            hasPlayedWarningRef.current = true;
          }
        }
        
        // Time's up
        if (prevTime <= 1) {
          clearInterval(timerInterval);
          if (!soundMuted) {
            playSound('timer-expire');
          }
          
          // Reset warning flag
          hasPlayedWarningRef.current = false;
          
          // Get next task
          const nextTask = getNextTask();
          
          // Reset timer
          return config.timerMinutes * 60;
        }
        
        return prevTime - 1;
      });
    }, 1000);
    
    return () => clearInterval(timerInterval);
  }, [currentTask, isGameOver, isLoading, soundMuted, config.timerMinutes]);

  // Handle task completion
  const completeTask = () => {
    if (!currentTask || isGameOver) return;
    
    // Play sound
    if (!soundMuted) {
      playSound('task-complete');
    }
    
    // Add to history
    setTaskHistory(prev => [
      ...prev, 
      { ...currentTask, completed: true, timestamp: Date.now() }
    ]);
    
    // Update stats
    setStats(prev => ({
      ...prev,
      completedTasks: prev.completedTasks + 1
    }));
    
    // Get next task
    getNextTask();
    
    // Reset timer
    setTimeRemaining(config.timerMinutes * 60);
    
    // Reset warning flag
    hasPlayedWarningRef.current = false;
  };

  // Handle task skip
  const skipTask = () => {
    if (!currentTask || isGameOver) return;
    
    // Play sound
    if (!soundMuted) {
      playSound('task-skip');
    }
    
    // Add to history
    setTaskHistory(prev => [
      ...prev, 
      { ...currentTask, skipped: true, timestamp: Date.now() }
    ]);
    
    // Update stats
    setStats(prev => ({
      ...prev,
      skippedTasks: prev.skippedTasks + 1
    }));
    
    // Get next task
    getNextTask();
    
    // Reset timer
    setTimeRemaining(config.timerMinutes * 60);
    
    // Reset warning flag
    hasPlayedWarningRef.current = false;
  };

  // Get next task
  const getNextTask = () => {
    selectRandomTask(tasks);
  };
  
  // Handle toggling sound mute
  const handleToggleSound = () => {
    const newMuteState = toggleSoundMute();
    setSoundMuted(newMuteState);
  };
  
  // Handle ending the game and saving to localStorage
  const handleEndGame = async () => {
    setIsGameOver(true);
    
    // Check if we need to decrement free trial count
    if (config.useFreeTrial && !decrementedFreeTrial) {
      try {
        const response = await fetch('/api/user/premium/decrement-trial', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        
        if (response.ok) {
          setDecrementedFreeTrial(true);
          console.log('Decremented free trial count');
        }
      } catch (error) {
        console.error('Error decrementing free trial count:', error);
      }
    }
    
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="flex flex-col items-center">
        {/* Game Header */}
        <div className="w-full flex justify-between items-center mb-6">
          <div>
            <span className="font-medium text-sm capitalize">{config.mode}</span>
            <div className="text-sm text-[var(--text-gray)]">{config.playerCount} graczy</div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleToggleSound} 
              className="btn btn-sm btn-outline"
            >
              {soundMuted ? 'Dźwięk Wyłączony' : 'Dźwięk Włączony'}
            </button>
            
            <button 
              onClick={handleEndGame} 
              className="btn btn-sm btn-error"
            >
              Zakończ
            </button>
          </div>
        </div>
        
        {/* Timer */}
        <div className="w-full flex flex-col items-center mb-8">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle 
                cx="64" 
                cy="64" 
                r="60"
                fill="transparent"
                stroke="var(--border-color)"
                strokeWidth="8"
              />
              <circle 
                cx="64" 
                cy="64" 
                r="60"
                fill="transparent"
                stroke="var(--primary)"
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 60}`}
                strokeDashoffset={`${2 * Math.PI * 60 * (1 - calculateProgress() / 100)}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
              {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
            </div>
          </div>
        </div>
        
        {/* Current Task */}
        <AnimatePresence mode="wait">
          {currentTask && (
            <motion.div
              key={currentTask.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="card p-6 w-full mb-8"
            >
              <div className="mb-4 text-sm">
                <span className="inline-block py-1 px-3 rounded-full bg-[var(--primary-light)] text-[var(--primary)]">
                  {getTaskTarget(currentTask.type)}
                </span>
              </div>
              
              <h2 className="text-2xl font-bold mb-6">
                {currentTask.content}
              </h2>
              
              <div className="flex justify-between">
                <button 
                  onClick={skipTask}
                  className="btn btn-outline"
                >
                  Pomiń
                </button>
                
                <button 
                  onClick={completeTask}
                  className="btn btn-primary"
                >
                  Wykonane
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Stats */}
        <div className="w-full card p-6">
          <h3 className="text-lg font-bold mb-4">Statystyki</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-[var(--text-gray)]">Ukończone zadania</div>
              <div className="text-xl font-bold">{stats.completedTasks}</div>
            </div>
            <div>
              <div className="text-sm text-[var(--text-gray)]">Pominięte zadania</div>
              <div className="text-xl font-bold">{stats.skippedTasks}</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 