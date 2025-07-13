/**
 * @jest-environment jsdom
 */

import { playSound, preloadSounds, toggleSoundMute, isSoundMuted } from '../../lib/sounds';

// Mock the Audio API
const mockAudioPlay = jest.fn().mockResolvedValue();
const mockAudio = {
  play: mockAudioPlay,
  preload: '',
  volume: 1,
  currentTime: 0
};

// Mock the global Audio constructor
global.Audio = jest.fn().mockImplementation(() => mockAudio);

describe('Sound Functions', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    
    // Reset mocks
    jest.clearAllMocks();
    
    // Spy on console methods
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
  });
  
  test('preloadSounds should create audio objects for all sound effects', () => {
    preloadSounds();
    
    // Should create 5 Audio objects (one for each sound effect)
    expect(global.Audio).toHaveBeenCalledTimes(5);
    
    // Should set preload to 'auto'
    expect(mockAudio.preload).toBe('auto');
  });
  
  test('playSound should play the specified sound', () => {
    // Use a valid sound name from the soundEffects object
    playSound('taskComplete');
    
    // Should call play method
    expect(mockAudioPlay).toHaveBeenCalled();
  });
  
  test('playSound should set the volume correctly', () => {
    playSound('taskComplete', 0.5);
    
    // Should set the volume
    expect(mockAudio.volume).toBe(0.5);
  });
  
  test('playSound should not play sound when muted', () => {
    // Set muted state in localStorage
    localStorage.setItem('whatnow_sound_muted', 'true');
    
    playSound('taskComplete');
    
    // Should not create Audio object or play sound
    expect(global.Audio).not.toHaveBeenCalled();
  });
  
  test('playSound should warn when sound not found', () => {
    playSound('nonExistentSound');
    
    // Should log a warning
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('not found'));
  });
  
  test('toggleSoundMute should toggle mute state', () => {
    // Initial state (unmuted)
    expect(localStorage.getItem('whatnow_sound_muted')).toBeNull();
    
    // Toggle to muted
    const firstToggleResult = toggleSoundMute();
    expect(firstToggleResult).toBe(true);
    expect(localStorage.getItem('whatnow_sound_muted')).toBe('true');
    
    // Toggle back to unmuted
    const secondToggleResult = toggleSoundMute();
    expect(secondToggleResult).toBe(false);
    expect(localStorage.getItem('whatnow_sound_muted')).toBe('false');
  });
  
  test('isSoundMuted should return correct mute state', () => {
    // Initial state (unmuted)
    expect(isSoundMuted()).toBe(false);
    
    // Set to muted
    localStorage.setItem('whatnow_sound_muted', 'true');
    expect(isSoundMuted()).toBe(true);
    
    // Set to unmuted
    localStorage.setItem('whatnow_sound_muted', 'false');
    expect(isSoundMuted()).toBe(false);
  });
}); 