"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function PremiumStatus({ user }) {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  useEffect(() => {
    if (!user?.premiumExpiresAt) return;
    
    const calculateTimeRemaining = () => {
      const now = new Date();
      const expiryDate = new Date(user.premiumExpiresAt);
      const diff = expiryDate - now;
      
      if (diff <= 0) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        };
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      return { days, hours, minutes, seconds };
    };
    
    // Update immediately
    setTimeRemaining(calculateTimeRemaining());
    
    // Then update every second
    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);
    
    return () => clearInterval(timer);
  }, [user?.premiumExpiresAt]);
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  if (!user) return null;
  
  // User doesn't have premium
  if (!user.hasPremium) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card p-6"
      >
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Status Premium</h2>
          <p className="text-[var(--text-gray)] mb-6">
            Nie masz jeszcze subskrypcji premium. Odblokuj wszystkie funkcje i tryby gry!
          </p>
          <Link href="/premium" className="btn btn-primary">
            Kup Premium
          </Link>
        </div>
      </motion.div>
    );
  }
  
  // User has premium
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card p-6"
    >
      <div className="text-center mb-6">
        <div className="inline-block mb-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-4 py-2 rounded-full font-bold">
          PREMIUM
        </div>
        <h2 className="text-xl font-bold mb-2">Status Premium Aktywny</h2>
        <p className="text-[var(--text-gray)]">
          Dziękujemy za wsparcie! Masz dostęp do wszystkich funkcji premium.
        </p>
      </div>
      
      <div className="border-t border-b border-[var(--border-color)] py-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-[var(--text-gray)]">Data aktywacji</p>
            <p className="font-medium">{formatDate(user.premiumStartedAt)}</p>
          </div>
          <div>
            <p className="text-sm text-[var(--text-gray)]">Data wygaśnięcia</p>
            <p className="font-medium">{formatDate(user.premiumExpiresAt)}</p>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-center">Pozostały czas</h3>
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-[var(--container-color)]/50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold">{timeRemaining.days}</div>
            <div className="text-xs text-[var(--text-gray)]">dni</div>
          </div>
          <div className="bg-[var(--container-color)]/50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold">{timeRemaining.hours}</div>
            <div className="text-xs text-[var(--text-gray)]">godz</div>
          </div>
          <div className="bg-[var(--container-color)]/50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold">{timeRemaining.minutes}</div>
            <div className="text-xs text-[var(--text-gray)]">min</div>
          </div>
          <div className="bg-[var(--container-color)]/50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold">{timeRemaining.seconds}</div>
            <div className="text-xs text-[var(--text-gray)]">sek</div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center">
        <Link href="/premium" className="btn btn-outline">
          Przedłuż Subskrypcję
        </Link>
      </div>
    </motion.div>
  );
} 