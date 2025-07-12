'use client'

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import NavbarWrapper from "@/app/components/NavbarWrapper";
import MobileNavbar from "@/app/partial/mobile-navbar";
import Footer from "@/app/partial/footer";
import SEO from "@/lib/SEO";

export default function AboutPage() {
    const [activeMode, setActiveMode] = useState("chaos");
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [submitStatus, setSubmitStatus] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5
            }
        }
    };

    const handleFormChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage('');
        
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Nie udało się wysłać wiadomości');
            }
            
            // Success
            setSubmitStatus('success');
            
            // Reset form after success
            setTimeout(() => {
                setFormData({
                    name: '',
                    email: '',
                    message: ''
                });
                setSubmitStatus(null);
            }, 5000);
            
        } catch (error) {
            console.error('Error submitting form:', error);
            setErrorMessage(error.message || 'Coś poszło nie tak. Spróbuj ponownie.');
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Structured data for this page
    const aboutPageStructuredData = {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "name": "O KPZsProductions - WhatNow?! Generator Imprezowego Chaosu",
        "description": "Poznaj twórców WhatNow?! Generator Imprezowego Chaosu — gry imprezowej, która wnosi zabawę i wyzwania na Twoje spotkania.",
        "publisher": {
            "@type": "Organization",
            "name": "KPZsProductions",
            "logo": {
                "@type": "ImageObject",
                "url": "https://what-now-chaos.vercel.app/logo.png"
            }
        }
    };

    return (
        <>
            <SEO 
                title="O nas - WhatNow?! Generator Imprezowego Chaosu"
                description="Poznaj twórców WhatNow?! Generator Imprezowego Chaosu — gry imprezowej, która wnosi zabawę i wyzwania na Twoje spotkania."
                canonicalUrl="/about"
                keywords={["o nas", "twórcy gier imprezowych", "twórcy gier", "KPZsProductions"]}
                structuredData={aboutPageStructuredData}
            />
            
            <NavbarWrapper>
                <div className="container mx-auto px-4 pb-24 md:pb-16">
                    {/* Hero Section */}
                    <div className="mb-32"></div>
                    <motion.div 
                        className="mb-12 text-center"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">O KPZsProductions</h1>
                        <div className="w-32 h-1 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] mx-auto mb-6 rounded-full"></div>
                        <p className="text-lg md:text-xl text-[var(--text-gray)] max-w-2xl mx-auto">
                            Tworzymy innowacyjne gry i rozwiązania programistyczne z pasją i kreatywnością
                        </p>
                    </motion.div>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 gap-8 mb-16">
                        {/* Main Content */}
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="card relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-[var(--accent)] to-transparent opacity-10 rounded-bl-full"></div>
                            
                            <motion.div variants={itemVariants} className="mb-8">
                                <h2 className="text-2xl font-semibold mb-3 text-[var(--primary)]">Kim jesteśmy</h2>
                                <p className="text-lg">
                                    KPZsProductions prowadzi młody programista i twórca gier, obecnie uczęszczający do trzeciej klasy liceum o profilu programistycznym. Pasja do kodowania rozpoczęła się w wieku 10 lat i od tamtej pory nieustannie rozwijają się umiejętności w zakresie tworzenia oprogramowania oraz gier.
                                </p>
                            </motion.div>

                            <motion.div variants={itemVariants} className="mb-8">
                                <h2 className="text-2xl font-semibold mb-3 text-[var(--secondary)]">Nasze zainteresowania</h2>
                                <p className="text-lg">
                                    Szczególnie interesuje nas tworzenie gier wideo, ponieważ pozwalają one łączyć kreatywność z rozwiązywaniem problemów w niezwykle angażujący sposób. Lubimy również pracować nad projektami programistycznymi, które czynią codzienne zadania bardziej efektywnymi i przyjaznymi dla użytkownika.
                                </p>
                            </motion.div>

                            <motion.div variants={itemVariants} className="mb-8">
                                <h2 className="text-2xl font-semibold mb-3 text-[var(--accent)]">Umiejętności techniczne</h2>
                                <p className="text-lg">
                                    KPZsProductions biegle posługuje się kilkoma językami programowania, w tym HTML, CSS, JavaScript, PHP, C#, C++, oraz SQL, a także posiada podstawową znajomość Pythona, która jest obecnie rozwijana.
                                </p>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <h2 className="text-2xl font-semibold mb-3 text-[var(--primary)]">Nasz cel</h2>
                                <p className="text-lg">
                                    Dzięki tym umiejętnościom możliwa była praca nad różnymi projektami – od tworzenia stron internetowych po bardziej złożone oprogramowanie i programowanie gier. Naszym celem jest dalsze doskonalenie kompetencji oraz eksplorowanie nowych technologii w celu tworzenia innowacyjnych rozwiązań.
                                </p>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.4 }}
                        className="card relative overflow-hidden"
                    >
                        <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-[var(--primary-dark)] to-transparent opacity-10 rounded-full"></div>
                        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-tl from-[var(--secondary-dark)] to-transparent opacity-10 rounded-full"></div>
                        
                        <h2 className="text-3xl font-bold text-center gradient-text mb-8">Skontaktuj się z nami</h2>
                        
                        {submitStatus === 'success' ? (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-[var(--accent-dark)] bg-opacity-20 border border-[var(--accent)] text-[var(--accent)] p-4 rounded-lg text-center"
                            >
                                <p className="text-lg font-medium">Wiadomość została pomyślnie wysłana!</p>
                                <p className="text-sm mt-1">Wkrótce się odezwiemy.</p>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {submitStatus === 'error' && (
                                    <div className="bg-red-900 bg-opacity-20 border border-red-500 text-red-300 p-3 rounded-lg">
                                        <p>{errorMessage || 'Nie udało się wysłać wiadomości. Spróbuj ponownie.'}</p>
                                    </div>
                                )}
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-[var(--text-gray)] mb-2">Twoje imię</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleFormChange}
                                            required
                                            disabled={isSubmitting}
                                            className="w-full bg-[var(--body-color)] border border-[var(--border-color)] rounded-lg p-3 text-[var(--text-white)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-[var(--text-gray)] mb-2">Twój email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleFormChange}
                                            required
                                            disabled={isSubmitting}
                                            className="w-full bg-[var(--body-color)] border border-[var(--border-color)] rounded-lg p-3 text-[var(--text-white)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-[var(--text-gray)] mb-2">Twoja wiadomość</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleFormChange}
                                        rows="5"
                                        required
                                        disabled={isSubmitting}
                                        className="w-full bg-[var(--body-color)] border border-[var(--border-color)] rounded-lg p-3 text-[var(--text-white)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                                    ></textarea>
                                </div>
                                <motion.button
                                    type="submit"
                                    className="btn btn-primary w-full md:w-auto"
                                    whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(255, 77, 188, 0.5)" }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Wysyłanie...
                                        </span>
                                    ) : (
                                        "Wyślij wiadomość"
                                    )}
                                </motion.button>
                            </form>
                        )}
                    </motion.div>
                </div>
                
                <Footer />
            </NavbarWrapper>
        </>
    );
}