"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export default function Navbar({ isLoading, isAuthenticated, user, showUserMenu, setShowUserMenu, handleLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="fixed top-0 left-0 w-full bg-[var(--container-color)]/90 backdrop-blur-sm z-50 py-3 px-4 sm:px-6 border-b border-[var(--border-color)]"
    >
      <div className="container mx-auto flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2"
        >
          <Link href="/">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white font-bold text-lg cursor-pointer">
              W!
            </div>
          </Link>
          <Link href="/" className="text-xl font-bold gradient-text">WhatNow?!</Link>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hidden md:flex gap-6 items-center"
        >
          <Link href="/play" className="hover:text-[var(--primary)] transition-colors font-medium">
            Start
          </Link>
          <Link href="/modes" className="hover:text-[var(--primary)] transition-colors">
            Tryby Gry
          </Link>
          <Link href="/about" className="hover:text-[var(--primary)] transition-colors">
            O Nas
          </Link>
          <Link 
            href={isAuthenticated && user?.hasPremium ? "/premium-advantages" : "/premium"} 
            className="hover:text-[var(--primary)] transition-colors"
          >
            Premium
          </Link>
          
          {isLoading ? (
            <div className="w-8 h-8 rounded-full bg-[var(--border-color)]/30 animate-pulse"></div>
          ) : isAuthenticated ? (
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)} 
                className="flex items-center gap-2 hover:text-[var(--accent)] transition-colors cursor-pointer"
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
                  {user.hasPremium && (
                    <Link href="/premium-advantages" className="block px-4 py-2 hover:bg-[var(--primary)]/20 transition-colors">
                      Status Premium
                    </Link>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
                  >
                    Wyloguj
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
          
          <Link
            href="/play"
            className="btn btn-primary"
            passHref
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Zagraj Teraz
            </motion.div>
          </Link>
        </motion.div>
        
        {/* Mobile menu button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="block md:hidden text-2xl z-50 cursor-pointer"
          onClick={toggleMobileMenu}
          aria-label="Menu"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </motion.button>

        {/* Mobile menu overlay */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={toggleMobileMenu}
          ></div>
        )}

        {/* Mobile menu */}
        <motion.div
          className="fixed top-0 right-0 h-full w-4/5 max-w-sm bg-[var(--container-color)] z-40 shadow-xl transform transition-transform duration-300 ease-in-out"
          initial={{ x: "100%" }}
          animate={{ x: mobileMenuOpen ? 0 : "100%" }}
        >
          <div className="p-6 pt-20 flex flex-col gap-4 bg-black">
            <Link 
              href="/play" 
              className="p-3 hover:bg-[var(--primary)]/10 rounded-lg transition-colors font-medium"
              onClick={toggleMobileMenu}
            >
              Start
            </Link>
            <Link 
              href="/modes" 
              className="p-3 hover:bg-[var(--primary)]/10 rounded-lg transition-colors"
              onClick={toggleMobileMenu}
            >
              Tryby Gry
            </Link>
            <Link 
              href="/about" 
              className="p-3 hover:bg-[var(--primary)]/10 rounded-lg transition-colors"
              onClick={toggleMobileMenu}
            >
              O Nas
            </Link>
            <Link 
              href={isAuthenticated && user?.hasPremium ? "/premium-advantages" : "/premium"} 
              className="p-3 hover:bg-[var(--primary)]/10 rounded-lg transition-colors"
              onClick={toggleMobileMenu}
            >
              Premium
            </Link>
            
            <div className="mt-4">
              {isLoading ? (
                <div className="w-full p-3 rounded-lg bg-[var(--border-color)]/30 animate-pulse"></div>
              ) : isAuthenticated ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 p-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--accent)] flex items-center justify-center text-[var(--text-dark)] font-medium">
                      {user.name ? user.name.charAt(0) : user.email.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium">{user.name || user.email.split('@')[0]}</span>
                  </div>
                  <Link 
                    href="/profile" 
                    className="p-3 hover:bg-[var(--primary)]/10 rounded-lg transition-colors"
                    onClick={toggleMobileMenu}
                  >
                    Profil
                  </Link>
                  {user.hasPremium && (
                    <Link 
                      href="/premium-advantages" 
                      className="p-3 hover:bg-[var(--primary)]/10 rounded-lg transition-colors"
                      onClick={toggleMobileMenu}
                    >
                      Status Premium
                    </Link>
                  )}
                  <button 
                    onClick={() => {
                      handleLogout();
                      toggleMobileMenu();
                    }}
                    className="w-full text-left p-3 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors cursor-pointer"
                  >
                    Wyloguj
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link 
                    href="/login" 
                    className="p-3 hover:bg-[var(--primary)]/10 rounded-lg transition-colors"
                    onClick={toggleMobileMenu}
                  >
                    Logowanie
                  </Link>
                  <Link 
                    href="/register" 
                    className="p-3 hover:bg-[var(--primary)]/10 rounded-lg transition-colors"
                    onClick={toggleMobileMenu}
                  >
                    Rejestracja
                  </Link>
                </div>
              )}
            </div>
            
            <Link 
              href="/play" 
              className="btn btn-primary mt-4 text-center"
              onClick={toggleMobileMenu}
            >
              Zagraj Teraz
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
}