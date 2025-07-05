"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Navbar({ isLoading, isAuthenticated, user, showUserMenu, setShowUserMenu, handleLogout }) {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="fixed top-0 left-0 w-full bg-[var(--container-color)]/90 backdrop-blur-sm z-50 py-3 px-6 border-b border-[var(--border-color)]"
    >
      <div className="container mx-auto flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white font-bold text-lg">
            W!
          </div>
          <span className="text-xl font-bold gradient-text">WhatNow?!</span>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hidden md:flex gap-6 items-center"
        >
          <Link href="/" className="hover:text-[var(--primary)] transition-colors font-medium">
            Start
          </Link>
          <Link href="/modes" className="hover:text-[var(--primary)] transition-colors">
            Tryby Gry
          </Link>
          <a href="/about" className="hover:text-[var(--primary)] transition-colors">
            O Nas
          </a>
          <Link href="/premium" className="hover:text-[var(--primary)] transition-colors">
            Premium
          </Link>
          
          {isLoading ? (
            <div className="w-8 h-8 rounded-full bg-[var(--border-color)]/30 animate-pulse"></div>
          ) : isAuthenticated ? (
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)} 
                className="flex items-center gap-2 hover:text-[var(--accent)] transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center text-[var(--text-dark)] font-medium">
                  {user.name ? user.name.charAt(0) : user.email.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium">{user.name || user.email.split('@')[0]}</span>
              </button>
              
              {showUserMenu && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-[var(--container-color)] border border-[var(--border-color)] rounded-lg shadow-lg py-2 z-50">
                  <Link href="/profile" className="block px-4 py-2 hover:bg-[var(--primary)]/20 transition-colors">
                    Profil
                  </Link>
                  {user.isPremium && (
                    <Link href="/premium-content" className="block px-4 py-2 hover:bg-[var(--primary)]/20 transition-colors">
                      Zawartość Premium
                    </Link>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/20 transition-colors"
                  >
                    Wyloguj się
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="hover:text-[var(--accent)] transition-colors">
                Logowanie
              </Link>
              <Link href="/register" className="px-4 py-1 rounded border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition-colors">
                Rejestracja
              </Link>
            </>
          )}
          
          <motion.a 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="/play" 
            className="btn btn-primary"
          >
            Zagraj Teraz
          </motion.a>
        </motion.div>
        
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="block md:hidden text-2xl"
          aria-label="Menu"
        >
          ☰
        </motion.button>
      </div>
    </motion.nav>
  );
}