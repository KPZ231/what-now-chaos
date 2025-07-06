"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import Link from 'next/link';
import Footer from "@/app/partial/footer";

export default function PremiumPage() {
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { user, isLoading, setUser } = useAuth();
  const router = useRouter();
  
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
      // First simulate a payment gateway API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Now update the user's premium status in the database
      const response = await fetch('/api/user/premium', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: selectedPlan }),
        credentials: 'include',
      });
      
      // Clone the response before reading it as JSON
      const clonedResponse = response.clone();
      let data;
      
      try {
        data = await response.json();
        console.log('Premium API response:', data);
      } catch (jsonError) {
        console.error('Error parsing JSON response:', jsonError);
        throw new Error('Błąd podczas przetwarzania odpowiedzi z serwera');
      }
        
      if (!response.ok) {
        console.error('Premium API error:', data);
        throw new Error(data.error || 'Wystąpił błąd podczas aktualizacji statusu premium');
      }
      
      // Update the user context with new premium status
      setUser({
        ...user,
        hasPremium: true,
        premiumPlan: selectedPlan,
        premiumExpiry: data.user?.premiumExpiry
      });
      
      setSuccess(true);
      
      // Redirect to premium advantages page after showing success message
      setTimeout(() => {
        router.push('/premium-advantages');
      }, 2000);
      
    } catch (err) {
      console.error('Purchase error:', err);
      setError(err.message || 'Wystąpił błąd podczas przetwarzania płatności');
    } finally {
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
    <main className="flex min-h-screen flex-col items-center justify-between p-4 sm:p-8">
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
                  className={`btn btn-primary w-full ${isProcessing || isRedirecting || success ? 'opacity-70 cursor-not-allowed' : ''}`}
                  onClick={handlePurchase}
                  disabled={isProcessing || isRedirecting || success}
                >
                  {isProcessing ? (
                    <>
                      <span className="animate-spin inline-block mr-2">⟳</span>
                      Przetwarzanie...
                    </>
                  ) : isRedirecting ? (
                    <>
                      <span className="animate-spin inline-block mr-2">⟳</span>
                      Przekierowywanie do logowania...
                    </>
                  ) : success ? (
                    <>
                      <span className="inline-block mr-2">✓</span>
                      Zakupiono Premium!
                    </>
                  ) : (
                    'Kup Teraz'
                  )}
                </button>
              </div>
              
              <p className="text-sm text-center mt-4 text-[var(--text-gray)]">
                Bezpieczne płatności kartą, BLIK lub PayPal.<br />
                Możesz anulować subskrypcję w dowolnym momencie.
              </p>
              
              {user && (
                <p className="text-sm text-center mt-4">
                  <Link href="/play" className="text-[var(--primary)] hover:underline">
                    Powrót do gry
                  </Link>
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
      
    </main>
    <Footer />
  </>
  );
} 