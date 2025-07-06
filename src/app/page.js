"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/partial/navbar";
import Footer from "@/app/partial/footer";
import { useAuth } from "@/lib/AuthContext";
import Head from "next/head";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const pulse = {
  initial: { scale: 1 },
  animate: { 
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export default function Home() {
  const [activeMode, setActiveMode] = useState("chaos");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  
  const gameModes = {
    soft: {
      title: "Soft",
      description: "Gentle and safe challenges for everyone. Perfect for starting the party!",
      color: "from-blue-500 to-purple-500",
      examples: [
        "Switch places with the person on your left.",
        "Say something nice to every player."
      ]
    },
    chaos: {
      title: "Chaos",
      description: "Crazy and creative tasks that cause laughter and unexpected situations!",
      color: "from-pink-500 to-orange-500",
      examples: [
        "Everyone must speak backwards for 1 minute.",
        "Whoever stands on a chair first rules for 1 round."
      ]
    },
    hardcore: {
      title: "Hardcore",
      description: "Bold and challenging tasks for real party-goers!",
      color: "from-red-500 to-rose-700",
      examples: [
        "The youngest player drinks twice.",
        "Say something very uncomfortable about yourself - or drink."
      ]
    },
    quick: {
      title: "Quick",
      description: "Fast tasks that will immediately boost the atmosphere!",
      color: "from-amber-400 to-yellow-600",
      examples: [
        "Everyone claps 3 times. Whoever doesn't make it, drinks.",
        "Tell the sock color of the person to your left - or drink."
      ]
    }
  };

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
  };

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
      {/* Hero section */}
      <section className="relative pt-28 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12"
          >
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <motion.h1 
                variants={fadeIn}
                className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6"
              >
                <span className="gradient-text">WhatNow?!</span> <br />
                <span className="text-white">Party Chaos Generator</span>
              </motion.h1>
              
              <motion.p 
                variants={fadeIn}
                className="text-base sm:text-lg md:text-xl text-[var(--text-gray)] mb-8 max-w-lg mx-auto lg:mx-0"
              >
                Boost your party with absurd and hilarious challenges that will surprise your friends and create waves of laughter!
              </motion.p>
              
              <motion.div 
                variants={fadeIn}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Link href="/play" className="btn btn-primary w-full sm:w-auto text-center cursor-pointer">Start the Fun</Link>
                <Link href="/modes" className="btn btn-outline w-full sm:w-auto text-center cursor-pointer">See Game Modes</Link>
              </motion.div>
            </div>
            
            <motion.div 
              variants={fadeIn}
              className="w-full lg:w-1/2 mt-10 lg:mt-0"
            >
              <motion.div 
                variants={pulse}
                initial="initial"
                animate="animate"
                className="relative mx-auto w-full max-w-md aspect-[4/5]"
              >
                <div className="glow absolute inset-0 rounded-2xl"></div>
                <div className="bg-[var(--container-color)]/80 backdrop-blur-md p-5 sm:p-8 rounded-2xl border-2 border-[var(--border-color)] h-full shadow-2xl">
                  <div className="bg-[var(--primary)]/10 p-4 rounded-lg mb-4 border border-[var(--primary)]/30">
                    <h3 className="text-[var(--primary)] font-bold mb-2 text-xl">Random Challenge</h3>
                    <p className="text-white text-xl sm:text-2xl font-medium">
                      The person with the longest hair chooses who has to drink two shots!
                    </p>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div>
                      <span className="text-[var(--text-gray)] text-sm">Mode:</span>
                      <h4 className="text-[var(--secondary)] font-bold">CHAOS</h4>
                    </div>
                    <div>
                      <span className="text-[var(--text-gray)] text-sm">Time:</span>
                      <div className="text-[var(--accent)] font-bold text-xl">03:42</div>
                    </div>
                  </div>
                  <div className="mt-8">
                    <button onClick={() => window.location.href='/play'} className="w-full btn btn-secondary mb-3 cursor-pointer">Next Challenge</button>
                    <button onClick={() => window.location.href='/play'} className="w-full btn btn-outline cursor-pointer">Skip</button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Background decorations */}
        <div className="absolute top-40 -left-24 w-72 h-72 bg-[var(--primary)]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 -right-32 w-80 h-80 bg-[var(--secondary)]/30 rounded-full blur-3xl"></div>
      </section>

      {/* Features section */}
      <section className="py-16 sm:py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-12 sm:mb-16"
          >
            <motion.h2 
              variants={fadeIn}
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4"
            >
              <span className="gradient-text">The Best</span> party challenge generator
            </motion.h2>
            <motion.p 
              variants={fadeIn}
              className="text-[var(--text-gray)] max-w-2xl mx-auto px-4"
            >
              Forget about boring parties! WhatNow?! will provide you and your friends with hours
              of fun, laughter, and unforgettable memories.
            </motion.p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 sm:px-0">
            {[
              {
                title: "Various Game Modes",
                description: "Choose from four modes with different intensity levels: Soft, Chaos, Hardcore, and Quick.",
                icon: "🎮",
              },
              {
                title: "Timer & Notifications",
                description: "A new challenge appears at a set interval, ensuring continuous entertainment.",
                icon: "⏱️",
              },
              {
                title: "Session History",
                description: "Save completed challenges and track player statistics throughout the party.",
                icon: "📊",
              },
              {
                title: "Party Report",
                description: "Export history as a PDF to keep memories of the best moments.",
                icon: "📝",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    transition: { delay: 0.1 * index, duration: 0.5 }
                  }
                }}
                className="card group hover:border-[var(--primary)] transition-all duration-300"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                <p className="text-[var(--text-gray)]">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Background decorations */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl aspect-square border border-[var(--border-color)] rounded-full opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl aspect-square border border-[var(--border-color)] rounded-full opacity-15"></div>
      </section>
      
      {/* Game Modes section */}
      <section className="py-16 sm:py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-12 sm:mb-16"
          >
            <motion.h2 
              variants={fadeIn}
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4"
            >
              Choose your <span className="gradient-text">game mode</span>
            </motion.h2>
            <motion.p 
              variants={fadeIn}
              className="text-[var(--text-gray)] max-w-2xl mx-auto px-4"
            >
              Different intensity levels for different moods. From light-hearted fun to wild challenges.
            </motion.p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 px-4 sm:px-0">
            {Object.keys(gameModes).map((mode) => {
              const modeData = gameModes[mode];
              return (
                <motion.div
                  key={mode}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className={`card group bg-gradient-to-br ${modeData.color} bg-opacity-10 hover:border-transparent transition-all duration-300`}
                  onClick={() => setActiveMode(mode)}
                >
                  <h3 className="text-2xl font-bold mb-3 text-white">{modeData.title}</h3>
                  <p className="text-white mb-4">{modeData.description}</p>
                  <div className="mt-auto">
                    <div className="text-sm text-white/80 mb-2">Example challenges:</div>
                    <ul className="list-disc list-inside text-white/90 space-y-1">
                      {modeData.examples.map((example, i) => (
                        <li key={i}>{example}</li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          <motion.div 
            variants={fadeIn}
            className="mt-12 text-center"
          >
            <Link href="/modes" className="btn btn-primary">
              Explore All Modes
            </Link>
          </motion.div>
        </div>
        
        {/* Background decorations */}
        <div className="absolute top-1/3 -right-24 w-72 h-72 bg-[var(--accent)]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -left-32 w-80 h-80 bg-[var(--primary)]/20 rounded-full blur-3xl"></div>
      </section>
      
      {/* Premium section */}
      <section className="py-16 sm:py-20 relative overflow-hidden bg-[var(--container-color)]/50">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="max-w-4xl mx-auto"
          >
            <motion.div 
              variants={fadeIn}
              className="text-center mb-10"
            >
              <span className="inline-block py-1 px-3 rounded-full bg-[var(--primary)]/20 text-[var(--primary)] text-sm font-medium mb-4">Premium Features</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                Upgrade to <span className="gradient-text">Premium</span> for even more fun!
              </h2>
              <p className="text-[var(--text-gray)] max-w-2xl mx-auto px-4">
                Get access to exclusive challenge packs, custom challenges, and AI-generated tasks!
              </p>
            </motion.div>
            
            <motion.div
              variants={fadeIn} 
              className="bg-[var(--container-color)] p-6 sm:p-8 rounded-2xl border border-[var(--border-color)] shadow-xl"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  {
                    title: "Custom Challenge Packs",
                    description: "Access exclusive themed challenge packs for different occasions.",
                    icon: "🎁",
                  },
                  {
                    title: "Ad-Free Experience",
                    description: "Enjoy the game without any interruptions or advertisements.",
                    icon: "✨",
                  },
                  {
                    title: "AI Challenge Generator",
                    description: "Create personalized challenges using our AI-powered generator.",
                    icon: "🤖",
                  },
                  {
                    title: "Party History Reports",
                    description: "Export detailed PDF reports of your party history.",
                    icon: "📊",
                  },
                ].map((feature, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-4"
                  >
                    <div className="text-3xl">{feature.icon}</div>
                    <div>
                      <h3 className="text-lg font-bold mb-1 text-white">{feature.title}</h3>
                      <p className="text-[var(--text-gray)]">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 text-center">
                <Link href="/premium" className="btn btn-secondary">
                  Explore Premium Features
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Background decorations */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl aspect-square border border-[var(--border-color)] rounded-full opacity-10 animate-pulse-slow"></div>
      </section>
      
      {/* CTA section */}
      <section className="py-16 sm:py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.h2 
              variants={fadeIn}
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
            >
              Ready to start the <span className="gradient-text">Party</span>?
            </motion.h2>
            <motion.p 
              variants={fadeIn}
              className="text-[var(--text-gray)] text-lg mb-8"
            >
              Jump into the fun and make your gatherings memorable with WhatNow?! Chaos Generator!
            </motion.p>
            <motion.div
              variants={fadeIn}
            >
              <Link href="/play" className="btn btn-lg btn-primary">
                Start Playing Now
              </Link>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Background decorations */}
        <div className="absolute top-1/4 -left-24 w-72 h-72 bg-[var(--primary)]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-[var(--secondary)]/20 rounded-full blur-3xl"></div>
      </section>
      
      <Footer />
    </>
  );
}
