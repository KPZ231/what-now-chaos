import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import InstallPWA from '../../app/components/InstallPWA';

// Mock usePWA hook
jest.mock('../../lib/usePWA', () => {
  const mockPromptInstall = jest.fn().mockResolvedValue(true);
  
  return {
    usePWA: jest.fn().mockReturnValue({
      installable: true,
      isPWA: false,
      isStandalone: false,
      promptInstall: mockPromptInstall,
    }),
    mockPromptInstall, // Export for testing
  };
});

describe('InstallPWA Component', () => {
  beforeEach(() => {
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => null),
        setItem: jest.fn(),
      },
      writable: true
    });

    // Mock setTimeout
    jest.useFakeTimers();
    
    // Reset mocks
    const { usePWA } = require('../../lib/usePWA');
    usePWA.mockReturnValue({
      installable: true,
      isPWA: false,
      isStandalone: false,
      promptInstall: jest.fn().mockResolvedValue(true),
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('renders install button when PWA can be installed', () => {
    render(<InstallPWA />);
    
    // Initially it should not show (there's a timeout)
    expect(screen.queryByText(/zainstaluj teraz/i)).not.toBeInTheDocument();
    
    // Advance timers to trigger the prompt
    act(() => {
      jest.advanceTimersByTime(10000);
    });
    
    // Now it should be visible
    expect(screen.getByText(/zainstaluj teraz/i)).toBeInTheDocument();
  });

  test('clicking install button calls promptInstall function', async () => {
    const mockPromptInstall = jest.fn().mockResolvedValue(true);
    const { usePWA } = require('../../lib/usePWA');
    
    // Override the mock for this test
    usePWA.mockReturnValue({
      installable: true,
      isPWA: false,
      isStandalone: false,
      promptInstall: mockPromptInstall,
    });
    
    render(<InstallPWA />);
    
    // Advance timers to trigger the prompt
    act(() => {
      jest.advanceTimersByTime(10000);
    });
    
    // Click the install button
    const installButton = screen.getByText(/zainstaluj teraz/i);
    await act(async () => {
      fireEvent.click(installButton);
    });
    
    expect(mockPromptInstall).toHaveBeenCalled();
  });

  test('does not render when PWA cannot be installed', () => {
    const { usePWA } = require('../../lib/usePWA');
    
    // Override the mock for this test
    usePWA.mockReturnValue({
      installable: false,
      isPWA: false,
      isStandalone: false,
      promptInstall: jest.fn(),
    });
    
    render(<InstallPWA />);
    
    // Advance timers
    act(() => {
      jest.advanceTimersByTime(10000);
    });
    
    // Should not render anything
    expect(screen.queryByText(/zainstaluj/i)).not.toBeInTheDocument();
  });
}); 