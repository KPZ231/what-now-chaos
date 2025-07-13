/**
 * @jest-environment jsdom
 */

import {
  saveGameSession,
  getGameHistory,
  getGameSession,
  clearGameHistory,
  exportGameSession
} from '../../lib/gameStorage';

describe('Game Storage Functions', () => {
  // Mock localStorage
  let localStorageMock;
  
  beforeEach(() => {
    // Setup localStorage mock
    localStorageMock = {
      store: {},
      getItem: jest.fn(key => localStorageMock.store[key] || null),
      setItem: jest.fn((key, value) => {
        localStorageMock.store[key] = value.toString();
      }),
      removeItem: jest.fn(key => {
        delete localStorageMock.store[key];
      }),
      clear: jest.fn(() => {
        localStorageMock.store = {};
      })
    };
    
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    });
    
    // Mock document.createElement for export function
    document.createElement = jest.fn().mockImplementation(tag => {
      if (tag === 'a') {
        return {
          setAttribute: jest.fn(),
          click: jest.fn()
        };
      }
      return {};
    });
  });
  
  test('saveGameSession should save a session to localStorage', () => {
    const mockSession = {
      mode: 'soft',
      playerCount: 4,
      timerMinutes: 2,
      stats: {
        completedTasks: 5,
        skippedTasks: 2,
        totalDuration: 600
      },
      taskHistory: [
        { id: 'task-1', content: 'Test task 1', completed: true }
      ]
    };
    
    saveGameSession(mockSession);
    
    // Check that localStorage.setItem was called
    expect(localStorage.setItem).toHaveBeenCalled();
    
    // Verify the saved data
    const savedData = JSON.parse(localStorage.getItem('whatnow_game_history'));
    expect(savedData).toBeInstanceOf(Array);
    expect(savedData.length).toBe(1);
    expect(savedData[0].mode).toBe('soft');
    expect(savedData[0].sessionId).toBeDefined();
    expect(savedData[0].endTime).toBeDefined();
  });
  
  test('getGameHistory should retrieve sessions from localStorage', () => {
    // Setup test data
    const mockSessions = [
      {
        sessionId: 'session1',
        mode: 'soft',
        endTime: Date.now(),
        stats: { completedTasks: 5 }
      },
      {
        sessionId: 'session2',
        mode: 'chaos',
        endTime: Date.now() - 1000,
        stats: { completedTasks: 3 }
      }
    ];
    
    localStorage.setItem('whatnow_game_history', JSON.stringify(mockSessions));
    
    // Test retrieval
    const history = getGameHistory();
    
    expect(history).toBeInstanceOf(Array);
    expect(history.length).toBe(2);
    expect(history[0].sessionId).toBe('session1');
    expect(history[1].sessionId).toBe('session2');
  });
  
  test('getGameSession should retrieve a specific session by ID', () => {
    // Setup test data
    const mockSessions = [
      { sessionId: 'session1', mode: 'soft' },
      { sessionId: 'session2', mode: 'chaos' }
    ];
    
    localStorage.setItem('whatnow_game_history', JSON.stringify(mockSessions));
    
    // Test retrieval of specific session
    const session = getGameSession('session2');
    
    expect(session).toBeDefined();
    expect(session.sessionId).toBe('session2');
    expect(session.mode).toBe('chaos');
  });
  
  test('getGameSession should return null for non-existent session', () => {
    // Setup test data
    const mockSessions = [
      { sessionId: 'session1', mode: 'soft' }
    ];
    
    localStorage.setItem('whatnow_game_history', JSON.stringify(mockSessions));
    
    // Test retrieval of non-existent session
    const session = getGameSession('nonexistent');
    
    expect(session).toBeNull();
  });
  
  test('clearGameHistory should remove all sessions from localStorage', () => {
    // Setup test data
    localStorage.setItem('whatnow_game_history', JSON.stringify([{ sessionId: 'session1' }]));
    
    // Clear history
    const result = clearGameHistory();
    
    expect(result).toBe(true);
    expect(localStorage.removeItem).toHaveBeenCalledWith('whatnow_game_history');
  });
  
  test('exportGameSession should create a download link', () => {
    // Setup test data
    const mockSession = {
      sessionId: 'session1',
      mode: 'soft',
      endTime: new Date('2025-07-10').getTime()
    };
    
    localStorage.setItem('whatnow_game_history', JSON.stringify([mockSession]));
    
    // Test export
    const result = exportGameSession('session1');
    
    expect(result).toBe(true);
    expect(document.createElement).toHaveBeenCalledWith('a');
  });
  
  test('should limit history to maximum number of sessions', () => {
    // Create 12 mock sessions (more than the MAX_SESSIONS limit of 10)
    const mockSessions = Array.from({ length: 12 }, (_, i) => ({
      sessionId: `session${i}`,
      mode: 'soft',
      endTime: Date.now() - i * 1000
    }));
    
    // Save each session individually
    mockSessions.forEach(session => {
      saveGameSession(session);
    });
    
    // Get the history and check its length
    const history = getGameHistory();
    
    // Should be limited to 10 sessions (MAX_SESSIONS)
    expect(history.length).toBe(10);
    
    // First session should be the most recent one
    expect(history[0].sessionId).toBe('session11');
  });
}); 