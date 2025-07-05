"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/app/partial/navbar";
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
  
  // Field-specific validation states
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  const router = useRouter();
  const { register } = useAuth();

  // Real-time validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Proszę podać poprawny adres email";
    }
    return "";
  };

  const validatePassword = (password) => {
    if (password.length < 6) {
      return "Hasło musi mieć co najmniej 6 znaków";
    }
    // Additional password strength checks could be added here
    return "";
  };

  const validateConfirmPassword = (confirmPassword) => {
    if (confirmPassword !== password) {
      return "Hasła nie są identyczne";
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
    
    // Also validate confirm password when password changes
    if (confirmPassword) {
      setConfirmPasswordError(validateConfirmPassword(confirmPassword));
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const sanitizedValue = sanitizeInput(e.target.value);
    setConfirmPassword(sanitizedValue);
    setConfirmPasswordError(validateConfirmPassword(sanitizedValue));
  };

  const handleNameChange = (e) => {
    setName(sanitizeInput(e.target.value));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    // Final validation before submission
    const currentEmailError = validateEmail(email);
    const currentPasswordError = validatePassword(password);
    const currentConfirmPasswordError = validateConfirmPassword(confirmPassword);

    if (currentEmailError || currentPasswordError || currentConfirmPasswordError || !termsAccepted) {
      setEmailError(currentEmailError);
      setPasswordError(currentPasswordError);
      setConfirmPasswordError(currentConfirmPasswordError);
      setError("Proszę poprawić błędy w formularzu");
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
      <Navbar 
        isLoading={isLoading} 
        isAuthenticated={false} 
        user={null} 
        showUserMenu={false} 
        setShowUserMenu={() => {}} 
        handleLogout={() => {}} 
      />
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
                onChange={handleNameChange}
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
                Hasło*
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                required
                className={`w-full bg-[var(--body-color)] border ${passwordError ? 'border-red-500' : 'border-[var(--border-color)]'} rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all`}
                placeholder="Minimum 6 znaków"
                onBlur={() => setPasswordError(validatePassword(password))}
              />
              {passwordError && (
                <p className="mt-1 text-red-400 text-sm">{passwordError}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-[var(--text-gray)] mb-1">
                Potwierdź hasło*
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
                className={`w-full bg-[var(--body-color)] border ${confirmPasswordError ? 'border-red-500' : 'border-[var(--border-color)]'} rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all`}
                placeholder="Powtórz hasło"
                onBlur={() => setConfirmPasswordError(validateConfirmPassword(confirmPassword))}
              />
              {confirmPasswordError && (
                <p className="mt-1 text-red-400 text-sm">{confirmPasswordError}</p>
              )}
            </div>
            

            <div>
              <label htmlFor="terms" className="block text-[var(--text-gray)] mb-1">
                <input 
                  type="checkbox" 
                  id="terms" 
                  className="mr-2" 
                  required
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)} 
                />
                Akceptuję <Link href="/terms" className="text-[var(--primary)] hover:text-[var(--primary-light)]">regulamin</Link>
              </label>
            </div>


            <button
              type="submit"
              disabled={isLoading || emailError || passwordError || confirmPasswordError || !termsAccepted}
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