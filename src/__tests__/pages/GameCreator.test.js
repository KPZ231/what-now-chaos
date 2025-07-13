import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import GameCreator from '../../app/play/GameCreator';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}));

describe('GameCreator Component', () => {
  const mockOnStartGame = jest.fn();
  const mockUser = null;
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('renders all game modes', () => {
    render(<GameCreator onStartGame={mockOnStartGame} user={mockUser} />);
    
    expect(screen.getByText('Soft')).toBeInTheDocument();
    expect(screen.getByText('Chaos')).toBeInTheDocument();
    expect(screen.getByText('Hardcore')).toBeInTheDocument();
    expect(screen.getByText('Szybki')).toBeInTheDocument();
  });
  
  test('renders premium indicator for premium modes', () => {
    render(<GameCreator onStartGame={mockOnStartGame} user={mockUser} />);
    
    // Find PRO tags next to premium modes
    const proTags = screen.getAllByText('PRO');
    expect(proTags.length).toBe(2);
  });
  
  test('allows selecting soft and chaos modes without premium', () => {
    render(<GameCreator onStartGame={mockOnStartGame} user={mockUser} />);
    
    // Should be able to select soft mode
    const softLabel = screen.getByText('Soft').closest('label');
    fireEvent.click(softLabel);
    
    // Should be able to select chaos mode
    const chaosLabel = screen.getByText('Chaos').closest('label');
    fireEvent.click(chaosLabel);
  });
  
  test('submitting form calls onStartGame', () => {
    render(<GameCreator onStartGame={mockOnStartGame} user={mockUser} />);
    
    // Submit form
    const submitButton = screen.getByText('Rozpocznij grę');
    fireEvent.click(submitButton);
    
    // Check if onStartGame was called with default params
    expect(mockOnStartGame).toHaveBeenCalledWith({
      mode: 'soft',
      playerCount: 4,
      timerMinutes: 5,
      useFreeTrial: false
    });
  });
  
  test('enables premium modes for premium users', () => {
    // Mock a premium user
    const premiumUser = { hasPremium: true, name: 'Premium User' };
    
    render(<GameCreator onStartGame={mockOnStartGame} user={premiumUser} />);
    
    // Select hardcore mode (premium)
    const hardcoreLabel = screen.getByText('Hardcore').closest('label');
    fireEvent.click(hardcoreLabel);
    
    // Submit form
    const submitButton = screen.getByText('Rozpocznij grę');
    fireEvent.click(submitButton);
    
    // onStartGame should have been called
    expect(mockOnStartGame).toHaveBeenCalledWith({
      mode: 'hardcore',
      playerCount: 4,
      timerMinutes: 5,
      useFreeTrial: false
    });
  });
  
  test('toggles multiplayer mode', () => {
    render(<GameCreator onStartGame={mockOnStartGame} user={mockUser} />);
    
    // Initially not in multiplayer mode
    expect(screen.queryByText('Twój nick w grze')).not.toBeInTheDocument();
    
    // Toggle multiplayer mode on
    const multiplayerLabel = screen.getByText('Tryb multiplayer');
    fireEvent.click(multiplayerLabel);
    
    // Nickname field should appear for non-logged in users
    expect(screen.getByPlaceholderText('Wprowadź swój nick')).toBeInTheDocument();
  });
}); 