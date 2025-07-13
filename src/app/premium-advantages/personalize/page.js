"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import Link from 'next/link';
import Footer from "@/app/partial/footer";
import Navbar from "@/app/partial/navbar";

const DEFAULT_THEMES = {
  neon: {
    name: 'Neon Party',
    background: '#120e29',
    container: '#1d1636',
    primary: '#ff4dbc',
    secondary: '#5b42f3',
    accent: '#3dffd8'
  },
  dark: {
    name: 'Dark Mode',
    background: '#121212',
    container: '#1e1e1e',
    primary: '#bb86fc',
    secondary: '#03dac6',
    accent: '#cf6679'
  },
  retro: {
    name: 'Retro Wave',
    background: '#2b213a',
    container: '#33294e',
    primary: '#f72585',
    secondary: '#4361ee',
    accent: '#4cc9f0'
  },
  forest: {
    name: 'Forest Night',
    background: '#10312b',
    container: '#1a3c35',
    primary: '#8fffbc',
    secondary: '#2ec4b6',
    accent: '#ff9f1c'
  },
  cosmic: {
    name: 'Cosmic Void',
    background: '#13151a',
    container: '#1c1f26',
    primary: '#ff00a0',
    secondary: '#7b00ff',
    accent: '#00ffff'
  }
};

export default function PersonalizePage() {
  const [currentTheme, setCurrentTheme] = useState('neon');
  const [customTheme, setCustomTheme] = useState({...DEFAULT_THEMES.neon});
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
  };
  
  // Load saved theme preferences from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('whatnow-theme');
      const savedCustomTheme = localStorage.getItem('whatnow-custom-theme');
      
      if (savedTheme) {
        setCurrentTheme(savedTheme);
        applyTheme(savedTheme === 'custom' ? 
          JSON.parse(savedCustomTheme || '{}') : 
          DEFAULT_THEMES[savedTheme]
        );
      }
      
      if (savedCustomTheme) {
        setCustomTheme(JSON.parse(savedCustomTheme));
      }
    }
  }, []);
  
  // Redirect non-premium users
  useEffect(() => {
    if (!isLoading && (!user || !user.hasPremium)) {
      router.push('/premium');
    }
  }, [user, isLoading, router]);
  
  // Apply theme to document
  const applyTheme = (theme) => {
    if (typeof window !== 'undefined') {
      document.documentElement.style.setProperty('--background-color', theme.background);
      document.documentElement.style.setProperty('--container-color', theme.container);
      document.documentElement.style.setProperty('--primary', theme.primary);
      document.documentElement.style.setProperty('--secondary', theme.secondary);
      document.documentElement.style.setProperty('--accent', theme.accent);
    }
  };
  
  // Select a theme
  const selectTheme = (themeKey) => {
    setCurrentTheme(themeKey);
    
    if (themeKey === 'custom') {
      applyTheme(customTheme);
      localStorage.setItem('whatnow-theme', 'custom');
      localStorage.setItem('whatnow-custom-theme', JSON.stringify(customTheme));
    } else {
      applyTheme(DEFAULT_THEMES[themeKey]);
      localStorage.setItem('whatnow-theme', themeKey);
    }
  };
  
  // Update custom theme
  const updateCustomTheme = (key, value) => {
    const updatedTheme = { ...customTheme, [key]: value };
    setCustomTheme(updatedTheme);
    
    if (currentTheme === 'custom') {
      applyTheme(updatedTheme);
      localStorage.setItem('whatnow-custom-theme', JSON.stringify(updatedTheme));
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
                Personalizacja Wyglądu
              </h1>
              
              {/* Navigation buttons */}
              <div className="flex justify-center w-full max-w-md">
                <Link href="/premium-advantages" className="btn btn-outline w-full">
                  Powrót
                </Link>
              </div>
              
              {/* Theme Selection */}
              <div className="card w-full max-w-md p-6">
                <h2 className="text-xl font-semibold mb-4">Wybierz motyw</h2>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {Object.keys(DEFAULT_THEMES).map(themeKey => (
                    <button
                      key={themeKey}
                      className={`p-4 rounded-md border-2 transition-all ${currentTheme === themeKey ? 'border-[var(--primary)]' : 'border-transparent hover:border-[var(--primary)]/50'}`}
                      onClick={() => selectTheme(themeKey)}
                      style={{
                        background: DEFAULT_THEMES[themeKey].background,
                      }}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <span className="font-medium text-white">{DEFAULT_THEMES[themeKey].name}</span>
                        <div className="flex space-x-2">
                          <div className="w-4 h-4 rounded-full" style={{ background: DEFAULT_THEMES[themeKey].primary }}></div>
                          <div className="w-4 h-4 rounded-full" style={{ background: DEFAULT_THEMES[themeKey].secondary }}></div>
                          <div className="w-4 h-4 rounded-full" style={{ background: DEFAULT_THEMES[themeKey].accent }}></div>
                        </div>
                      </div>
                    </button>
                  ))}
                  
                  <button
                    className={`p-4 rounded-md border-2 transition-all ${currentTheme === 'custom' ? 'border-[var(--primary)]' : 'border-transparent hover:border-[var(--primary)]/50'}`}
                    onClick={() => selectTheme('custom')}
                    style={{
                      background: customTheme.background,
                    }}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <span className="font-medium text-white">Własny Motyw</span>
                      <div className="flex space-x-2">
                        <div className="w-4 h-4 rounded-full" style={{ background: customTheme.primary }}></div>
                        <div className="w-4 h-4 rounded-full" style={{ background: customTheme.secondary }}></div>
                        <div className="w-4 h-4 rounded-full" style={{ background: customTheme.accent }}></div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
              
              {/* Custom Theme Editor */}
              <div className="card w-full max-w-md p-6">
                <h2 className="text-xl font-semibold mb-4">Własny motyw</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-2">Nazwa motywu</label>
                    <input
                      type="text"
                      className="w-full p-3 bg-[var(--background-color)] rounded-md"
                      value={customTheme.name}
                      onChange={(e) => updateCustomTheme('name', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-2">Kolor tła</label>
                    <div className="flex space-x-3">
                      <input
                        type="color"
                        value={customTheme.background}
                        onChange={(e) => updateCustomTheme('background', e.target.value)}
                        className="h-10 w-10 rounded border-none"
                      />
                      <input
                        type="text"
                        className="flex-1 p-3 bg-[var(--background-color)] rounded-md"
                        value={customTheme.background}
                        onChange={(e) => updateCustomTheme('background', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-2">Kolor kontenerów</label>
                    <div className="flex space-x-3">
                      <input
                        type="color"
                        value={customTheme.container}
                        onChange={(e) => updateCustomTheme('container', e.target.value)}
                        className="h-10 w-10 rounded border-none"
                      />
                      <input
                        type="text"
                        className="flex-1 p-3 bg-[var(--background-color)] rounded-md"
                        value={customTheme.container}
                        onChange={(e) => updateCustomTheme('container', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-2">Kolor podstawowy</label>
                    <div className="flex space-x-3">
                      <input
                        type="color"
                        value={customTheme.primary}
                        onChange={(e) => updateCustomTheme('primary', e.target.value)}
                        className="h-10 w-10 rounded border-none"
                      />
                      <input
                        type="text"
                        className="flex-1 p-3 bg-[var(--background-color)] rounded-md"
                        value={customTheme.primary}
                        onChange={(e) => updateCustomTheme('primary', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-2">Kolor drugorzędny</label>
                    <div className="flex space-x-3">
                      <input
                        type="color"
                        value={customTheme.secondary}
                        onChange={(e) => updateCustomTheme('secondary', e.target.value)}
                        className="h-10 w-10 rounded border-none"
                      />
                      <input
                        type="text"
                        className="flex-1 p-3 bg-[var(--background-color)] rounded-md"
                        value={customTheme.secondary}
                        onChange={(e) => updateCustomTheme('secondary', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-2">Kolor akcentu</label>
                    <div className="flex space-x-3">
                      <input
                        type="color"
                        value={customTheme.accent}
                        onChange={(e) => updateCustomTheme('accent', e.target.value)}
                        className="h-10 w-10 rounded border-none"
                      />
                      <input
                        type="text"
                        className="flex-1 p-3 bg-[var(--background-color)] rounded-md"
                        value={customTheme.accent}
                        onChange={(e) => updateCustomTheme('accent', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <button
                    className="w-full btn btn-primary mt-4"
                    onClick={() => selectTheme('custom')}
                  >
                    Zastosuj własny motyw
                  </button>
                </div>
              </div>
              
              {/* Theme Preview */}
              <div className="card w-full max-w-md p-6">
                <h2 className="text-xl font-semibold mb-4">Podgląd</h2>
                <div className="p-4 rounded-md" style={{ background: currentTheme === 'custom' ? customTheme.container : DEFAULT_THEMES[currentTheme].container }}>
                  <div className="space-y-4">
                    <h3 className="font-medium" style={{ color: currentTheme === 'custom' ? customTheme.primary : DEFAULT_THEMES[currentTheme].primary }}>
                      Nagłówek
                    </h3>
                    <p className="text-sm">To jest przykładowy tekst pokazujący, jak wygląda wybrana kolorystyka.</p>
                    <div className="flex space-x-2">
                      <button className="px-4 py-2 rounded-md" style={{ background: currentTheme === 'custom' ? customTheme.primary : DEFAULT_THEMES[currentTheme].primary, color: 'white' }}>
                        Przycisk główny
                      </button>
                      <button className="px-4 py-2 rounded-md" style={{ background: currentTheme === 'custom' ? customTheme.secondary : DEFAULT_THEMES[currentTheme].secondary, color: 'white' }}>
                        Przycisk drugi
                      </button>
                    </div>
                    <div className="h-4 w-full rounded-full" style={{ background: currentTheme === 'custom' ? customTheme.accent : DEFAULT_THEMES[currentTheme].accent }}></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
} 