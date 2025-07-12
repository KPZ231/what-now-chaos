"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import Link from 'next/link';
import Footer from "@/app/partial/footer";
import Navbar from "@/app/partial/navbar";
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_test_key');

export default function PremiumPage() {
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, isLoading, setUser, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  
  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
  };
  
  // Redirect authenticated users if they already have premium
  useEffect(() => {
    if (!isLoading && user && user.hasPremium) {
      router.push('/premium-advantages');
    }
  }, [user, isLoading, router]);
  
  // Handle premium purchase
  const handlePurchase = async (e) => {
    e.preventDefault();
    
    // Reset states
    setError(null);
    setSuccess(false);
    
    // If user is not logged in, redirect to login
    if (!user) {
      setIsRedirecting(true);
      // Store intended purchase in localStorage
      localStorage.setItem('intendedPurchase', selectedPlan);
      setTimeout(() => {
        router.push('/login?redirect=premium');
      }, 1500);
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Create checkout session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: selectedPlan }),
        credentials: 'include',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Wystąpił błąd podczas przygotowania płatności');
      }
      
      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });
      
      if (error) {
        console.error('Stripe redirect error:', error);
        throw new Error(error.message);
      }
      
    } catch (err) {
      console.error('Purchase error:', err);
      setError(err.message || 'Wystąpił błąd podczas przetwarzania płatności');
      setIsProcessing(false);
    }
  };

  // Show loading state while checking authentication
  if (isLoading || (user && user.hasPremium)) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8">
        <div className="card p-8 max-w-md w-full text-center">
          <div className="animate-pulse">Ładowanie...</div>
        </div>
      </main>
    );
  }
  
  return (
    <>
    <Navbar 
        isLoading={isLoading} 
        isAuthenticated={isAuthenticated} 
        user={user} 
        showUserMenu={showUserMenu} 
        setShowUserMenu={setShowUserMenu} 
        handleLogout={handleLogout} 
      />
    <main className="flex min-h-screen flex-col items-center justify-between p-4 sm:p-8">
    <div className="mt-[80px]"></div>
      <div className="w-full max-w-5xl flex flex-col items-center">
        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col items-center justify-center space-y-8 p-2 sm:p-6">
            <h1 className="text-3xl sm:text-4xl font-bold gradient-text text-center">
              Odblokuj Pełną Moc Chaosu!
            </h1>
            
            <div className="card w-full max-w-md p-6">
              <h2 className="text-xl font-semibold mb-6 text-center">Korzyści Premium</h2>
              
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="bg-[var(--primary)] rounded-full p-1 mr-3 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Dostęp do wszystkich trybów gry (Hardcore i Quick)</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-[var(--primary)] rounded-full p-1 mr-3 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Ekskluzywne pakiety zadań (co tydzień nowe)</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-[var(--primary)] rounded-full p-1 mr-3 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Możliwość personalizacji zadań i UI</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-[var(--primary)] rounded-full p-1 mr-3 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Eksport sesji jako PDF</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-[var(--primary)] rounded-full p-1 mr-3 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Tryb AI generujący unikalne zadania</span>
                </li>
              </ul>
            </div>
            
            {/* Display error if any */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-white p-4 rounded-lg w-full max-w-md">
                <p className="font-medium">Błąd: {error}</p>
              </div>
            )}
            
            {/* Display success message */}
            {success && (
              <div className="bg-green-500/20 border border-green-500/50 text-white p-4 rounded-lg w-full max-w-md">
                <p className="font-medium">Zakup premium udany! Za chwilę zostaniesz przekierowany.</p>
              </div>
            )}
            
            {/* Pricing Plans */}
            <div className="w-full max-w-md">
              <div className="flex justify-center mb-6">
                <div className="bg-[var(--container-color)] p-1 rounded-lg flex">
                  <button 
                    className={`px-4 py-2 rounded-lg transition-all ${selectedPlan === 'monthly' ? 'bg-[var(--primary)] text-white' : ''}`}
                    onClick={() => setSelectedPlan('monthly')}
                  >
                    Miesięcznie
                  </button>
                  <button 
                    className={`px-4 py-2 rounded-lg transition-all ${selectedPlan === 'yearly' ? 'bg-[var(--primary)] text-white' : ''}`}
                    onClick={() => setSelectedPlan('yearly')}
                  >
                    Rocznie
                  </button>
                  <button 
                    className={`px-4 py-2 rounded-lg transition-all ${selectedPlan === 'lifetime' ? 'bg-[var(--primary)] text-white' : ''}`}
                    onClick={() => setSelectedPlan('lifetime')}
                  >
                    Dożywotnio
                  </button>
                </div>
              </div>
              
              <div className="card p-6 text-center">
                {selectedPlan === 'monthly' && (
                  <>
                    <h3 className="text-2xl font-bold mb-2">19,99 zł <span className="text-sm text-[var(--text-gray)]">/ miesiąc</span></h3>
                    <p className="text-sm text-[var(--text-gray)] mb-6">Odnawia się automatycznie co miesiąc</p>
                  </>
                )}
                
                {selectedPlan === 'yearly' && (
                  <>
                    <div className="mb-2">
                      <h3 className="text-2xl font-bold">149,99 zł <span className="text-sm text-[var(--text-gray)]">/ rok</span></h3>
                      <p className="text-xs text-[var(--accent)]">Oszczędzasz 90 zł!</p>
                    </div>
                    <p className="text-sm text-[var(--text-gray)] mb-6">Odnawia się automatycznie co rok</p>
                  </>
                )}
                
                {selectedPlan === 'lifetime' && (
                  <>
                    <h3 className="text-2xl font-bold mb-2">299,99 zł <span className="text-sm text-[var(--text-gray)]">jednorazowo</span></h3>
                    <p className="text-sm text-[var(--text-gray)] mb-6">Jednorazowa płatność, bez odnawiania</p>
                  </>
                )}
                
                <button 
                  className={`btn btn-primary w-full ${isProcessing || isRedirecting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  onClick={handlePurchase}
                  disabled={isProcessing || isRedirecting}
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Przetwarzanie...
                    </div>
                  ) : isRedirecting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Przekierowanie do logowania...
                    </div>
                  ) : (
                    'Przejdź do płatności'
                  )}
                </button>
                
                <div className="mt-6 flex items-center justify-center text-sm text-[var(--text-gray)]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Bezpieczna płatność przez Stripe
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
    <Footer />
    </>
  );
} 