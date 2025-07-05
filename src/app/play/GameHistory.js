"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getGameHistory, exportGameSession, clearGameHistory } from '@/lib/gameStorage';
import Link from 'next/link';

export default function GameHistory({ onBack, user }) {
  const [history, setHistory] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Load history from localStorage on component mount
  useEffect(() => {
    const gameHistory = getGameHistory();
    setHistory(gameHistory);
  }, []);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} min ${remainingSeconds} sek`;
  };

  const handleExport = (sessionId) => {
    exportGameSession(sessionId);
  };

  const handleClearHistory = () => {
    clearGameHistory();
    setHistory([]);
    setSelectedSession(null);
    setIsDeleteModalOpen(false);
  };

  const isPremiumUser = user && user.hasPremium;

  return (
    <div className="flex flex-col space-y-6 p-2 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold gradient-text mb-4 sm:mb-0">
          Historia Gier
        </h1>
        <div className="flex space-x-3">
          <button 
            className="btn btn-outline"
            onClick={onBack}
          >
            Powrót
          </button>
          {history.length > 0 && (
            <button 
              className="btn btn-outline border-red-500 text-red-500"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              Wyczyść Historię
            </button>
          )}
        </div>
      </div>

      {history.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-lg mb-4">Brak zapisanych gier w historii.</p>
          <p className="text-[var(--text-gray)]">
            Rozegraj swoją pierwszą grę, aby zobaczyć tutaj jej podsumowanie.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List of sessions */}
          <div className="lg:col-span-1 card p-4 h-[70vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Zapisane sesje</h2>
            <div className="space-y-3">
              {history.map((session) => (
                <button
                  key={session.sessionId}
                  onClick={() => setSelectedSession(session)}
                  className={`block w-full text-left p-4 rounded-lg transition-all ${
                    selectedSession?.sessionId === session.sessionId
                      ? 'bg-[var(--primary)]/20 border border-[var(--primary)]/50'
                      : 'bg-[var(--container-color)]/50 hover:bg-[var(--container-color)] border border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium capitalize">{session.mode}</span>
                    <span className="text-xs text-[var(--text-gray)]">{formatDate(session.endTime)}</span>
                  </div>
                  <div className="text-sm text-[var(--text-gray)]">
                    <span>{session.playerCount} graczy</span>
                    <span className="mx-2">•</span>
                    <span>
                      {session.stats.completedTasks} wykonane / {session.stats.skippedTasks} pominięte
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Session details */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {selectedSession ? (
                <motion.div
                  key={selectedSession.sessionId}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="card p-6 h-[70vh] overflow-y-auto"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-1 capitalize">
                        {selectedSession.mode}
                      </h2>
                      <p className="text-[var(--text-gray)]">
                        {formatDate(selectedSession.endTime)}
                      </p>
                    </div>
                    
                    <div>
                      {isPremiumUser ? (
                        <button
                          onClick={() => handleExport(selectedSession.sessionId)}
                          className="btn btn-sm btn-outline"
                        >
                          Eksportuj PDF
                        </button>
                      ) : (
                        <Link href="/premium" className="btn btn-sm btn-outline">
                          <span className="bg-yellow-500 text-black text-xs px-1 py-0.5 rounded mr-2">PRO</span>
                          Eksport PDF
                        </Link>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="card p-3 text-center">
                      <div className="text-sm text-[var(--text-gray)]">Czas trwania</div>
                      <div className="text-lg font-medium">
                        {formatDuration(selectedSession.stats.totalDuration || 0)}
                      </div>
                    </div>
                    <div className="card p-3 text-center">
                      <div className="text-sm text-[var(--text-gray)]">Wykonane</div>
                      <div className="text-lg font-medium text-green-400">
                        {selectedSession.stats.completedTasks}
                      </div>
                    </div>
                    <div className="card p-3 text-center">
                      <div className="text-sm text-[var(--text-gray)]">Pominięte</div>
                      <div className="text-lg font-medium text-red-400">
                        {selectedSession.stats.skippedTasks}
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold mb-4">Przebieg gry</h3>
                  {selectedSession.taskHistory?.length > 0 ? (
                    <div className="space-y-3">
                      {selectedSession.taskHistory.map((task, index) => (
                        <div
                          key={`${task.id}-${index}`}
                          className={`p-4 rounded-lg border ${
                            task.completed
                              ? 'border-green-500/30 bg-green-500/5'
                              : task.expired
                              ? 'border-yellow-500/30 bg-yellow-500/5'
                              : 'border-red-500/30 bg-red-500/5'
                          }`}
                        >
                          <p className="mb-2">{task.content}</p>
                          <div className="flex justify-between text-xs text-[var(--text-gray)]">
                            <span>
                              {task.completed
                                ? '✅ Wykonane'
                                : task.expired
                                ? '⏱️ Czas minął'
                                : '❌ Pominięte'}
                            </span>
                            <span>{formatDate(task.timestamp)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[var(--text-gray)]">Brak zadań w historii.</p>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="card p-8 h-[70vh] flex items-center justify-center"
                >
                  <div className="text-center">
                    <p className="text-2xl mb-4">👈</p>
                    <p className="text-lg mb-2">Wybierz sesję gry</p>
                    <p className="text-[var(--text-gray)]">
                      Wybierz sesję z listy po lewej stronie, aby zobaczyć szczegóły.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="card p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Potwierdź usunięcie</h3>
            <p className="mb-6">
              Czy na pewno chcesz usunąć całą historię gier? Ta akcja jest nieodwracalna.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                className="btn btn-outline"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Anuluj
              </button>
              <button
                className="btn btn-primary bg-red-500 hover:bg-red-600"
                onClick={handleClearHistory}
              >
                Usuń historię
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 