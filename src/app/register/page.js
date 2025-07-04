"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  
  const router = useRouter();
  const { register } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    // Client-side validation
    if (password !== confirmPassword) {
      setError("Hasła nie są identyczne");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Hasło musi mieć co najmniej 6 znaków");
      setIsLoading(false);
      return;
    }

    try {
      const result = await register(email, password, name);
      
      if (result.success) {
        setSuccessMessage("Rejestracja zakończona pomyślnie! Możesz się teraz zalogować.");
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError("Wystąpił błąd podczas rejestracji");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Link 
          href="/"
          className="flex items-center justify-center gap-2 mb-8"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white font-bold text-lg">
            W!
          </div>
          <span className="text-2xl font-bold gradient-text">WhatNow?!</span>
        </Link>
        
        <div className="card">
          <h1 className="text-2xl font-bold mb-6 text-center">Rejestracja</h1>
          
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-white rounded-lg p-3 mb-6">
              {error}
            </div>
          )}
          
          {successMessage && (
            <div className="bg-green-500/20 border border-green-500 text-white rounded-lg p-3 mb-6">
              {successMessage}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-[var(--text-gray)] mb-1">
                Imię (opcjonalnie)
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[var(--body-color)] border border-[var(--border-color)] rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
                placeholder="Twoje imię"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-[var(--text-gray)] mb-1">
                Email*
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[var(--body-color)] border border-[var(--border-color)] rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
                placeholder="twoj@email.pl"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-[var(--text-gray)] mb-1">
                Hasło*
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[var(--body-color)] border border-[var(--border-color)] rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
                placeholder="Minimum 6 znaków"
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-[var(--text-gray)] mb-1">
                Potwierdź hasło*
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full bg-[var(--body-color)] border border-[var(--border-color)] rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
                placeholder="Powtórz hasło"
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn btn-primary flex justify-center items-center"
            >
              {isLoading ? (
                <span className="animate-pulse">Rejestracja...</span>
              ) : (
                "Zarejestruj się"
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center text-[var(--text-gray)]">
            Masz już konto?{" "}
            <Link href="/login" className="text-[var(--primary)] hover:text-[var(--primary-light)]">
              Zaloguj się
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 