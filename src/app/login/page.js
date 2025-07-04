"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const { login } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await login(email, password);
      
      if (result.success) {
        router.push(callbackUrl);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError("Wystąpił błąd podczas logowania");
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
          <h1 className="text-2xl font-bold mb-6 text-center">Logowanie</h1>
          
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-white rounded-lg p-3 mb-6">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-[var(--text-gray)] mb-1">
                Email
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
                Hasło
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[var(--body-color)] border border-[var(--border-color)] rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
                placeholder="********"
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn btn-primary flex justify-center items-center"
            >
              {isLoading ? (
                <span className="animate-pulse">Logowanie...</span>
              ) : (
                "Zaloguj się"
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center text-[var(--text-gray)]">
            Nie masz jeszcze konta?{" "}
            <Link href="/register" className="text-[var(--primary)] hover:text-[var(--primary-light)]">
              Zarejestruj się
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 