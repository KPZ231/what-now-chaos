"use client";

import { useState, useEffect } from 'react';

/**
 * Custom hook to detect if the app is running in PWA mode (installed on device)
 * and provide PWA-related utilities
 * 
 * @returns {Object} PWA status and related utilities
 */
export function usePWA() {
  const [isPWA, setIsPWA] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installable, setInstallable] = useState(false);
  
  useEffect(() => {
    // Check if running as PWA in standalone mode
    const checkPWAMode = () => {
      const isStandalone = 
        window.matchMedia('(display-mode: standalone)').matches || 
        window.matchMedia('(display-mode: fullscreen)').matches ||
        window.navigator.standalone === true;
      
      setIsStandalone(isStandalone);
      
      // Consider it a PWA if in standalone mode
      setIsPWA(isStandalone);
    };
    
    // Listen for app install event
    const handleBeforeInstallPrompt = (event) => {
      // Prevent default browser install prompt
      event.preventDefault();
      
      // Save the event for later use
      setDeferredPrompt(event);
      
      // App can be installed
      setInstallable(true);
    };
    
    // Listen for app install completed
    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setInstallable(false);
      setIsPWA(true);
      
      // Optionally show a message or track the installation
      console.log('PWA installed successfully!');
    };
    
    // Check if service worker is registered
    const checkServiceWorker = () => {
      return 'serviceWorker' in navigator;
    };
    
    // Initialize
    checkPWAMode();
    
    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    
    // Display mode change detection
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = (event) => {
      setIsStandalone(event.matches);
      if (event.matches) setIsPWA(true);
    };
    mediaQuery.addEventListener('change', handleDisplayModeChange);
    
    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      mediaQuery.removeEventListener('change', handleDisplayModeChange);
    };
  }, []);
  
  /**
   * Show installation prompt for PWA
   * @returns {Promise<boolean>} Whether installation was accepted
   */
  const promptInstall = async () => {
    if (!deferredPrompt) {
      console.log('Cannot install: No installation prompt available');
      return false;
    }
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const choiceResult = await deferredPrompt.userChoice;
    
    // Clear the saved prompt since it can only be used once
    setDeferredPrompt(null);
    setInstallable(false);
    
    // Check if installation was accepted
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the PWA installation');
      return true;
    } else {
      console.log('User dismissed the PWA installation');
      return false;
    }
  };
  
  /**
   * Check if app is compatible with PWA installation
   * @returns {boolean} Whether the app can be installed
   */
  const isPWASupported = () => {
    return 'serviceWorker' in navigator && 
           window.matchMedia('(display-mode: browser)').matches &&
           !isStandalone;
  };
  
  return {
    isPWA,
    isStandalone,
    installable,
    promptInstall,
    isPWASupported
  };
} 