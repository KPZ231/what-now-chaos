"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Footer from "@/app/partial/footer";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md text-center"
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
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-xl mb-8">Nie znaleziono strony</p>
          <Link href="/" className="btn btn-primary">
            Wróć na stronę główną
          </Link>
        </div>
      </motion.div>

      <Footer />
    </div>
  );
} 