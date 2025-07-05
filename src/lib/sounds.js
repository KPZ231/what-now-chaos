"use client";

// Dictionary of sound effects
const soundEffects = {
  taskAppear: "/sounds/task-appear.mp3",
  taskComplete: "/sounds/task-complete.mp3", 
  taskSkip: "/sounds/task-skip.mp3",
  timerWarning: "/sounds/timer-warning.mp3",
  timerExpire: "./sounds/timer-expire.mp3"
};

// Audio objects cache
let audioCache = {};

/**
 * Preloads sound effects for better performance
 */
export function preloadSounds() {
  if (typeof window === 'undefined') return;
  
  Object.entries(soundEffects).forEach(([key, path]) => {
    const audio = new Audio(path);
    audio.preload = 'auto';
    audioCache[key] = audio;
  });
}

/**
 * Plays a sound effect
 * @param {string} soundName - The name of the sound to play
 * @param {number} volume - Volume level from 0 to 1
 */
export function playSound(soundName, volume = 1) {
  if (typeof window === 'undefined') return;
  
  // Check if sound is muted in localStorage
  const soundMuted = localStorage.getItem('whatnow_sound_muted') === 'true';
  if (soundMuted) return;

  try {
    // Use cached audio if available
    if (audioCache[soundName]) {
      const audio = audioCache[soundName];
      audio.volume = volume;
      audio.currentTime = 0;
      audio.play().catch(err => console.error("Error playing sound:", err));
      return;
    }
    
    // Create new audio if not cached
    if (soundEffects[soundName]) {
      const audio = new Audio(soundEffects[soundName]);
      audio.volume = volume;
      audio.play().catch(err => console.error("Error playing sound:", err));
      audioCache[soundName] = audio;
    } else {
      console.warn(`Sound effect "${soundName}" not found.`);
    }
  } catch (error) {
    console.error("Error playing sound:", error);
  }
}

/**
 * Toggle sound mute state
 * @returns {boolean} The new mute state
 */
export function toggleSoundMute() {
  if (typeof window === 'undefined') return false;
  
  const currentState = localStorage.getItem('whatnow_sound_muted') === 'true';
  const newState = !currentState;
  
  localStorage.setItem('whatnow_sound_muted', newState.toString());
  return newState;
}

/**
 * Get current sound mute state
 * @returns {boolean} Whether sound is muted
 */
export function isSoundMuted() {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('whatnow_sound_muted') === 'true';
} 