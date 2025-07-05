"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RequestResetPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/auth/reset-password/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: 'Sprawdź swoją skrzynkę email, aby zresetować hasło.' 
        });
        // In development, show the token for testing
        if (process.env.NODE_ENV === 'development' && data.resetToken) {
          setMessage(prev => ({
            ...prev,
            text: `${prev.text} Token: ${data.resetToken}`
          }));
        }
      } else {
        setMessage({ 
          type: 'error', 
          text: data.error || 'Wystąpił błąd podczas wysyłania żądania resetowania hasła' 
        });
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Wystąpił błąd podczas wysyłania żądania resetowania hasła' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Zresetuj hasło</h2>
        
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
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Twój email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Wysyłanie...' : 'Wyślij link resetujący hasło'}
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