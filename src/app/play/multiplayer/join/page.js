"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import Link from 'next/link';
import { QRCodeCanvas } from 'qrcode.react'; // You'll need to install this: npm install qrcode.react

export default function JoinMultiplayerPage() {
  const [joinCode, setJoinCode] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    // Set nickname from user data if available
    if (user && user.name) {
      setNickname(user.name);
    }
    
    // Check if there's a join code in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const codeFromUrl = urlParams.get('code');
    if (codeFromUrl) {
      setJoinCode(codeFromUrl);
    }
  }, [user]);
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!joinCode || joinCode.length !== 6) {
      setError('Wprowadź prawidłowy 6-cyfrowy kod gry');
      return;
    }
    
    if (!user && (!nickname || nickname.trim().length < 2)) {
      setError('Wprowadź nick (min. 2 znaki) aby dołączyć do gry');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/multiplayer/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          joinCode,
          nickname
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to join game');
      }
      
      // Redirect to multiplayer game page
      router.push(`/play/multiplayer/${data.gameId}?participantId=${data.participantId}`);
      
    } catch (error) {
      console.error('Error joining multiplayer game:', error);
      setError(error.message || 'Nie udało się dołączyć do gry');
      setIsLoading(false);
    }
  };
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md">
        <motion.div 
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col items-center justify-center space-y-6 p-2 sm:p-6">
            <Link href="/play" className="text-[var(--text-gray)] hover:text-[var(--text)] mb-4">
              &larr; Powrót
            </Link>
          
            <h1 className="text-3xl sm:text-4xl font-bold gradient-text text-center mb-4">
              Dołącz do Gry
            </h1>
            
            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-100 p-3 rounded-lg w-full">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="w-full space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Kod Gry</h2>
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="Wprowadź 6-cyfrowy kod..."
                    value={joinCode}
                    onChange={(e) => {
                      // Only allow numbers and limit to 6 characters
                      const value = e.target.value.replace(/[^0-9]/g, '').substring(0, 6);
                      setJoinCode(value);
                    }}
                    className="w-full p-4 rounded-lg bg-[var(--container-color)] border border-[var(--border-color)] text-2xl text-center tracking-wider"
                    required
                    minLength={6}
                    maxLength={6}
                    pattern="[0-9]{6}"
                  />
                </div>
              </div>
              
              {/* Nickname input for non-logged in users */}
              {!user && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Twój Nick</h2>
                  <div className="flex items-center">
                    <input
                      type="text"
                      placeholder="Wprowadź swój nick..."
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      className="w-full p-3 rounded-lg bg-[var(--container-color)] border border-[var(--border-color)]"
                      required
                      minLength={2}
                    />
                  </div>
                  <p className="text-sm text-[var(--text-gray)]">
                    <Link href="/register" className="text-[var(--primary)] hover:underline">
                      Stwórz konto
                    </Link> aby zapamiętać swoją statystykę gier
                  </p>
                </div>
              )}
              
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin mr-2">⭮</span>
                    Dołączanie...
                  </>
                ) : 'Dołącz do Gry'}
              </button>
              
              <div className="text-center">
                <p className="text-[var(--text-gray)]">
                  lub <Link href="/play" className="text-[var(--primary)] hover:underline">stwórz własną grę</Link>
                </p>
              </div>
            </form>
            
            {/* QR Code Scanner TODO: Add scanner functionality */}
            <div className="mt-8 w-full card p-6">
              <h2 className="text-xl font-semibold text-center mb-4">Dołącz przez QR kod</h2>
              <p className="text-sm text-[var(--text-gray)] text-center mb-4">
                Zeskanuj kod QR gry aby automatycznie dołączyć
              </p>
              
              <div className="flex justify-center">
                <button
                  className="btn btn-outline"
                  onClick={() => alert('Funkcjonalność skanera QR w przygotowaniu')}
                >
                  Otwórz Skaner QR
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
} 