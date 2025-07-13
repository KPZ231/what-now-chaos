/**
 * @jest-environment jsdom
 */

import { registerServiceWorker, unregisterServiceWorker } from '../../lib/service-worker';

// Mock service worker registration
const mockRegister = jest.fn();
const mockUnregister = jest.fn();

// Mock navigator.serviceWorker
Object.defineProperty(window, 'navigator', {
  value: {
    serviceWorker: {
      register: mockRegister,
      getRegistrations: jest.fn().mockResolvedValue([
        { unregister: mockUnregister }
      ])
    }
  },
  writable: true
});

describe('Service Worker Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('registerServiceWorker calls navigator.serviceWorker.register', async () => {
    mockRegister.mockResolvedValue({ scope: '/app/' });
    
    const result = await registerServiceWorker();
    
    expect(mockRegister).toHaveBeenCalledWith('/service-worker.js', { scope: '/' });
    expect(result).toEqual({ scope: '/app/' });
  });
  
  test('registerServiceWorker handles errors', async () => {
    mockRegister.mockRejectedValue(new Error('Registration failed'));
    
    const result = await registerServiceWorker();
    
    expect(mockRegister).toHaveBeenCalled();
    expect(result).toBe(null);
  });
  
  test('unregisterServiceWorker calls unregister on all registrations', async () => {
    await unregisterServiceWorker();
    
    expect(mockUnregister).toHaveBeenCalled();
  });
  
  test('unregisterServiceWorker handles errors', async () => {
    const mockGetRegistrations = window.navigator.serviceWorker.getRegistrations;
    mockGetRegistrations.mockRejectedValue(new Error('Unregister failed'));
    
    await unregisterServiceWorker();
    
    expect(mockGetRegistrations).toHaveBeenCalled();
    expect(mockUnregister).not.toHaveBeenCalled();
  });
}); 