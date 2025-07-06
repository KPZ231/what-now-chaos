'use client'

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/partial/navbar";
import { useAuth } from "@/lib/AuthContext";

export default function Home() {
    const [activeMode, setActiveMode] = useState("chaos");
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { user, isLoading, isAuthenticated, logout } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [submitStatus, setSubmitStatus] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogout = async () => {
        await logout();
        setShowUserMenu(false);
    };

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
                throw new Error(data.error || 'Failed to send message');
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
            setErrorMessage(error.message || 'Something went wrong. Please try again.');
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

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
            <main className="container mx-auto px-4 py-8 max-w-5xl">
                {/* Hero Section */}
                <motion.div 
                    className="mb-12 text-center"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-5xl font-bold gradient-text mb-4">About KPZsProductions</h1>
                    <div className="w-32 h-1 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] mx-auto mb-6 rounded-full"></div>
                    <p className="text-xl text-[var(--text-gray)] max-w-2xl mx-auto">
                        Creating innovative games and software solutions with passion and creativity
                    </p>
                </motion.div>

                {/* Main Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {/* Left Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="md:col-span-1"
                    >
                        <div className="card mb-6 glow">
                            <h3 className="text-xl font-semibold text-[var(--primary)] mb-3">Our Skills</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span>HTML/CSS/JavaScript</span>
                                        <span>95%</span>
                                    </div>
                                    <div className="h-2 bg-[var(--container-color)] rounded-full">
                                        <div className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-full" style={{ width: '95%' }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span>C# / C++</span>
                                        <span>90%</span>
                                    </div>
                                    <div className="h-2 bg-[var(--container-color)] rounded-full">
                                        <div className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-full" style={{ width: '90%' }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span>PHP / SQL</span>
                                        <span>85%</span>
                                    </div>
                                    <div className="h-2 bg-[var(--container-color)] rounded-full">
                                        <div className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-full" style={{ width: '85%' }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span>Python</span>
                                        <span>70%</span>
                                    </div>
                                    <div className="h-2 bg-[var(--container-color)] rounded-full">
                                        <div className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-full" style={{ width: '70%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <motion.div 
                            className="card text-center"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Link 
                                href="https://kpz231.github.io/KPZsProduction_Website/about.html" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="btn btn-primary w-full"
                            >
                                Visit Our Website
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Main Content */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="card md:col-span-2 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-[var(--accent)] to-transparent opacity-10 rounded-bl-full"></div>
                        
                        <motion.div variants={itemVariants} className="mb-8">
                            <h2 className="text-2xl font-semibold mb-3 text-[var(--primary)]">Who We Are</h2>
                            <p className="text-lg">
                                KPZsProductions is run by a young software and game developer currently in the third year of high school,
                                specializing in programming. The passion for coding began at the age of 10, and since then, 
                                there has been continuous development in both software and game development skills.
                            </p>
                        </motion.div>

                        <motion.div variants={itemVariants} className="mb-8">
                            <h2 className="text-2xl font-semibold mb-3 text-[var(--secondary)]">Our Focus</h2>
                            <p className="text-lg">
                                We are particularly interested in creating video games, as they allow us to combine creativity with problem-solving 
                                in a highly engaging way. We also enjoy working on software projects that can make everyday tasks more 
                                efficient and user-friendly.
                            </p>
                        </motion.div>

                        <motion.div variants={itemVariants} className="mb-8">
                            <h2 className="text-2xl font-semibold mb-3 text-[var(--accent)]">Technical Skills</h2>
                            <p className="text-lg">
                                KPZsProductions is proficient in several programming languages, including HTML, CSS, JavaScript, PHP, C#, C++, and SQL,
                                with a foundational understanding of Python that is currently being explored further.
                            </p>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <h2 className="text-2xl font-semibold mb-3 text-[var(--primary)]">Our Goal</h2>
                            <p className="text-lg">
                                These skills have allowed work on various projects, from web development to more complex software and game programming.
                                The goal is to continue improving abilities and exploring new technologies to create innovative solutions.
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
                    
                    <h2 className="text-3xl font-bold text-center gradient-text mb-8">Get In Touch</h2>
                    
                    {submitStatus === 'success' ? (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-[var(--accent-dark)] bg-opacity-20 border border-[var(--accent)] text-[var(--accent)] p-4 rounded-lg text-center"
                        >
                            <p className="text-lg font-medium">Message sent successfully!</p>
                            <p className="text-sm mt-1">We'll get back to you soon.</p>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {submitStatus === 'error' && (
                                <div className="bg-red-900 bg-opacity-20 border border-red-500 text-red-300 p-3 rounded-lg">
                                    <p>{errorMessage || 'Failed to send message. Please try again.'}</p>
                                </div>
                            )}
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-[var(--text-gray)] mb-2">Your Name</label>
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
                                    <label htmlFor="email" className="block text-[var(--text-gray)] mb-2">Your Email</label>
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
                                <label htmlFor="message" className="block text-[var(--text-gray)] mb-2">Your Message</label>
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
                                        Sending...
                                    </span>
                                ) : "Send Message"}
                            </motion.button>
                        </form>
                    )}
                </motion.div>
            </main>
        </>
    );
}