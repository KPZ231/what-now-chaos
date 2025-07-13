import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Game from '../../app/play/Game';

// Mock sounds library
jest.mock('../../lib/sounds', () => ({
  playSound: jest.fn(),
  preloadSounds: jest.fn(),
  toggleSoundMute: jest.fn().mockReturnValue(false),
  isSoundMuted: jest.fn().mockReturnValue(false),
}));

// Mock gameStorage
jest.mock('../../lib/gameStorage', () => ({
  saveGameSession: jest.fn(),
}));

describe('Game Component', () => {
  const mockConfig = {
    mode: 'soft',
    playerCount: 4,
    timerMinutes: 2,
    useFreeTrial: false,
  };
  
  const mockTasks = {
    tasks: [
      { content: 'Zadanie 1', type: 'all' },
      { content: 'Zadanie 2', type: 'one' },
      { content: 'Zadanie 3', type: 'all' },
    ]
  };
  
  const mockOnEndGame = jest.fn();
  
  beforeEach(() => {
    jest.useFakeTimers();
    
    // Mock fetch
    global.fetch = jest.fn().mockImplementation(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockTasks)
      })
    );
  });
  
  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });
  
  test('loads tasks and displays timer', async () => {
    // Render the component
    let component;
    await act(async () => {
      component = render(<Game config={mockConfig} onEndGame={mockOnEndGame} />);
    });
    
    // Wait for fetch to complete
    await act(async () => {
      await Promise.resolve();
    });
    
    // Check that timer is displayed
    expect(screen.getByText('2:00')).toBeInTheDocument();
  });
  
  test('handles task completion', async () => {
    const { playSound } = require('../../lib/sounds');
    
    // Render the component
    await act(async () => {
      render(<Game config={mockConfig} onEndGame={mockOnEndGame} />);
    });
    
    // Wait for fetch to complete
    await act(async () => {
      await Promise.resolve();
    });
    
    // Find and click the complete button
    const completeButton = screen.getByText('Wykonane');
    await act(async () => {
      fireEvent.click(completeButton);
    });
    
    // Check that sound was played
    expect(playSound).toHaveBeenCalledWith('task-complete');
  });
  
  test('handles task skipping', async () => {
    const { playSound } = require('../../lib/sounds');
    
    // Render the component
    await act(async () => {
      render(<Game config={mockConfig} onEndGame={mockOnEndGame} />);
    });
    
    // Wait for fetch to complete
    await act(async () => {
      await Promise.resolve();
    });
    
    // Find and click the skip button
    const skipButton = screen.getByText('Pomiń');
    await act(async () => {
      fireEvent.click(skipButton);
    });
    
    // Check that sound was played
    expect(playSound).toHaveBeenCalledWith('task-skip');
  });
  
  test('timer decrements correctly', async () => {
    // Render the component
    await act(async () => {
      render(<Game config={mockConfig} onEndGame={mockOnEndGame} />);
    });
    
    // Wait for fetch to complete
    await act(async () => {
      await Promise.resolve();
    });
    
    // Initial timer value (2 minutes = 120 seconds)
    expect(screen.getByText('2:00')).toBeInTheDocument();
    
    // Advance timer by 5 seconds
    await act(async () => {
      jest.advanceTimersByTime(5000);
    });
    
    // Timer should now show 1:55
    expect(screen.getByText('1:55')).toBeInTheDocument();
  });
  
  test('handles errors when loading tasks', async () => {
    // Mock failed fetch
    global.fetch = jest.fn().mockImplementation(() => 
      Promise.reject(new Error('Failed to load'))
    );
    
    // Render the component
    await act(async () => {
      render(<Game config={mockConfig} onEndGame={mockOnEndGame} />);
    });
    
    // Wait for fetch to complete
    await act(async () => {
      await Promise.resolve();
    });
    
    // Should still render a task (fallback)
    expect(screen.getByText('Wszyscy gracze klaszczą 3 razy')).toBeInTheDocument();
  });
}); 