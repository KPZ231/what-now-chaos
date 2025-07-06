"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Script from 'next/script';

export default function Footer() {
    return (
        <>
            <motion.footer
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="bg-[var(--container-color)]/90 backdrop-blur-sm z-50 py-6 px-4 sm:px-6 border-t border-[var(--border-color)]"
            >
                <div className="container mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-2">
                            <Link href="/">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white font-bold text-xs">
                                    W!
                                </div>
                            </Link>

                            <p className="text-xs sm:text-sm text-[var(--text-white)]">
                                &copy; {new Date().getFullYear()} KPZsProductions. Wszelkie prawa zastrzeżone.
                            </p>
                        </div>

                        {/* Social Media Links */}
                        <div className="flex items-center gap-4">
                            <Link href="https://www.facebook.com/KPZsProductions" className="hover:opacity-80 transition-opacity">
                                <div className="w-8 h-8 rounded-full bg-[var(--container-color)] flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[var(--text-gray)]" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                    </svg>
                                </div>
                            </Link>

                            <Link href="https://www.instagram.com/KPZsProductions" className="hover:opacity-80 transition-opacity">
                                <div className="w-8 h-8 rounded-full bg-[var(--container-color)] flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[var(--text-gray)]" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                    </svg>
                                </div>
                            </Link>

                            <Link href="https://www.linkedin.com/in/KPZsProductions" className="hover:opacity-80 transition-opacity">
                                <div className="w-8 h-8 rounded-full bg-[var(--container-color)] flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[var(--text-gray)]" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                    </svg>
                                </div>
                            </Link>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-col md:flex-row justify-between gap-6">
                        {/* Important Links */}
                        <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2">
                            <Link href="/privacy-policy" className="text-xs sm:text-sm text-[var(--text-gray)] hover:text-white transition-colors">Polityka Prywatności</Link>
                            <Link href="/terms-of-service" className="text-xs sm:text-sm text-[var(--text-gray)] hover:text-white transition-colors">Regulamin</Link>
                            <Link href="/subscription-policy" className="text-xs sm:text-sm text-[var(--text-gray)] hover:text-white transition-colors">Zasady Subskrypcji</Link>
                            <Link href="/cookie-policy" className="text-xs sm:text-sm text-[var(--text-gray)] hover:text-white transition-colors">Polityka Cookies</Link>
                        </div>

                        {/* Contact */}
                        <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 md:mt-0">
                            <Link href="tel:+48790000000" className="text-xs sm:text-sm text-[var(--text-gray)] hover:text-white transition-colors flex items-center gap-1">
                                <span>📞</span> +48 790 000 000
                            </Link>
                            <Link href="mailto:info@KPZsProductions.com" className="text-xs sm:text-sm text-[var(--text-gray)] hover:text-white transition-colors flex items-center gap-1">
                                <span>✉️</span> info@KPZsProductions.com
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.footer>
            
            {/* JSON-LD Structured Data */}
            <Script id="json-ld" type="application/ld+json" strategy="afterInteractive">
                {`
                {
                    "@context": "https://schema.org",
                    "@type": "WebApplication",
                    "name": "WhatNow?! - Generator Imprezowego Chaosu",
                    "url": "https://what-now-chaos.vercel.app/",
                    "description": "Ożyw każdą imprezę absurdalnymi, zabawnymi i wyzywającymi zadaniami dla grup znajomych. Różne tryby gry, licznik czasu i eksport historii sesji!",
                    "applicationCategory": "Entertainment",
                    "operatingSystem": "Web, Android, iOS",
                    "offers": {
                        "@type": "Offer",
                        "price": "0",
                        "priceCurrency": "USD",
                        "availability": "https://schema.org/InStock"
                    },
                    "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": "4.8",
                        "ratingCount": "27"
                    },
                    "author": {
                        "@type": "Organization",
                        "name": "KPZsProductions",
                        "url": "https://what-now-chaos.vercel.app/"
                    }
                }
                `}
            </Script>
        </>
    );
}