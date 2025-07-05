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

// Utility function for input sanitization
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  // Replace potentially dangerous SQL characters
  return input.replace(/[';\\]/g, '');
};

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
          // Check if response is JSON
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const userData = await res.json();
            setUser(userData.user);
          }
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
      // Validate input before sending to server
      if (!email || !password) {
        return { 
          success: false, 
          error: 'Email i hasło są wymagane' 
        };
      }

      // Validate email format
      if (!emailRegex.test(email)) {
        return {
          success: false,
          error: 'Podany adres email jest nieprawidłowy'
        };
      }

      // Sanitize inputs
      const sanitizedEmail = sanitizeInput(email.trim().toLowerCase());

      setIsLoading(true);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: sanitizedEmail, password }),
        credentials: 'include',
      });
      
      // Check if response is JSON
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Serwer zwrócił nieprawidłową odpowiedź. Spróbuj ponownie później.");
      }

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
      // Validate input before sending to server
      if (!email || !password) {
        return { 
          success: false, 
          error: 'Email i hasło są wymagane' 
        };
      }

      // Validate email format
      if (!emailRegex.test(email)) {
        return {
          success: false,
          error: 'Podany adres email jest nieprawidłowy'
        };
      }

      // Validate password strength
      if (password.length < 6) {
        return {
          success: false,
          error: 'Hasło musi mieć co najmniej 6 znaków'
        };
      }

      // Sanitize inputs
      const sanitizedEmail = sanitizeInput(email.trim().toLowerCase());
      const sanitizedName = name ? sanitizeInput(name.trim()) : null;

      setIsLoading(true);
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: sanitizedEmail, 
          password, 
          name: sanitizedName 
        }),
        credentials: 'include',
      });

      // Check if response is JSON
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Serwer zwrócił nieprawidłową odpowiedź. Spróbuj ponownie później.");
      }

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