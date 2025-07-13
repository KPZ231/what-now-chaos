'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const hasAcceptedCookies = localStorage.getItem('cookiesAccepted');
    if (!hasAcceptedCookies) {
      setShowConsent(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setShowConsent(false);
  };

  return (
    <AnimatePresence>
      {showConsent && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gray-900/95 backdrop-blur-sm border-t-2 border-pink-500"
        >
          <div className="max-w-screen-lg mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-white text-sm sm:text-base">
              <p>Ta strona używa plików cookies, aby zapewnić najlepsze wrażenia. Kontynuując przeglądanie strony, wyrażasz zgodę na ich używanie.</p>
            </div>
            <div className="flex gap-2">
              <a href="/cookie-policy" className="text-pink-400 hover:text-pink-300 text-sm underline">
                Polityka Cookies
              </a>
              <button
                onClick={acceptCookies}
                className="bg-pink-600 hover:bg-pink-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Akceptuję
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 