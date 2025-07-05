"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ResetPassword({ params }) {
  const { token } = params;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [isTokenValid, setIsTokenValid] = useState(null);

  useEffect(() => {
    // In a real application, you might want to verify the token on the server
    // before allowing the user to see this page
    if (!token) {
      setIsTokenValid(false);
      setMessage({
        type: 'error',
        text: 'Nieprawidłowy token resetowania hasła.'
      });
    } else {
      setIsTokenValid(true);
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    // Validate passwords
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Hasła nie są identyczne' });
      setIsSubmitting(false);
      return;
    }

    if (password.length < 6) {
      setMessage({ type: 'error', text: 'Hasło musi mieć co najmniej 6 znaków' });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/reset-password/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: 'Hasło zostało zresetowane pomyślnie. Za chwilę nastąpi przekierowanie do strony logowania.' 
        });
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setMessage({ 
          type: 'error', 
          text: data.error || 'Wystąpił błąd podczas resetowania hasła' 
        });
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Wystąpił błąd podczas resetowania hasła' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // If token validity check is still pending, show loading
  if (isTokenValid === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        </div>
      </div>
    );
  }

  // If token is invalid, show error message
  if (isTokenValid === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="p-4 mb-4 rounded-md bg-red-100 text-red-700">
            {message.text || 'Nieprawidłowy token resetowania hasła.'}
          </div>
          <div className="text-center">
            <Link href="/reset-password" className="font-bold text-purple-500 hover:text-purple-800">
              Wróć do strony resetowania hasła
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Ustaw nowe hasło</h2>
        
        {message.text && (
          <div 
            className={`mb-6 p-4 rounded-md ${
              message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Nowe hasło
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Nowe hasło"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
              Potwierdź nowe hasło
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="confirmPassword"
              type="password"
              placeholder="Potwierdź nowe hasło"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength="6"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Przetwarzanie...' : 'Zresetuj hasło'}
            </button>
          </div>
        </form>
        <div className="mt-6 text-center">
          <Link href="/login" className="font-bold text-sm text-purple-500 hover:text-purple-800">
            Wróć do logowania
          </Link>
        </div>
      </div>
    </div>
  );
} 