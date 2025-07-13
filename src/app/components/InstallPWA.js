"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePWA } from '@/lib/usePWA';

export default function InstallPWA() {
  const { installable, promptInstall, isPWA, isStandalone } = usePWA();
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  
  useEffect(() => {
    // Show prompt if installable and not already a PWA
    // Also check localStorage to see if user has previously dismissed
    const checkPreviousDismissal = () => {
      const previouslyDismissed = localStorage.getItem('pwaPromptDismissed');
      // If no record found or it's been more than 7 days since dismissal
      if (!previouslyDismissed) {
        return false;
      }
      
      const dismissedTime = parseInt(previouslyDismissed, 10);
      const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
      
      return Date.now() - dismissedTime < sevenDaysInMs;
    };
    
    if (installable && !isPWA && !isStandalone && !dismissed && !checkPreviousDismissal()) {
      // Delay showing the prompt to not distract users immediately
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 10000); // Show after 10 seconds
      
      return () => clearTimeout(timer);
    }
  }, [installable, isPWA, isStandalone, dismissed]);
  
  const handleInstall = async () => {
    try {
      const result = await promptInstall();
      if (!result) {
        // User declined the installation
        handleDismiss();
      }
      // If installed, the appinstalled event will hide this prompt
    } catch (error) {
      console.error('Error during PWA installation:', error);
      handleDismiss();
    }
  };
  
  const handleDismiss = () => {
    setDismissed(true);
    setShowPrompt(false);
    // Save dismissal in localStorage
    localStorage.setItem('pwaPromptDismissed', Date.now().toString());
  };
  
  if (!showPrompt) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-4 left-4 right-4 z-50"
      >
        <div className="bg-[var(--container-color)] p-4 rounded-lg shadow-lg border border-[var(--primary)]/30 max-w-md mx-auto">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-[var(--primary)]">Zainstaluj WhatNow?!</h3>
            <button 
              onClick={handleDismiss} 
              className="text-[var(--text-gray)] hover:text-white"
              aria-label="Zamknij"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <p className="mb-4 text-sm">
            Zainstaluj aplikację WhatNow?! na swoim urządzeniu, aby korzystać z niej offline i uzyskać pełny dostęp do wszystkich funkcji, nawet bez połączenia z internetem.
          </p>
          
          <div className="flex justify-end space-x-3">
            <button 
              onClick={handleDismiss} 
              className="px-4 py-2 text-sm text-[var(--text-gray)] hover:text-white"
            >
              Później
            </button>
            <button 
              onClick={handleInstall} 
              className="px-4 py-2 text-sm bg-[var(--primary)] text-white rounded-md hover:opacity-90"
            >
              Zainstaluj teraz
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
} 