"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileNavbar() {
  const pathname = usePathname();

  // Check if the current path is active
  const isActive = (path) => {
    return pathname === path;
  };

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="md:hidden fixed bottom-0 left-0 w-full bg-[var(--container-color)] border-t border-[var(--border-color)] z-40"
    >
      <div className="flex justify-around items-center py-2">
        <Link href="/" className="flex flex-col items-center p-2">
          <div className={`p-2 rounded-full ${isActive('/') ? 'bg-[var(--primary)]/20' : ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isActive('/') ? 'text-[var(--primary)]' : 'text-[var(--text-gray)]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <span className={`text-xs ${isActive('/') ? 'text-[var(--primary)]' : 'text-[var(--text-gray)]'}`}>Home</span>
        </Link>
        
        <Link href="/play" className="flex flex-col items-center p-2">
          <div className={`p-2 rounded-full ${isActive('/play') ? 'bg-[var(--primary)]/20' : ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isActive('/play') ? 'text-[var(--primary)]' : 'text-[var(--text-gray)]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className={`text-xs ${isActive('/play') ? 'text-[var(--primary)]' : 'text-[var(--text-gray)]'}`}>Graj</span>
        </Link>
        
        <Link href="/modes" className="flex flex-col items-center p-2">
          <div className={`p-2 rounded-full ${isActive('/modes') ? 'bg-[var(--primary)]/20' : ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isActive('/modes') ? 'text-[var(--primary)]' : 'text-[var(--text-gray)]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </div>
          <span className={`text-xs ${isActive('/modes') ? 'text-[var(--primary)]' : 'text-[var(--text-gray)]'}`}>Tryby</span>
        </Link>
        
        <Link href="/about" className="flex flex-col items-center p-2">
          <div className={`p-2 rounded-full ${isActive('/about') ? 'bg-[var(--primary)]/20' : ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isActive('/about') ? 'text-[var(--primary)]' : 'text-[var(--text-gray)]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className={`text-xs ${isActive('/about') ? 'text-[var(--primary)]' : 'text-[var(--text-gray)]'}`}>O Nas</span>
        </Link>
      </div>
    </motion.div>
  );
} 