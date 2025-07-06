"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import Footer from "@/app/partial/footer";
import SEO from "@/lib/SEO";

export default function ModesPage() {
  const [activeMode, setActiveMode] = useState('soft');
  const { user } = useAuth();
  
  const modes = {
    soft: {
      title: "Soft",
      description: "Gentle and safe challenges, perfect for warm-ups or more social gatherings. Tasks focus on integration, conversations and easier activities.",
      color: "from-blue-500 to-purple-500",
      premium: false,
      examples: [
        "Switch places with the person on your left.",
        "Say something nice to every player.",
        "Show your last 3 photos from your phone gallery.",
        "Describe the person on your right with three positive words.",
        "Talk about your most interesting hobby."
      ]
    },
    chaos: {
      title: "Chaos",
      description: "Crazy and creative tasks that cause laughter and unexpected situations. This mode brings more energy and unexpected twists to the party.",
      color: "from-pink-500 to-orange-500",
      premium: false,
      examples: [
        "Everyone must speak backwards for 1 minute.",
        "Whoever stands on a chair first rules for 1 round.",
        "Exchange clothes with the person on your right for 5 minutes.",
        "For the next 2 minutes, answer all questions by singing.",
        "Make the weirdest face you can and hold it for 30 seconds."
      ]
    },
    hardcore: {
      title: "Hardcore",
      description: "Bold and challenging tasks for real party-goers. This mode contains adult-oriented tasks, often involving drinking and daring challenges.",
      color: "from-red-500 to-rose-700",
      premium: true,
      examples: [
        "The youngest player drinks twice.",
        "Say something very uncomfortable about yourself - or drink.",
        "The person with the most siblings drinks as many times as they have siblings.",
        "Do 10 push-ups or take a shot.",
        "Play 'Never have I ever' - the loser drinks."
      ]
    },
    quick: {
      title: "Quick",
      description: "Fast reflex challenges that will immediately boost the atmosphere. This mode tests reflexes and concentration, introducing an element of competition and quick action.",
      color: "from-amber-400 to-yellow-600",
      premium: true,
      examples: [
        "Everyone claps 3 times. Whoever doesn't make it, drinks.",
        "Tell the sock color of the person to your left - or drink.",
        "Last person to touch the floor - drinks.",
        "Stand up and turn around 3 times. Last one to do it - drinks.",
        "First person to find something red and bring it, chooses who drinks."
      ]
    }
  };
  
  const isPremiumMode = (mode) => {
    return modes[mode].premium && (!user || !user.hasPremium);
  };

  // Structured data for game modes page
  const modesPageStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Game Modes - WhatNow?! Party Chaos Generator",
    "description": "Explore different game modes in WhatNow?! - from gentle Soft mode to wild Hardcore challenges for your party.",
    "url": "https://what-now-chaos.vercel.app/modes",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": Object.keys(modes).map((mode, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": modes[mode].title,
        "description": modes[mode].description,
        "url": `https://what-now-chaos.vercel.app/modes#${mode}`
      }))
    }
  };

  return (
    <>
      <SEO 
        title="Game Modes - WhatNow?! Party Chaos Generator"
        description="Explore different game modes in WhatNow?! - from gentle Soft mode to wild Hardcore challenges for your party."
        canonicalUrl="/modes"
        keywords={["party game modes", "drinking game challenges", "fun party activities", "party game types"]}
        structuredData={modesPageStructuredData}
      />
      <main className="flex min-h-screen flex-col items-center justify-between p-4 sm:p-8">
        <div className="w-full max-w-5xl flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <div className="flex flex-col items-center justify-center space-y-8 p-2 sm:p-6">
              <h1 className="text-3xl sm:text-4xl font-bold gradient-text text-center mb-8">
                Game Modes
              </h1>

              {/* Mode selector tabs */}
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {Object.keys(modes).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setActiveMode(mode)}
                    className={`px-6 py-3 rounded-full transition-all ${
                      activeMode === mode
                        ? 'bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/30'
                        : 'bg-[var(--container-color)] hover:bg-[var(--container-color)]/80'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{modes[mode].title}</span>
                      {modes[mode].premium && (
                        <span className="bg-yellow-500 text-black text-xs px-1.5 py-0.5 rounded-full font-medium">
                          PREMIUM
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Active mode details */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMode}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                >
                  <div className="card p-6 relative overflow-hidden" id={activeMode}>
                    {/* Background gradient */}
                    <div className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-20 bg-gradient-to-br ${modes[activeMode].color}`}></div>
                    
                    {/* Premium badge if needed */}
                    {modes[activeMode].premium && (
                      <div className="absolute top-4 right-4">
                        <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-3 py-1 rounded-full font-bold shadow-lg">
                          PREMIUM
                        </div>
                      </div>
                    )}
                    
                    <h2 className="text-2xl font-bold mb-2">{modes[activeMode].title}</h2>
                    <p className="text-[var(--text-gray)] mb-8 max-w-3xl">
                      {modes[activeMode].description}
                    </p>

                    {/* Examples */}
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold mb-4">Example Challenges:</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {modes[activeMode].examples.map((example, index) => (
                          <div 
                            key={index}
                            className="bg-[var(--container-color)]/50 p-4 rounded-lg border border-[var(--border-color)]"
                          >
                            {example}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Premium lock overlay */}
                    {isPremiumMode(activeMode) && (
                      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-xl">
                        <div className="text-center p-6">
                          <div className="text-5xl mb-4">🔒</div>
                          <h3 className="text-2xl font-bold mb-2">Premium Mode</h3>
                          <p className="mb-6 max-w-md mx-auto text-[var(--text-gray)]">
                            This game mode is only available to users with an active premium subscription.
                          </p>
                          <Link href="/premium" className="btn btn-primary">
                            Unlock Premium
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Call to action */}
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <Link href="/play" className="btn btn-primary">
                  Start Game
                </Link>
                <Link href="/" className="btn btn-outline">
                  Back to Menu
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
} 