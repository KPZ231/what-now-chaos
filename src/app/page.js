"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/partial/navbar";
import Footer from "@/app/partial/footer";
import { useAuth } from "@/lib/AuthContext";
import SEO from "@/lib/SEO";
import AdComponent from "@/app/components/AdComponent";

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
      description: "Łagodne i bezpieczne wyzwania dla każdego. Idealne na początek imprezy!",
      color: "from-blue-500 to-purple-500",
      examples: [
        "Zamień się miejscem z osobą po lewej.",
        "Powiedz coś miłego każdemu graczowi."
      ]
    },
    chaos: {
      title: "Chaos",
      description: "Szalone i kreatywne zadania, które wywołują śmiech i niespodziewane sytuacje!",
      color: "from-pink-500 to-orange-500",
      examples: [
        "Wszyscy muszą mówić wspak przez 1 minutę.",
        "Kto pierwszy stanie na krześle, ten rządzi przez 1 rundę."
      ]
    },
    hardcore: {
      title: "Hardcore",
      description: "Odważne i wyzywające zadania dla prawdziwych imprezowiczów!",
      color: "from-red-500 to-rose-700",
      examples: [
        "Najmłodszy gracz pije 2x.",
        "Powiedz coś bardzo niewygodnego o sobie - albo pij."
      ]
    },
    quick: {
      title: "Quick",
      description: "Szybkie zadania, które natychmiast podkręcą atmosferę!",
      color: "from-amber-400 to-yellow-600",
      examples: [
        "Wszyscy klaszczą 3 razy. Kto nie zdąży, pije.",
        "Powiedz kolor skarpet osoby po lewej - albo pij."
      ]
    }
  };

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
  };

  // SEO structured data for homepage
  const homepageStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "WhatNow?! - Generator Imprezowego Chaosu",
    "url": "https://what-now-chaos.vercel.app",
    "description": "Ożyw swoją imprezę absurdalnymi i zabawnymi wyzwaniami, które zaskoczą Twoich znajomych i wywołają fale śmiechu!",
    "applicationCategory": "Entertainment",
    "operatingSystem": "Web, Android, iOS",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "PLN",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "27"
    },
    "author": {
      "@type": "Organization",
      "name": "WhatNow?!",
      "url": "https://what-now-chaos.vercel.app"
    }
  };

  // FAQ data for structured data
  const faqData = [
    {
      question: "Czym jest WhatNow?! - Generator Imprezowego Chaosu?",
      answer: "WhatNow?! to aplikacja webowa i mobilna (PWA), która co kilka minut rzuca grupie znajomych absurdalne, śmieszne lub wyzywające zadania do wykonania, zwiększając zabawę i chaos na imprezach."
    },
    {
      question: "Jakie tryby gry oferuje WhatNow?!?",
      answer: "WhatNow?! oferuje cztery różne tryby gry: Soft (łagodne zadania), Chaos (szalone i kreatywne), Hardcore (odważne i wyzywające) oraz Quick (szybkie zadania)."
    },
    {
      question: "Czy aplikacja WhatNow?! jest darmowa?",
      answer: "Tak, podstawowa wersja WhatNow?! jest całkowicie darmowa. Dostępne są również opcje premium z dodatkowymi funkcjami i pakietami zadań."
    },
    {
      question: "Czy mogę korzystać z WhatNow?! bez internetu?",
      answer: "Tak, WhatNow?! działa jako Progressive Web App (PWA), co oznacza, że możesz korzystać z aplikacji offline po jej wcześniejszym załadowaniu."
    },
    {
      question: "Czy mogę zapisać historię zadań z imprezy?",
      answer: "Tak, WhatNow?! umożliwia zapisywanie historii sesji, śledzenie statystyk graczy oraz eksport całej sesji jako Imprezowy Raport PDF."
    }
  ];

  // Breadcrumbs data
  const breadcrumbsData = [
    {
      name: "Strona główna",
      url: "/"
    }
  ];

  return (
    <>
      <SEO
        title="WhatNow?! - Generator Imprezowego Chaosu | Gra na Imprezy"
        description="Ożyw swoją imprezę absurdalnymi i zabawnymi wyzwaniami, które zaskoczą Twoich znajomych i wywołają fale śmiechu! Tryby gry: Soft, Chaos, Hardcore i Quick."
        canonicalUrl="/"
        ogImage="/logo.png"
        keywords={[
          "generator imprezowego chaosu",
          "gra imprezowa",
          "gra alkoholowa",
          "wyzwania imprezowe",
          "zadania na imprezę",
          "tryby gry imprezowej",
          "soft gra",
          "chaos gra",
          "hardcore gra",
          "quick gra",
          "aplikacja na imprezy",
          "zabawa w grupie",
          "wyzwania dla znajomych",
          "imprezowe wyzwania",
          "licznik zadań imprezowych",
          "historia sesji imprezowej",
          "raport z imprezy",
          "eksport PDF z imprezy"
        ]}
        structuredData={homepageStructuredData}
        faq={faqData}
        breadcrumbs={breadcrumbsData}
        language="pl"
      />
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
                <span className="text-white">Generator Imprezowego Chaosu</span>
              </motion.h1>

              <motion.p
                variants={fadeIn}
                className="text-base sm:text-lg md:text-xl text-[var(--text-gray)] mb-8 max-w-lg mx-auto lg:mx-0"
              >
                Ożyw swoją imprezę absurdalnymi i zabawnymi wyzwaniami, które zaskoczą Twoich znajomych i wywołają fale śmiechu!
              </motion.p>

              <motion.div
                variants={fadeIn}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Link href="/play" className="btn btn-primary w-full sm:w-auto text-center cursor-pointer">Rozpocznij Zabawę</Link>
                <Link href="/modes" className="btn btn-outline w-full sm:w-auto text-center cursor-pointer">Zobacz Tryby Gry</Link>
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
                    <h3 className="text-[var(--primary)] font-bold mb-2 text-xl">Losowe Wyzwanie</h3>
                    <p className="text-white text-xl sm:text-2xl font-medium">
                      Osoba z najdłuższymi włosami wybiera, kto musi wypić dwa shoty!
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
                    <button onClick={() => window.location.href = '/play'} className="w-full btn btn-secondary mb-3 cursor-pointer">Następne Wyzwanie</button>
                    <button onClick={() => window.location.href = '/play'} className="w-full btn btn-outline cursor-pointer">Pomiń</button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Display ad for non-premium users */}
        <div className="container mx-auto px-4 sm:px-6 mt-8">
          <AdComponent adSlot="1234567890" />
        </div>
      </section>
      
      {/* Features section */}
      <section className="py-20 bg-[var(--container-color)]/30 backdrop-blur-sm">
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
              <span className="gradient-text">Najlepszy</span> generator imprezowych wyzwań
            </motion.h2>
            <motion.p
              variants={fadeIn}
              className="text-[var(--text-gray)] max-w-2xl mx-auto px-4"
            >
              Zapomnij o nudnych imprezach! WhatNow?! zapewni Tobie i Twoim znajomym godziny
              zabawy, śmiechu i niezapomnianych wspomnień.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 sm:px-0">
            {[
              {
                title: "Różne Tryby Gry",
                description: "Wybieraj spośród czterech trybów o różnym poziomie intensywności: Soft, Chaos, Hardcore i Quick.",
                icon: "🎮",
              },
              {
                title: "Licznik i Powiadomienia",
                description: "Nowe wyzwanie pojawia się w ustalonym odstępie czasu, zapewniając ciągłą rozrywkę.",
                icon: "⏱️",
              },
              {
                title: "Historia Sesji",
                description: "Zapisuj wykonane wyzwania i śledź statystyki graczy podczas całej imprezy.",
                icon: "📊",
              },
              {
                title: "Raport z Imprezy",
                description: "Eksportuj historię jako PDF, aby zachować wspomnienia z najlepszych momentów.",
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
      
      {/* Display another ad for non-premium users */}
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <AdComponent adSlot="0987654321" adFormat="rectangle" />
      </div>
      
      {/* Game modes section */}
      <section className="py-20">
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
              Wybierz swój <span className="gradient-text">Tryb Gry</span>
            </motion.h2>
            <motion.p
              variants={fadeIn}
              className="text-[var(--text-gray)] max-w-2xl mx-auto px-4"
            >
              Każdy tryb oferuje inne doświadczenia i poziom intensywności. Wybierz odpowiedni dla swojego towarzystwa!
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Object.keys(gameModes).map((mode) => (
              <motion.div
                key={mode}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeIn}
                className={`card overflow-hidden cursor-pointer ${activeMode === mode ? 'border-[var(--primary)]' : ''}`}
                onClick={() => setActiveMode(mode)}
              >
                <div className={`absolute top-0 left-0 h-1 w-full bg-gradient-to-r ${gameModes[mode].color}`}></div>
                <h3 className="text-2xl font-bold mb-3">{gameModes[mode].title}</h3>
                <p className="text-[var(--text-gray)] mb-6">{gameModes[mode].description}</p>

                <div className="bg-[var(--container-color)]/50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-[var(--text-gray)] mb-2">Przykładowe zadania:</h4>
                  <ul className="space-y-2">
                    {gameModes[mode].examples.map((example, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-[var(--primary)] mt-1">•</span>
                        <span>{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeIn}
            className="mt-10 text-center"
          >
            <Link href="/modes" className="btn btn-primary">
              Dowiedz się więcej o trybach gry
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-16 sm:py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.h2
              variants={fadeIn}
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6"
            >
              Gotowy na <span className="gradient-text">niezapomnianą imprezę</span>?
            </motion.h2>
            <motion.p
              variants={fadeIn}
              className="text-[var(--text-gray)] text-lg mb-8"
            >
              Dołącz do tysięcy użytkowników, którzy już korzystają z WhatNow?! aby podkręcić atmosferę na swoich imprezach!
            </motion.p>
            <motion.div
              variants={fadeIn}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/play" className="btn btn-primary">
                Rozpocznij Zabawę
              </Link>
              {!isAuthenticated && (
                <Link href="/register" className="btn btn-outline">
                  Zarejestruj się za darmo
                </Link>
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* Background decorations */}
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-[var(--secondary)]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-[var(--primary)]/20 rounded-full blur-3xl"></div>
      </section>

      <Footer />
    </>
  );
}
