"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check if user is logged in on component mount
  useEffect(() => {
    async function loadUserFromCookies() {
      try {
        const res = await fetch('/api/auth/me', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          // Using credentials to ensure cookies are sent
          credentials: 'include',
        });
        
        if (res.ok) {
          const userData = await res.json();
          setUser(userData.user);
        }
      } catch (error) {
        console.error('Error loading user:', error);
        // In case of error, we assume user is not authenticated
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadUserFromCookies();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Błąd logowania');
      }

      setUser(data.user);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.message || 'Wystąpił błąd podczas logowania' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setIsLoading(true);
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
      router.push('/');
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (email, password, name) => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Błąd rejestracji');
      }

      return { success: true };
    } catch (error) {
      console.error('Register error:', error);
      return { 
        success: false, 
        error: error.message || 'Wystąpił błąd podczas rejestracji'
      };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        isAuthenticated: !!user, 
        login, 
        logout,
        register
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext); 