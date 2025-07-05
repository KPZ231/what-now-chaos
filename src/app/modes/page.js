"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';

export default function ModesPage() {
  const [activeMode, setActiveMode] = useState('soft');
  const { user } = useAuth();
  
  const modes = {
    soft: {
      title: "Soft",
      description: "Łagodne i bezpieczne wyzwania, idealne na rozgrzewkę lub bardziej towarzyskie spotkania. Zadania skupiają się na integracji, rozmowach i łatwiejszych aktywnościach.",
      color: "from-blue-500 to-purple-500",
      premium: false,
      examples: [
        "Zamień się miejscem z osobą po lewej.",
        "Powiedz coś miłego każdemu graczowi.",
        "Pokaż swoje ostatnie 3 zdjęcia w galerii telefonu.",
        "Opisz osobę po prawej trzema pozytywnymi słowami.",
        "Opowiedz o swoim najciekawszym hobby."
      ]
    },
    chaos: {
      title: "Chaos",
      description: "Szalone i kreatywne zadania wywołujące śmiech i niespodziewane sytuacje. Tryb ten wprowadza więcej energii i nieoczekiwanych zwrotów akcji na imprezie.",
      color: "from-pink-500 to-orange-500",
      premium: false,
      examples: [
        "Wszyscy muszą mówić wspak przez 1 minutę.",
        "Kto pierwszy stanie na krześle, ten rządzi przez 1 turę.",
        "Zamieńcie się ubraniami z osobą po prawej na 5 minut.",
        "Przez następne 2 minuty odpowiadaj na wszystkie pytania śpiewająco.",
        "Zrób najdziwniejszą minę jaką potrafisz i utrzymaj ją przez 30 sekund."
      ]
    },
    hardcore: {
      title: "Hardcore",
      description: "Odważne i wyzywające zadania dla prawdziwych imprezowiczów. Ten tryb zawiera zadania przeznaczone dla dorosłych, często związane z piciem i odważnymi wyzwaniami.",
      color: "from-red-500 to-rose-700",
      premium: true,
      examples: [
        "Najmłodszy gracz pije 2x.",
        "Powiedz coś bardzo niewygodnego o sobie – albo pij.",
        "Osoba z największą liczbą rodzeństwa pije tyle, ile ma rodzeństwa.",
        "Zrób 10 pompek albo wypij shota.",
        "Zagraj w 'nigdy przenigdy' - przegrany pije."
      ]
    },
    quick: {
      title: "Quick",
      description: "Szybkie zadania refleksowe, które natychmiast rozkręcą atmosferę. Ten tryb sprawdza refleks i koncentrację, wprowadzając element rywalizacji i szybkiej akcji.",
      color: "from-amber-400 to-yellow-600",
      premium: true,
      examples: [
        "Wszyscy klaszczą 3 razy. Kto nie zdąży, pije.",
        "Powiedz kolor skarpet osoby po lewej – albo pij.",
        "Kto ostatni dotknie podłogi - pije.",
        "Wstań i obróć się 3 razy. Kto zrobi to ostatni - pije.",
        "Pierwsza osoba, która znajdzie coś czerwonego i to przyniesie, wybiera kto pije."
      ]
    }
  };
  
  const isPremiumMode = (mode) => {
    return modes[mode].premium && (!user || !user.hasPremium);
  };

  return (
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
              Tryby Gry
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
                <div className="card p-6 relative overflow-hidden">
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
                    <h3 className="text-xl font-semibold mb-4">Przykładowe Zadania:</h3>
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
                        <h3 className="text-2xl font-bold mb-2">Tryb Premium</h3>
                        <p className="mb-6 max-w-md mx-auto text-[var(--text-gray)]">
                          Ten tryb gry jest dostępny tylko dla użytkowników z aktywną subskrypcją premium.
                        </p>
                        <Link href="/premium" className="btn btn-primary">
                          Odblokuj Premium
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
                Rozpocznij Grę
              </Link>
              <Link href="/" className="btn btn-outline">
                Wróć do Menu
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
} 