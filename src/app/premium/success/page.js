"use client";

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import Link from 'next/link';
import Navbar from "@/app/partial/navbar";
import Footer from "@/app/partial/footer";

function PaymentSuccessContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { user, setUser } = useAuth();
  const router = useRouter();
  
  // Verify the payment and update user status
  useEffect(() => {
    async function verifyPayment() {
      try {
        if (!sessionId) {
          throw new Error('Nie znaleziono identyfikatora sesji płatności');
        }
        
        const response = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
          credentials: 'include',
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Wystąpił błąd podczas weryfikacji płatności');
        }
        
        // Update user context with premium status
        if (user) {
          setUser({
            ...user,
            hasPremium: true,
            premiumPlan: data.plan,
            premiumExpiry: data.premiumExpiry
          });
        }
      } catch (err) {
        console.error('Payment verification error:', err);
        setError(err.message || 'Wystąpił błąd podczas weryfikacji płatności');
      } finally {
        setIsLoading(false);
        
        // Redirect to premium advantages page after 5 seconds
        setTimeout(() => {
          router.push('/premium-advantages');
        }, 5000);
      }
    }
    
    verifyPayment();
  }, [sessionId, user, setUser, router]);
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[var(--background-start)] to-[var(--background-end)]">
      <Navbar />
      
      <main className="flex flex-1 flex-col items-center justify-center p-4 sm:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="card p-8 max-w-md w-full text-center"
        >
          {isLoading ? (
            <div className="space-y-4">
              <h1 className="text-3xl font-bold gradient-text">
                Weryfikacja płatności...
              </h1>
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
              </div>
              <p className="text-[var(--text-color)]">
                Prosimy o chwilę cierpliwości, weryfikujemy Twoją płatność.
              </p>
            </div>
          ) : error ? (
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-red-500">
                Wystąpił błąd
              </h1>
              <p className="text-[var(--text-color)]">
                {error}
              </p>
              <div className="mt-6">
                <Link href="/premium" className="btn btn-primary">
                  Wróć do strony premium
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <svg 
                className="w-20 h-20 mx-auto text-green-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M5 13l4 4L19 7"
                />
              </svg>
              
              <h1 className="text-3xl font-bold gradient-text">
                Płatność zatwierdzona!
              </h1>
              
              <p className="text-[var(--text-color)]">
                Dziękujemy! Twoje konto premium zostało aktywowane.
              </p>
              
              <p className="text-[var(--text-gray)] text-sm">
                Za chwilę zostaniesz przekierowany do strony z korzyściami premium.
              </p>
              
              <div className="mt-6">
                <Link href="/premium-advantages" className="btn btn-primary">
                  Przejdź do korzyści premium
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-[var(--background-start)] to-[var(--background-end)]">
        <Navbar />
        <main className="flex flex-1 flex-col items-center justify-center p-4 sm:p-8">
          <div className="card p-8 max-w-md w-full text-center">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold gradient-text">Ładowanie...</h1>
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
} 