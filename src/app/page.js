"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/partial/navbar";
import { useAuth } from "@/lib/AuthContext";

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
      description: "Łagodne i bezpieczne wyzwania dla każdego. Idealne na rozpoczęcie imprezy!",
      color: "from-blue-500 to-purple-500",
      examples: [
        "Zamień się miejscem z osobą po lewej.",
        "Powiedz coś miłego każdemu graczowi."
      ]
    },
    chaos: {
      title: "Chaos",
      description: "Szalone i kreatywne zadania wywołujące śmiech i niespodziewane sytuacje!",
      color: "from-pink-500 to-orange-500",
      examples: [
        "Wszyscy muszą mówić wspak przez 1 minutę.",
        "Kto pierwszy stanie na krześle, ten rządzi przez 1 turę."
      ]
    },
    hardcore: {
      title: "Hardcore",
      description: "Odważne i wyzywające zadania dla prawdziwych imprezowiczów!",
      color: "from-red-500 to-rose-700",
      examples: [
        "Najmłodszy gracz pije 2x.",
        "Powiedz coś bardzo niewygodnego o sobie – albo pij."
      ]
    },
    quick: {
      title: "Quick",
      description: "Szybkie zadania, które natychmiast rozkręcą atmosferę!",
      color: "from-amber-400 to-yellow-600",
      examples: [
        "Wszyscy klaszczą 3 razy. Kto nie zdąży, pije.",
        "Powiedz kolor skarpet osoby po lewej – albo pij."
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
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col lg:flex-row items-center gap-12"
          >
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <motion.h1 
                variants={fadeIn}
                className="text-5xl md:text-6xl font-bold mb-6"
              >
                <span className="gradient-text">WhatNow?!</span> <br />
                <span className="text-white">Generator Chaosu</span>
              </motion.h1>
              
              <motion.p 
                variants={fadeIn}
                className="text-lg md:text-xl text-[var(--text-gray)] mb-8 max-w-lg mx-auto lg:mx-0"
              >
                Rozkręć imprezę dzięki absurdalnym i śmiesznym wyzwaniom, które zaskoczą Twoich znajomych i wywołają falę śmiechu!
              </motion.p>
              
              <motion.div 
                variants={fadeIn}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Link href="/play" className="btn btn-primary">Rozpocznij zabawę</Link>
                <a href="/modes" className="btn btn-outline">Zobacz tryby gry</a>
              </motion.div>
            </div>
            
            <motion.div 
              variants={fadeIn}
              className="w-full lg:w-1/2"
            >
              <motion.div 
                variants={pulse}
                initial="initial"
                animate="animate"
                className="relative mx-auto w-full max-w-md aspect-[4/5]"
              >
                <div className="glow absolute inset-0 rounded-2xl"></div>
                <div className="bg-[var(--container-color)]/80 backdrop-blur-md p-8 rounded-2xl border-2 border-[var(--border-color)] h-full shadow-2xl">
                  <div className="bg-[var(--primary)]/10 p-4 rounded-lg mb-4 border border-[var(--primary)]/30">
                    <h3 className="text-[var(--primary)] font-bold mb-2 text-xl">Losowe wyzwanie</h3>
                    <p className="text-white text-2xl font-medium">
                      Osoba z najdłuższymi włosami wybiera, kto ma wypić dwa shoty!
                    </p>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div>
                      <span className="text-[var(--text-gray)] text-sm">Tryb:</span>
                      <h4 className="text-[var(--secondary)] font-bold">CHAOS</h4>
                    </div>
                    <div>
                      <span className="text-[var(--text-gray)] text-sm">Czas:</span>
                      <div className="text-[var(--accent)] font-bold text-xl">03:42</div>
                    </div>
                  </div>
                  <div className="mt-8">
                    <button className="w-full btn btn-secondary mb-3">Kolejne wyzwanie</button>
                    <button className="w-full btn btn-outline">Pomiń</button>
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
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 
              variants={fadeIn}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              <span className="gradient-text">Najlepszy</span> generator imprezowych wyzwań
            </motion.h2>
            <motion.p 
              variants={fadeIn}
              className="text-[var(--text-gray)] max-w-2xl mx-auto"
            >
              Zapomnij o nudnych imprezach! WhatNow?! dostarczy Ci i Twoim znajomym godziny
              zabawy, śmiechu i niezapomnianych wspomnień.
            </motion.p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Różne tryby gry",
                description: "Wybierz spośród czterech trybów o różnym poziomie intensywności: Soft, Chaos, Hardcore i Quick.",
                icon: "🎮",
              },
              {
                title: "Timer i powiadomienia",
                description: "Nowe zadanie pojawia się co określony czas, zapewniając ciągłą rozrywkę.",
                icon: "⏱️",
              },
              {
                title: "Historia sesji",
                description: "Zapisuj wykonane zadania i śledź statystyki graczy przez całą imprezę.",
                icon: "📊",
              },
              {
                title: "Raport z imprezy",
                description: "Eksportuj historię jako PDF, by zachować wspomnienia z najlepszych momentów.",
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
      
      {/* Game modes section */}
      <section className="py-20 bg-[var(--container-color)]/30 backdrop-blur-sm border-t border-b border-[var(--border-color)]">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 
              variants={fadeIn}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Wybierz swój <span className="gradient-text">tryb gry</span>
            </motion.h2>
            <motion.p 
              variants={fadeIn}
              className="text-[var(--text-gray)] max-w-2xl mx-auto"
            >
              Każdy tryb oferuje inne doświadczenia, dostosowane do nastroju imprezy i preferencji graczy.
            </motion.p>
          </motion.div>
          
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {Object.keys(gameModes).map((mode) => (
              <button
                key={mode}
                onClick={() => setActiveMode(mode)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  activeMode === mode 
                    ? `bg-gradient-to-r ${gameModes[mode].color} text-white shadow-lg` 
                    : "bg-[var(--container-color)] text-[var(--text-gray)] hover:text-white"
                }`}
              >
                {gameModes[mode].title}
              </button>
            ))}
          </div>
          
          <motion.div
            key={activeMode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`card border-l-4 bg-gradient-to-r ${gameModes[activeMode].color}/10 max-w-3xl mx-auto`}
          >
            <h3 className={`text-2xl font-bold mb-3 text-white`}>
              {gameModes[activeMode].title}
            </h3>
            <p className="text-white mb-6">
              {gameModes[activeMode].description}
            </p>
            <div className="space-y-4">
              <h4 className="font-semibold text-white">Przykładowe wyzwania:</h4>
              <ul className="space-y-3">
                {gameModes[activeMode].examples.map((example, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className={`w-6 h-6 flex-shrink-0 rounded-full bg-gradient-to-r ${gameModes[activeMode].color} flex items-center justify-center text-xs text-white`}>
                      {index + 1}
                    </div>
                    <div className="text-white">{example}</div>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="card max-w-4xl mx-auto bg-gradient-to-br from-[var(--primary)]/20 to-[var(--secondary)]/20 border-[var(--border-color)]"
          >
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="w-full lg:w-2/3 text-center lg:text-left">
                <motion.h2 
                  variants={fadeIn}
                  className="text-3xl font-bold mb-3"
                >
                  Gotowy na <span className="gradient-text">imprezową rewolucję</span>?
                </motion.h2>
                <motion.p
                  variants={fadeIn}
                  className="text-[var(--text-gray)] mb-6"
                >
                  Dołącz już teraz i przekonaj się, jak WhatNow?! zmieni każdą Twoją imprezę w niezapomniane doświadczenie!
                </motion.p>
                <motion.div
                  variants={fadeIn}
                  className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                >
                  <a href="/play" className="btn btn-primary">Rozpocznij za darmo</a>
                  <a href="/premium" className="btn btn-secondary">Zobacz wersję Premium</a>
                </motion.div>
              </div>
              <motion.div
                variants={pulse}
                initial="initial"
                animate="animate"
                className="w-full lg:w-1/3 flex justify-center"
              >
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white text-5xl font-bold shadow-lg shadow-[var(--primary)]/30">
                  GO!
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
        
        {/* Background decorations */}
        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[var(--body-color)] to-transparent"></div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-[var(--border-color)]">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="gradient-text font-bold text-lg">WhatNow?!</div>
            <div className="text-[var(--text-gray)] text-sm">
              © 2023 WhatNow?! – Generator Chaosu. Wszystkie prawa zastrzeżone.
            </div>
            <div className="flex gap-4">
              <a href="/privacy" className="text-[var(--text-gray)] hover:text-[var(--primary)] transition-colors text-sm">
                Polityka prywatności
              </a>
              <a href="/terms" className="text-[var(--text-gray)] hover:text-[var(--primary)] transition-colors text-sm">
                Warunki korzystania
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
