"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function PremiumStatus({ user }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Check if user has premium
  const hasPremium = user && user.hasPremium;
  
  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return 'Nie dotyczy';
    
    const date = new Date(dateString);
    return date.toLocaleString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  // Get days left until premium expires
  const getDaysLeft = () => {
    if (!user || !user.premiumExpiry) return 0;
    
    const expiry = new Date(user.premiumExpiry);
    const now = new Date();
    const diffTime = expiry - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };
  
  // Get plan display name
  const getPlanName = () => {
    if (!user || !user.premiumPlan) return '';
    
    const plans = {
      monthly: 'Miesięczny',
      yearly: 'Roczny',
      lifetime: 'Dożywotni'
    };
    
    return plans[user.premiumPlan] || user.premiumPlan;
  };
  
  // Is plan lifetime?
  const isLifetimePlan = user && user.premiumPlan === 'lifetime';
  
  // Days left until expiry
  const daysLeft = getDaysLeft();
  
  return (
    <motion.div 
      className="w-full card overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {hasPremium ? (
        <>
          <div className="bg-gradient-to-r from-yellow-600 to-amber-500 text-black p-4 flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-xl mr-2">👑</span>
              <div>
                <h3 className="font-bold text-lg">Premium Aktywne</h3>
                <p className="text-sm opacity-80">Plan: {getPlanName()}</p>
              </div>
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-black bg-white/20 hover:bg-white/30 transition-colors px-3 py-1 rounded-full text-sm font-medium"
            >
              {isExpanded ? 'Zwiń' : 'Szczegóły'}
            </button>
          </div>
          
          {isExpanded && (
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-[var(--text-gray)]">Plan</h4>
                  <p>{getPlanName()}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-[var(--text-gray)]">Status</h4>
                  <p>Aktywny</p>
                </div>
                
                {!isLifetimePlan && (
                  <>
                    <div>
                      <h4 className="text-sm font-medium text-[var(--text-gray)]">Data wygaśnięcia</h4>
                      <p>{formatDate(user.premiumExpiry)}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-[var(--text-gray)]">Pozostało dni</h4>
                      <p>{daysLeft}</p>
                    </div>
                  </>
                )}
              </div>
              
              <h4 className="font-medium mt-4">Dostępne funkcje premium:</h4>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>Wszystkie tryby gry (Hardcore i Quick)</li>
                <li>Ekskluzywne pakiety zadań</li>
                <li>Personalizacja zadań i UI</li>
                <li>Eksport sesji jako PDF</li>
                <li>Tryb AI generujący zadania</li>
              </ul>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Konto Standardowe</h3>
              <span className="text-sm text-[var(--text-gray)]">Bez premium</span>
            </div>
            
            <p className="text-[var(--text-gray)] mb-6">
              Odblokuj wszystkie tryby gry i dodatkowe funkcje z kontem premium.
            </p>
            
            <Link href="/premium" className="btn btn-primary w-full">
              Przejdź na Premium
            </Link>
          </div>
        </>
      )}
    </motion.div>
  );
} 