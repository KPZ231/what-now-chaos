"use client";

import { useState, Suspense } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import Comeback from "@/app/partial/comeback";  

// Create a client component to use useSearchParams
function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Field-specific validation states
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const { login } = useAuth();

  // Real-time validation functions
  const validateEmail = (email) => {
    if (!email) return "Email jest wymagany";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Proszę podać poprawny adres email";
    }
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Hasło jest wymagane";
    if (password.length < 6) {
      return "Hasło musi mieć co najmniej 6 znaków";
    }
    return "";
  };

  // Sanitize input to prevent SQL injection (basic client-side)
  const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    // Replace potentially dangerous SQL characters
    return input.replace(/[';\\]/g, '');
  };

  // Handle input changes with sanitization
  const handleEmailChange = (e) => {
    const sanitizedValue = sanitizeInput(e.target.value);
    setEmail(sanitizedValue);
    setEmailError(validateEmail(sanitizedValue));
  };

  const handlePasswordChange = (e) => {
    const sanitizedValue = sanitizeInput(e.target.value);
    setPassword(sanitizedValue);
    setPasswordError(validatePassword(sanitizedValue));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Final validation before submission
    const currentEmailError = validateEmail(email);
    const currentPasswordError = validatePassword(password);

    if (currentEmailError || currentPasswordError) {
      setEmailError(currentEmailError);
      setPasswordError(currentPasswordError);
      setError("Proszę poprawić błędy w formularzu");
      setIsLoading(false);
      return;
    }

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
    <>
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
              onChange={handleEmailChange}
              required
              className={`w-full bg-[var(--body-color)] border ${emailError ? 'border-red-500' : 'border-[var(--border-color)]'} rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all`}
              placeholder="twoj@email.pl"
              onBlur={() => setEmailError(validateEmail(email))}
            />
            {emailError && (
              <p className="mt-1 text-red-400 text-sm">{emailError}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="password" className="block text-[var(--text-gray)] mb-1">
              Hasło
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              required
              className={`w-full bg-[var(--body-color)] border ${passwordError ? 'border-red-500' : 'border-[var(--border-color)]'} rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all`}
              placeholder="********"
              onBlur={() => setPasswordError(validatePassword(password))}
            />
            {passwordError && (
              <p className="mt-1 text-red-400 text-sm">{passwordError}</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={isLoading || emailError || passwordError}
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
          <div className="mb-2">
            Nie masz jeszcze konta?{" "}
            <Link href="/register" className="text-[var(--primary)] hover:text-[var(--primary-light)]">
              Zarejestruj się
            </Link>
          </div>
          <div>
            <Link href="/reset-password" className="text-[var(--primary)] hover:text-[var(--primary-light)]">
              Zapomniałeś hasła?
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <Comeback />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Suspense fallback={
          <div className="card">
            <p className="text-center">Ładowanie...</p>
          </div>
        }>
          <LoginForm />
        </Suspense>
      </motion.div>
    </div>
  );
} 