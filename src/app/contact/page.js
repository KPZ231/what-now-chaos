"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import NavbarWrapper from "@/app/components/NavbarWrapper";
import Footer from "@/app/partial/footer";
import SEO from "@/lib/SEO";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setFormStatus({
        type: 'error',
        message: 'Wszystkie pola są wymagane'
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormStatus({
        type: 'error',
        message: 'Podaj poprawny adres email'
      });
      return;
    }

    try {
      setFormStatus({
        type: 'loading',
        message: 'Wysyłanie wiadomości...'
      });
      
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Wystąpił błąd podczas wysyłania');
      }
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        message: ''
      });
      
      setFormStatus({
        type: 'success',
        message: 'Wiadomość wysłana pomyślnie! Odpowiemy tak szybko, jak to możliwe.'
      });
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setFormStatus({ type: '', message: '' });
      }, 5000);
      
    } catch (error) {
      console.error('Error sending message:', error);
      setFormStatus({
        type: 'error',
        message: error.message || 'Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie później.'
      });
    }
  };

  // Page structured data for SEO
  const contactPageStructuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Kontakt - WhatNow?! Generator Imprezowego Chaosu",
    "description": "Skontaktuj się z nami w sprawie aplikacji WhatNow?! - zadaj pytanie, zgłoś problem lub podziel się opinią.",
    "url": "https://what-now-chaos.vercel.app/contact",
    "mainEntity": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "contact@whatnow-app.com"
    }
  };

  return (
    <NavbarWrapper>
      <SEO
        title="Kontakt - WhatNow?! Generator Imprezowego Chaosu"
        description="Skontaktuj się z nami w sprawie aplikacji WhatNow?! - zadaj pytanie, zgłoś problem lub podziel się opinią."
        canonicalUrl="/contact"
        keywords={["kontakt", "formularz kontaktowy", "wsparcie", "pomoc", "whatnow"]}
        structuredData={contactPageStructuredData}
      />
      <main className="flex min-h-screen flex-col items-center justify-between p-4 sm:p-8 pt-20 pb-24">
        <div className='mt-[80px]'></div>
        <div className="w-full max-w-4xl flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <div className="flex flex-col items-center justify-center space-y-8 p-2 sm:p-6">
              <h1 className="text-3xl sm:text-4xl font-bold gradient-text text-center mb-4">
                Kontakt
              </h1>
              <p className="text-center text-[var(--text-gray)] max-w-2xl mb-4">
                Masz pytanie, sugestię lub znalazłeś błąd? Napisz do nas! Postaramy się odpowiedzieć jak najszybciej.
              </p>
              
              {/* Contact Form */}
              <div className="w-full max-w-lg">
                <div className="card p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-1">Imię*</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        placeholder="Twoje imię"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1">E-mail*</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        placeholder="Twój adres email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-1">Wiadomość*</label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        placeholder="Treść wiadomości"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                      />
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
                        {formStatus.type === 'loading' ? 'Wysyłanie...' : 'Wyślij wiadomość'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              
              {/* Alternative Contact */}
              <div className="mt-8 text-center">
                <h2 className="text-xl font-semibold mb-2">Inne sposoby kontaktu</h2>
                <p className="text-[var(--text-gray)]">
                  Możesz również skontaktować się z nami przez media społecznościowe lub email:
                </p>
                <div className="mt-4 flex justify-center gap-4">
                  <a href="mailto:contact@whatnow-app.com" className="text-[var(--primary)] hover:underline">
                    contact@whatnow-app.com
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </NavbarWrapper>
  );
} 