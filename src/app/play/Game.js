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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center space-y-6 p-2 sm:p-6"
    >
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isGameOver ? 'bg-red-500' : 'bg-green-500'}`}></div>
          <span className="text-sm">{isGameOver ? 'Gra zakończona' : 'Gra aktywna'}</span>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={handleToggleSound}
            className="text-2xl hover:text-[var(--primary)] transition-colors"
            aria-label={soundMuted ? "Włącz dźwięk" : "Wycisz dźwięk"}
          >
            {soundMuted ? '🔇' : '🔊'}
          </button>
          
          <button 
            onClick={handleEndGame}
            className="px-4 py-1 rounded-full border border-red-500 text-red-500 hover:bg-red-500/20 transition-colors"
          >
            Zakończ grę
          </button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6 w-full">
        {/* Game info sidebar */}
        <div className="w-full md:w-1/3">
          <div className="card h-full">
            <h2 className="text-xl font-bold mb-4">Informacje o grze</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm text-[var(--text-gray)]">Tryb</h3>
                <p className="font-medium">{config.mode.charAt(0).toUpperCase() + config.mode.slice(1)}</p>
              </div>
              
              <div>
                <h3 className="text-sm text-[var(--text-gray)]">Liczba graczy</h3>
                <p className="font-medium">{config.playerCount}</p>
              </div>
              
              <div>
                <h3 className="text-sm text-[var(--text-gray)]">Czas na zadanie</h3>
                <p className="font-medium">{config.timerMinutes} min</p>
              </div>
              
              <div className="border-t border-[var(--border-color)] pt-4">
                <h3 className="text-sm text-[var(--text-gray)] mb-2">Statystyki</h3>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[var(--container-color)]/50 p-3 rounded-lg">
                    <div className="text-sm text-[var(--text-gray)]">Wykonane</div>
                    <div className="text-xl font-bold text-[var(--primary)]">{stats.completedTasks}</div>
                  </div>
                  
                  <div className="bg-[var(--container-color)]/50 p-3 rounded-lg">
                    <div className="text-sm text-[var(--text-gray)]">Pominięte</div>
                    <div className="text-xl font-bold text-[var(--accent)]">{stats.skippedTasks}</div>
                  </div>
                  
                  <div className="bg-[var(--container-color)]/50 p-3 rounded-lg col-span-2">
                    <div className="text-sm text-[var(--text-gray)]">Całkowity czas</div>
                    <div className="text-xl font-bold">{stats.totalTime} min</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main task area */}
        <div className="w-full md:w-2/3">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTask ? currentTask.id : 'loading'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="card relative"
            >
              {/* Timer */}
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
              
              {/* Task content */}
              <div className="pt-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-xs text-[var(--text-gray)]">Wyzwanie #{taskHistory.length + 1}</span>
                    <h2 className="text-2xl font-bold gradient-text">Losowe Wyzwanie</h2>
                  </div>
                  
                  {currentTask && currentTask.target && (
                    <div className="bg-[var(--primary)]/10 px-3 py-1 rounded-full">
                      <span className="text-sm font-medium text-[var(--primary)]">
                        {getTaskTarget(currentTask.target)}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="bg-[var(--container-color)]/50 p-6 rounded-lg mb-6 min-h-[120px] flex items-center justify-center">
                  <p className="text-xl sm:text-2xl text-center">
                    {currentTask ? currentTask.content : "Ładowanie zadania..."}
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={handleCompleteTask}
                    className="btn btn-primary flex-1"
                  >
                    Wykonane
                  </button>
                  <button 
                    onClick={handleSkipTask}
                    className="btn btn-outline flex-1"
                  >
                    Pomiń
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          
          {/* Recent history */}
          {taskHistory.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Ostatnie wyzwania</h3>
              <div className="space-y-2">
                {taskHistory.slice(-3).reverse().map((task, index) => (
                  <div 
                    key={`${task.id}-${index}`}
                    className={`p-3 rounded-lg border ${
                      task.completed 
                        ? 'border-green-500/30 bg-green-500/10' 
                        : task.expired
                          ? 'border-amber-500/30 bg-amber-500/10'
                          : 'border-red-500/30 bg-red-500/10'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <p className="text-sm">{task.content}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        task.completed 
                          ? 'bg-green-500/20 text-green-400' 
                          : task.expired
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-red-500/20 text-red-400'
                      }`}>
                        {task.completed 
                          ? 'Wykonane' 
                          : task.expired
                            ? 'Czas minął'
                            : 'Pominięte'
                        }
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
} 