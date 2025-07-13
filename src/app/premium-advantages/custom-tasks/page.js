"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import Link from 'next/link';
import Footer from "@/app/partial/footer";
import Navbar from "@/app/partial/navbar";

export default function CustomTasksPage() {
  const [taskSets, setTaskSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTaskSet, setEditingTaskSet] = useState(null);
  
  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [mode, setMode] = useState('soft');
  const [tasks, setTasks] = useState(['']);
  const [isPublic, setIsPublic] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  
  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
  };
  
  // Fetch user's custom task sets
  useEffect(() => {
    async function fetchTaskSets() {
      try {
        if (!isLoading && user && user.hasPremium) {
          setLoading(true);
          const response = await fetch('/api/tasks/custom', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          });
          
          if (!response.ok) {
            throw new Error('Failed to fetch task sets');
          }
          
          const data = await response.json();
          setTaskSets(data.taskSets || []);
        } else if (!isLoading && (!user || !user.hasPremium)) {
          router.push('/premium');
        }
      } catch (err) {
        console.error('Error fetching task sets:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchTaskSets();
  }, [user, isLoading, router]);
  
  // Reset form
  const resetForm = () => {
    setName('');
    setDescription('');
    setMode('soft');
    setTasks(['']);
    setIsPublic(false);
    setEditingTaskSet(null);
  };
  
  // Add new task input
  const addTask = () => {
    setTasks([...tasks, '']);
  };
  
  // Remove task input
  const removeTask = (index) => {
    if (tasks.length > 1) {
      const newTasks = [...tasks];
      newTasks.splice(index, 1);
      setTasks(newTasks);
    }
  };
  
  // Update task content
  const updateTask = (index, value) => {
    const newTasks = [...tasks];
    newTasks[index] = value;
    setTasks(newTasks);
  };
  
  // Handle editing a task set
  const handleEdit = (taskSet) => {
    setEditingTaskSet(taskSet);
    setName(taskSet.name);
    setDescription(taskSet.description || '');
    setMode(taskSet.mode);
    setTasks(taskSet.tasks.map(task => task.content));
    setIsPublic(taskSet.isPublic);
    setShowCreateForm(true);
  };
  
  // Handle deleting a task set
  const handleDelete = async (taskSetId) => {
    if (!window.confirm('Czy na pewno chcesz usunąć ten zestaw zadań? Ta operacja jest nieodwracalna.')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/tasks/custom/${taskSetId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete task set');
      }
      
      // Remove from UI
      setTaskSets(taskSets.filter(set => set.id !== taskSetId));
    } catch (err) {
      console.error('Error deleting task set:', err);
      setError(err.message);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Filter out empty tasks
    const nonEmptyTasks = tasks.filter(task => task.trim() !== '');
    
    if (nonEmptyTasks.length === 0) {
      setError('Musisz dodać przynajmniej jedno zadanie');
      return;
    }
    
    try {
      const endpoint = editingTaskSet 
        ? `/api/tasks/custom/${editingTaskSet.id}` 
        : '/api/tasks/custom';
      
      const method = editingTaskSet ? 'PUT' : 'POST';
      
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name,
          description,
          mode,
          tasks: nonEmptyTasks,
          isPublic
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save task set');
      }
      
      const data = await response.json();
      
      // Update UI
      if (editingTaskSet) {
        setTaskSets(taskSets.map(set => 
          set.id === editingTaskSet.id ? data.taskSet : set
        ));
      } else {
        setTaskSets([...taskSets, data.taskSet]);
      }
      
      // Reset form and hide it
      resetForm();
      setShowCreateForm(false);
    } catch (err) {
      console.error('Error saving task set:', err);
      setError(err.message);
    }
  };
  
  // Redirect if not premium
  if (isLoading || !user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8">
        <div className="card p-8 max-w-md w-full text-center">
          <div className="animate-pulse">Ładowanie...</div>
        </div>
      </main>
    );
  }

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
      <main className="flex min-h-screen flex-col items-center justify-between p-5 sm:p-8">
        <div className="mt-[80px]"></div>
        <div className="w-full max-w-5xl flex flex-col items-center">
          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col items-center justify-center space-y-8 p-2 sm:p-6">
              <h1 className="text-3xl sm:text-4xl font-bold gradient-text text-center">
                Własne Zestawy Zadań
              </h1>
              
              {/* Navigation buttons */}
              <div className="flex justify-center space-x-4 w-full max-w-md">
                <Link href="/premium-advantages" className="btn btn-outline flex-1">
                  Powrót
                </Link>
                <button 
                  className="btn btn-primary flex-1"
                  onClick={() => {
                    resetForm();
                    setShowCreateForm(!showCreateForm);
                  }}
                >
                  {showCreateForm ? 'Anuluj' : 'Nowy Zestaw'}
                </button>
              </div>
              
              {/* Error message */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-white p-4 rounded-lg w-full max-w-md">
                  <p>{error}</p>
                  <button 
                    className="text-sm text-red-300 hover:text-white mt-2"
                    onClick={() => setError(null)}
                  >
                    Zamknij
                  </button>
                </div>
              )}
              
              {/* Create/Edit Form */}
              {showCreateForm && (
                <motion.div 
                  className="card w-full max-w-xl p-6"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <h2 className="text-xl font-semibold mb-4">
                    {editingTaskSet ? 'Edytuj Zestaw Zadań' : 'Utwórz Nowy Zestaw Zadań'}
                  </h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm mb-2">Nazwa zestawu *</label>
                      <input
                        type="text"
                        className="w-full p-3 bg-[var(--background-color)] rounded-md"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        maxLength={50}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm mb-2">Opis (opcjonalny)</label>
                      <textarea
                        className="w-full p-3 bg-[var(--background-color)] rounded-md"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={2}
                        maxLength={200}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm mb-2">Tryb gry *</label>
                      <select
                        className="w-full p-3 bg-[var(--background-color)] rounded-md"
                        value={mode}
                        onChange={(e) => setMode(e.target.value)}
                        required
                      >
                        <option value="soft">Soft</option>
                        <option value="chaos">Chaos</option>
                        <option value="hardcore">Hardcore</option>
                        <option value="quick">Quick</option>
                      </select>
                    </div>
                    
                    <div className="space-y-4">
                      <label className="block text-sm mb-2">Zadania *</label>
                      {tasks.map((task, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            className="w-full p-3 bg-[var(--background-color)] rounded-md"
                            value={task}
                            onChange={(e) => updateTask(index, e.target.value)}
                            placeholder={`Zadanie ${index + 1}`}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => removeTask(index)}
                            className="p-2 text-red-400 hover:text-red-300"
                            disabled={tasks.length <= 1}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      ))}
                      
                      <button
                        type="button"
                        onClick={addTask}
                        className="w-full p-2 border border-dashed border-[var(--primary)]/50 text-[var(--primary)] rounded-md hover:bg-[var(--primary)]/10"
                      >
                        + Dodaj zadanie
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isPublic"
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                        className="w-5 h-5"
                      />
                      <label htmlFor="isPublic" className="cursor-pointer">
                        Udostępnij publicznie (inni użytkownicy premium będą mogli korzystać z tego zestawu)
                      </label>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="btn btn-primary"
                      >
                        {editingTaskSet ? 'Zaktualizuj' : 'Utwórz'} Zestaw
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
              
              {/* Task Sets List */}
              <div className="w-full">
                <h3 className="text-lg font-semibold mb-3">Twoje zestawy zadań</h3>
                
                {loading ? (
                  <div className="text-center py-10">
                    <div className="animate-pulse">Ładowanie zestawów zadań...</div>
                  </div>
                ) : taskSets.length === 0 ? (
                  <div className="card p-6 text-center">
                    <p className="text-[var(--text-gray)]">Nie masz jeszcze żadnych własnych zestawów zadań.</p>
                    <p className="mt-2">Kliknij &quot;Nowy Zestaw&quot;, aby utworzyć swój pierwszy własny zestaw zadań.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {taskSets.map(taskSet => (
                      <div key={taskSet.id} className="card p-4 hover:bg-[var(--container-color)]/80 transition-all">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{taskSet.name}</h4>
                            <p className="text-sm text-[var(--text-gray)]">
                              Tryb: {taskSet.mode.charAt(0).toUpperCase() + taskSet.mode.slice(1)} | 
                              Zadania: {taskSet.tasks.length} | 
                              {taskSet.isPublic ? ' Publiczny' : ' Prywatny'}
                            </p>
                            {taskSet.description && (
                              <p className="text-sm mt-2">{taskSet.description}</p>
                            )}
                          </div>
                          
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(taskSet)}
                              className="p-2 text-blue-400 hover:text-blue-300"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(taskSet.id)}
                              className="p-2 text-red-400 hover:text-red-300"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
} 