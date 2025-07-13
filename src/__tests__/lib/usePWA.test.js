import { renderHook, act } from '@testing-library/react';
import { usePWA } from '../../lib/usePWA';

describe('usePWA Hook', () => {
  const originalMatchMedia = window.matchMedia;
  const originalAddEventListener = window.addEventListener;
  const originalRemoveEventListener = window.removeEventListener;

  // Mock event listeners
  let beforeInstallPromptCallback;
  let appInstalledCallback;

  beforeEach(() => {
    // Mock matchMedia
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: query === '(display-mode: standalone)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    // Mock event listeners
    window.addEventListener = jest.fn((event, callback) => {
      if (event === 'beforeinstallprompt') {
        beforeInstallPromptCallback = callback;
      } else if (event === 'appinstalled') {
        appInstalledCallback = callback;
      }
    });

    window.removeEventListener = jest.fn();
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    window.addEventListener = originalAddEventListener;
    window.removeEventListener = originalRemoveEventListener;
  });

  test('should detect standalone mode', () => {
    const { result } = renderHook(() => usePWA());
    
    expect(result.current.isStandalone).toBe(true);
    expect(result.current.isPWA).toBe(true);
  });

  test('should handle beforeinstallprompt event', () => {
    const { result } = renderHook(() => usePWA());
    
    // Initially not installable
    expect(result.current.installable).toBe(false);
    
    // Simulate beforeinstallprompt event
    const mockEvent = {
      preventDefault: jest.fn(),
      prompt: jest.fn(),
      userChoice: Promise.resolve({ outcome: 'accepted' })
    };
    
    act(() => {
      beforeInstallPromptCallback(mockEvent);
    });
    
    // Should be installable after event
    expect(result.current.installable).toBe(true);
  });

  test('should handle app installation', async () => {
    const { result } = renderHook(() => usePWA());
    
    // Simulate beforeinstallprompt event
    const mockEvent = {
      preventDefault: jest.fn(),
      prompt: jest.fn(),
      userChoice: Promise.resolve({ outcome: 'accepted' })
    };
    
    act(() => {
      beforeInstallPromptCallback(mockEvent);
    });
    
    // Prompt for installation
    let installSuccess;
    await act(async () => {
      installSuccess = await result.current.promptInstall();
    });
    
    expect(mockEvent.prompt).toHaveBeenCalled();
    expect(installSuccess).toBe(true);
    expect(result.current.installable).toBe(false);
  });

  test('should detect when app is already installed', () => {
    // Mock standalone mode
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: query.includes('standalone') || query.includes('fullscreen'),
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }));
    
    const { result } = renderHook(() => usePWA());
    
    expect(result.current.isPWA).toBe(true);
    expect(result.current.isStandalone).toBe(true);
    expect(result.current.installable).toBe(false);
  });
}); 