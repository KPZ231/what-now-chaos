"use client";

const STORAGE_KEY = 'whatnow_game_history';
const MAX_SESSIONS = 10; // Maximum number of stored game sessions

/**
 * Saves a completed game session to localStorage
 * @param {Object} gameSession - The game session data to save
 */
export function saveGameSession(gameSession) {
  if (typeof window === 'undefined') return;
  
  try {
    // Get existing history
    const existingHistory = getGameHistory();
    
    // Add timestamp if not present
    if (!gameSession.endTime) {
      gameSession.endTime = Date.now();
    }
    
    // Add session ID if not present
    if (!gameSession.sessionId) {
      gameSession.sessionId = generateSessionId();
    }
    
    // Add the new session to the beginning
    const updatedHistory = [gameSession, ...existingHistory];
    
    // Keep only the most recent MAX_SESSIONS
    const trimmedHistory = updatedHistory.slice(0, MAX_SESSIONS);
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedHistory));
    
    return true;
  } catch (error) {
    console.error('Error saving game session:', error);
    return false;
  }
}

/**
 * Retrieves all saved game sessions from localStorage
 * @returns {Array} Array of game session objects
 */
export function getGameHistory() {
  if (typeof window === 'undefined') return [];
  
  try {
    const historyString = localStorage.getItem(STORAGE_KEY);
    if (!historyString) return [];
    
    const history = JSON.parse(historyString);
    return Array.isArray(history) ? history : [];
  } catch (error) {
    console.error('Error retrieving game history:', error);
    return [];
  }
}

/**
 * Retrieves a specific game session by ID
 * @param {string} sessionId - The ID of the session to retrieve
 * @returns {Object|null} The game session or null if not found
 */
export function getGameSession(sessionId) {
  if (typeof window === 'undefined') return null;
  
  try {
    const history = getGameHistory();
    return history.find(session => session.sessionId === sessionId) || null;
  } catch (error) {
    console.error('Error retrieving game session:', error);
    return null;
  }
}

/**
 * Clears all game history from localStorage
 * @returns {boolean} Success status
 */
export function clearGameHistory() {
  if (typeof window === 'undefined') return false;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing game history:', error);
    return false;
  }
}

/**
 * Generates a unique session ID
 * @returns {string} A unique session ID
 */
function generateSessionId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

/**
 * Exports a game session to JSON file for download
 * @param {string} sessionId - ID of the session to export
 * @returns {boolean} Success status
 */
export function exportGameSession(sessionId) {
  if (typeof window === 'undefined') return false;
  
  try {
    const session = getGameSession(sessionId);
    if (!session) return false;
    
    const dataStr = JSON.stringify(session, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileName = `whatnow-session-${session.mode}-${new Date(session.endTime).toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileName);
    linkElement.click();
    
    return true;
  } catch (error) {
    console.error('Error exporting game session:', error);
    return false;
  }
} 