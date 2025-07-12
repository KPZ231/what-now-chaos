"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import Link from 'next/link';
import Footer from "@/app/partial/footer";
import Navbar from "@/app/partial/navbar";

export default function PremiumAdvantagesPage() {

  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
  };
  // Redirect non-premium users to the premium purchase page
  useEffect(() => {
    if (!isLoading && user && !user.hasPremium) {
      router.push('/premium');
    } else if (!isLoading && !user) {
      router.push('/login?redirect=premium-advantages');
    }
  }, [user, isLoading, router]);

  // Get the premium expiry date in a readable format
  const getExpiryDate = () => {
    if (!user?.premiumExpiry) return 'Dożywotnio';

    const expiryDate = new Date(user.premiumExpiry);
    return expiryDate.toLocaleDateString('pl-PL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (isLoading || !user || !user.hasPremium) {
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
      <main className="flex min-h-screen flex-col items-center justify-between p-5 sm:p-8">
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
                Twoje Konto Premium
              </h1>

              {/* Premium Status */}
              <div className="card w-full max-w-md p-6">
                <div className="text-center mb-6">
                  <div className="inline-block bg-[var(--primary)]/20 rounded-full p-4 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold">Plan {user.premiumPlan === 'monthly' ? 'Miesięczny' : user.premiumPlan === 'yearly' ? 'Roczny' : 'Dożywotni'}</h2>
                  <p className="text-[var(--text-gray)] mt-1">
                    {user.premiumPlan !== 'lifetime'
                      ? `Aktywny do: ${getExpiryDate()}`
                      : 'Dostęp dożywotni'}
                  </p>
                </div>

                <h3 className="text-lg font-medium mb-3">Twoje odblokowane funkcje:</h3>

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

              {/* Feature Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
                <Link href="/play" className="card p-4 hover:bg-[var(--container-color)]/80 transition-all">
                  <div className="flex items-center">
                    <div className="bg-[var(--primary)]/20 p-3 rounded-full mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">Graj Teraz</h3>
                      <p className="text-sm text-[var(--text-gray)]">Wszystkie tryby dostępne</p>
                    </div>
                  </div>
                </Link>

                <Link href="/profile" className="card p-4 hover:bg-[var(--container-color)]/80 transition-all">
                  <div className="flex items-center">
                    <div className="bg-[var(--primary)]/20 p-3 rounded-full mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">Profil</h3>
                      <p className="text-sm text-[var(--text-gray)]">Zarządzaj kontem</p>
                    </div>
                  </div>
                </Link>
              </div>

              {user.premiumPlan !== 'lifetime' && (
                <div className="w-full max-w-md">
                  <div className="card p-6 text-center">
                    <h3 className="text-lg font-semibold mb-4">Chcesz zmienić plan?</h3>
                    <Link href="/premium" className="btn btn-outline w-full">
                      Zarządzaj Subskrypcją
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>


      </main>
      <Footer />
    </ >
  );
} 