"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import Footer from "@/app/partial/footer";
import SEO from "@/lib/SEO";
import NavbarWrapper from "@/app/components/NavbarWrapper";

export default function TasksPage() {
  const [activeTab, setActiveTab] = useState('soft');
  const [tasks, setTasks] = useState({ soft: [], chaos: [], hardcore: [], quick: [] });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [difficulty, setDifficulty] = useState('all');
  const [playerCount, setPlayerCount] = useState('all');
  const { user } = useAuth();
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({
    content: '',
    difficulty: '1',
    players: 'one',
    category: 'soft'
  });
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });

  const modeInfo = {
    soft: {
      title: "Soft",
      description: "Łagodne i bezpieczne wyzwania, idealne na rozgrzewkę lub bardziej towarzyskie spotkania.",
      color: "from-blue-500 to-purple-500",
      premium: false,
    },
    chaos: {
      title: "Chaos",
      description: "Szalone i kreatywne zadania, które wywołują śmiech i niespodziewane sytuacje.",
      color: "from-pink-500 to-orange-500",
      premium: false,
    },
    hardcore: {
      title: "Hardcore",
      description: "Odważne i wyzywające zadania dla prawdziwych imprezowiczów.",
      color: "from-red-500 to-rose-700",
      premium: true,
    },
    quick: {
      title: "Quick",
      description: "Szybkie wyzwania na refleks, które natychmiast podkręcą atmosferę.",
      color: "from-amber-400 to-yellow-600",
      premium: true,
    }
  };

  // Load tasks from JSON files
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const taskTypes = ['soft', 'chaos', 'hardcore', 'quick'];
        const taskData = {};

        for (const type of taskTypes) {
          const response = await fetch(`/data/tasks-${type}.json`);
          const data = await response.json();
          taskData[type] = data.tasks || [];
        }

        setTasks(taskData);
      } catch (error) {
        console.error('Error loading tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Filter tasks based on search, difficulty, and player count
  const filteredTasks = tasks[activeTab]?.filter(task => {
    const matchesSearch = !filter || task.content.toLowerCase().includes(filter.toLowerCase());
    const matchesDifficulty = difficulty === 'all' || task.difficulty.toString() === difficulty;
    const matchesPlayers = playerCount === 'all' || task.players === playerCount;
    return matchesSearch && matchesDifficulty && matchesPlayers;
  });

  const isPremiumMode = (mode) => {
    return modeInfo[mode].premium && (!user || !user.hasPremium);
  };

  // Convert difficulty number to text
  const getDifficultyText = (difficulty) => {
    const difficultyMap = {
      1: 'Łatwe',
      2: 'Średnie',
      3: 'Trudne'
    };
    return difficultyMap[difficulty] || 'Nieznany';
  };

  // Convert player type to text
  const getPlayerTypeText = (playerType) => {
    const playerTypeMap = {
      'one': 'Pojedynczy gracz',
      'two': 'Dwóch graczy',
      'all': 'Wszyscy gracze',
      'half': 'Połowa graczy',
      'random': 'Losowi gracze'
    };
    return playerTypeMap[playerType] || playerType;
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmitTask = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!newTask.content.trim()) {
      setFormStatus({
        type: 'error',
        message: 'Treść zadania nie może być pusta'
      });
      return;
    }

    // Real API call to our endpoint
    try {
      setFormStatus({
        type: 'loading',
        message: 'Wysyłanie zadania...'
      });
      
      const response = await fetch('/api/tasks/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Wystąpił błąd podczas wysyłania');
      }
      
      // Reset form
      setNewTask({
        content: '',
        difficulty: '1',
        players: 'one',
        category: 'soft'
      });
      
      setFormStatus({
        type: 'success',
        message: 'Zadanie zostało pomyślnie zgłoszone! Dziękujemy za Twój wkład.'
      });
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setFormStatus({ type: '', message: '' });
      }, 5000);
      
    } catch (error) {
      console.error('Error submitting task:', error);
      setFormStatus({
        type: 'error',
        message: error.message || 'Wystąpił błąd podczas zgłaszania zadania. Spróbuj ponownie później.'
      });
    }
  };

  // Page structured data for SEO
  const tasksPageStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Lista Zadań - WhatNow?! Generator Imprezowego Chaosu",
    "description": "Przeglądaj pełną listę zadań i wyzwań dostępnych w aplikacji WhatNow?! - podzielonych na kategorie trudności i typu gry.",
    "url": "https://what-now-chaos.vercel.app/tasks",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": Object.keys(modeInfo).map((mode, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": modeInfo[mode].title,
        "description": modeInfo[mode].description,
        "url": `https://what-now-chaos.vercel.app/tasks#${mode}`
      }))
    }
  };

  return (
    <NavbarWrapper>
      <SEO
        title="Lista Zadań - WhatNow?! Generator Imprezowego Chaosu"
        description="Przeglądaj pełną listę zadań i wyzwań dostępnych w aplikacji WhatNow?! - podzielonych na kategorie trudności i typu gry."
        canonicalUrl="/tasks"
        keywords={["zadania imprezowe", "wyzwania imprezowe", "gry towarzyskie", "zadania na imprezę", "pomysły na zabawy imprezowe"]}
        structuredData={tasksPageStructuredData}
      />
      <main className="flex min-h-screen flex-col items-center justify-between p-4 sm:p-8 pt-20 pb-24">
         
         <div className='mt-[80px]'></div>
        <div className="w-full max-w-6xl flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <div className="flex flex-col items-center justify-center space-y-8 p-2 sm:p-6">
              <h1 className="text-3xl sm:text-4xl font-bold gradient-text text-center mb-4">
                Lista Wszystkich Zadań
              </h1>
              <p className="text-center text-[var(--text-gray)] max-w-2xl mb-4">
                Przeglądaj wszystkie dostępne zadania i wyzwania, podzielone na kategorie i tryby gry.
                Użyj filtrów, aby znaleźć zadania odpowiadające twoim preferencjom.
              </p>

              {/* Mode selector tabs */}
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {Object.keys(modeInfo).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setActiveTab(mode)}
                    className={`px-6 py-3 rounded-full transition-all ${activeTab === mode
                      ? 'bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/30'
                      : 'bg-[var(--container-color)] hover:bg-[var(--container-color)]/80'
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{modeInfo[mode].title}</span>
                      {modeInfo[mode].premium && (
                        <span className="bg-yellow-500 text-black text-xs px-1.5 py-0.5 rounded-full font-medium">
                          PREMIUM
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>

 {/* Task submission form */}
 <div className="w-full max-w-3xl mt-12">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <div className="card p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold">Zgłoś Nowe Zadanie</h2>
                      <button 
                        onClick={() => setShowForm(!showForm)} 
                        className="text-sm px-3 py-1 rounded-full bg-[var(--container-color)] hover:bg-[var(--container-color)]/80"
                      >
                        {showForm ? 'Zwiń' : 'Rozwiń'} formularz
                      </button>
                    </div>

                    <AnimatePresence>
                      {showForm && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <form onSubmit={handleSubmitTask} className="space-y-4">
                            <div>
                              <label htmlFor="content" className="block text-sm font-medium mb-1">Treść zadania*</label>
                              <textarea
                                id="content"
                                name="content"
                                rows={3}
                                className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                                placeholder="Wpisz treść zadania..."
                                value={newTask.content}
                                onChange={handleInputChange}
                                required
                              />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <label htmlFor="category" className="block text-sm font-medium mb-1">Kategoria*</label>
                                <select
                                  id="category"
                                  name="category"
                                  className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                                  value={newTask.category}
                                  onChange={handleInputChange}
                                  required
                                >
                                  <option value="soft">Soft</option>
                                  <option value="chaos">Chaos</option>
                                  <option value="hardcore">Hardcore</option>
                                  <option value="quick">Quick</option>
                                </select>
                              </div>
                              <div>
                                <label htmlFor="difficulty" className="block text-sm font-medium mb-1">Trudność*</label>
                                <select
                                  id="difficulty"
                                  name="difficulty"
                                  className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                                  value={newTask.difficulty}
                                  onChange={handleInputChange}
                                  required
                                >
                                  <option value="1">Łatwe</option>
                                  <option value="2">Średnie</option>
                                  <option value="3">Trudne</option>
                                </select>
                              </div>
                              <div>
                                <label htmlFor="players" className="block text-sm font-medium mb-1">Dla kogo*</label>
                                <select
                                  id="players"
                                  name="players"
                                  className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                                  value={newTask.players}
                                  onChange={handleInputChange}
                                  required
                                >
                                  <option value="one">Pojedynczy gracz</option>
                                  <option value="two">Dwóch graczy</option>
                                  <option value="all">Wszyscy gracze</option>
                                  <option value="half">Połowa graczy</option>
                                  <option value="random">Losowi gracze</option>
                                </select>
                              </div>
                            </div>

                            {/* Form status messages */}
                            {formStatus.message && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`p-3 rounded-lg ${
                                  formStatus.type === 'success' 
                                    ? 'bg-green-500/10 border border-green-500/30 text-green-400' 
                                    : formStatus.type === 'error'
                                      ? 'bg-red-500/10 border border-red-500/30 text-red-400'
                                      : 'bg-[var(--container-color)]'
                                }`}
                              >
                                {formStatus.type === 'loading' ? (
                                  <div className="flex items-center gap-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                                    <span>{formStatus.message}</span>
                                  </div>
                                ) : (
                                  formStatus.message
                                )}
                              </motion.div>
                            )}

                            <div className="flex justify-end pt-2">
                              <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={formStatus.type === 'loading'}
                              >
                                {formStatus.type === 'loading' ? 'Wysyłanie...' : 'Zgłoś zadanie'}
                              </button>
                            </div>
                          </form>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {!showForm && (
                      <p className="text-[var(--text-gray)]">
                        Masz pomysł na nowe zadanie? Rozwiń formularz i podziel się swoją kreatywnością z innymi graczami!
                      </p>
                    )}
                  </div>
                </motion.div>
              </div>
              {/* Filters */}
              <div className="w-full max-w-3xl bg-[var(--container-color)] rounded-xl p-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-4 items-stretch">
                  <div className="flex-1">
                    <label htmlFor="search" className="block text-sm font-medium mb-1">Szukaj zadania</label>
                    <input
                      type="text"
                      id="search"
                      className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                      placeholder="Wpisz słowo kluczowe..."
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                    />
                  </div>
                  <div className="flex-1 sm:flex-initial sm:w-32">
                    <label htmlFor="difficulty" className="block text-sm font-medium mb-1">Trudność</label>
                    <select
                      id="difficulty"
                      className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                    >
                      <option value="all">Wszystkie</option>
                      <option value="1">Łatwe</option>
                      <option value="2">Średnie</option>
                      <option value="3">Trudne</option>
                    </select>
                  </div>
                  <div className="flex-1 sm:flex-initial sm:w-40">
                    <label htmlFor="players" className="block text-sm font-medium mb-1">Gracze</label>
                    <select
                      id="players"
                      className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                      value={playerCount}
                      onChange={(e) => setPlayerCount(e.target.value)}
                    >
                      <option value="all">Wszyscy typy</option>
                      <option value="one">Pojedynczy</option>
                      <option value="two">Dwóch</option>
                      <option value="all">Cała grupa</option>
                      <option value="half">Połowa grupy</option>
                      <option value="random">Losowi</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Tasks List */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                >
                  <div className="card relative p-6 overflow-hidden" id={activeTab}>
                    {/* Background gradient */}
                    <div className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-20 bg-gradient-to-br ${modeInfo[activeTab].color}`}></div>

                    {/* Mode info header */}
                    <div className="mb-6 relative z-10">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-2xl font-bold">{modeInfo[activeTab].title}</h2>
                        {modeInfo[activeTab].premium && (
                          <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-2 py-0.5 rounded-full text-sm font-medium">
                            PREMIUM
                          </span>
                        )}
                      </div>
                      <p className="text-[var(--text-gray)]">{modeInfo[activeTab].description}</p>
                    </div>

                    {/* Loading state */}
                    {loading ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
                      </div>
                    ) : (
                      <>
                        {/* Stats */}
                        <div className="flex flex-wrap gap-4 mb-6">
                          <div className="bg-[var(--container-color)]/50 px-4 py-2 rounded-lg">
                            <span className="text-sm text-[var(--text-gray)]">Wszystkich zadań:</span>
                            <span className="ml-2 font-bold">{tasks[activeTab]?.length || 0}</span>
                          </div>
                          <div className="bg-[var(--container-color)]/50 px-4 py-2 rounded-lg">
                            <span className="text-sm text-[var(--text-gray)]">Wyfiltrowanych:</span>
                            <span className="ml-2 font-bold">{filteredTasks?.length || 0}</span>
                          </div>
                        </div>

                        {/* Tasks list */}
                        {!isPremiumMode(activeTab) ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredTasks?.length > 0 ? (
                              filteredTasks.map((task) => (
                                <motion.div
                                  key={task.id}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ duration: 0.2 }}
                                  className="bg-[var(--container-color)]/50 p-4 rounded-lg border border-[var(--border-color)] hover:border-[var(--primary)]/30 transition-colors"
                                >
                                  <div className="flex flex-col h-full">
                                    <div className="mb-2">
                                      <div className="text-lg font-medium">{task.content}</div>
                                    </div>
                                    <div className="mt-auto pt-3 flex flex-wrap gap-2 text-sm">
                                      <span className="bg-[var(--background)] px-2 py-0.5 rounded">
                                        {getDifficultyText(task.difficulty)}
                                      </span>
                                      <span className="bg-[var(--background)] px-2 py-0.5 rounded">
                                        {getPlayerTypeText(task.players)}
                                      </span>
                                      <span className="bg-[var(--background)] px-2 py-0.5 rounded opacity-60">
                                        ID: {task.id}
                                      </span>
                                    </div>
                                  </div>
                                </motion.div>
                              ))
                            ) : (
                              <div className="col-span-2 text-center py-8">
                                <p className="text-[var(--text-gray)] text-lg">Nie znaleziono zadań pasujących do podanych kryteriów</p>
                              </div>
                            )}
                          </div>
                        ) : (
                          // Premium lock overlay
                          <div className="relative bg-[var(--container-color)]/20 rounded-lg min-h-[300px] flex items-center justify-center">
                            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl">
                              <div className="text-center p-6">
                                <div className="text-5xl mb-4">🔒</div>
                                <h3 className="text-2xl font-bold mb-2">Zawartość Premium</h3>
                                <p className="mb-6 max-w-md mx-auto text-[var(--text-gray)]">
                                  Zadania z trybu {modeInfo[activeTab].title} są dostępne tylko dla użytkowników premium.
                                </p>
                                <Link href="/premium" className="btn btn-primary">
                                  Odblokuj Premium
                                </Link>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Call to action */}
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <Link href="/play" className="btn btn-primary">
                  Rozpocznij Grę
                </Link>
                <Link href="/modes" className="btn btn-outline">
                  Wróć do Trybów Gry
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </NavbarWrapper>
  );
}
