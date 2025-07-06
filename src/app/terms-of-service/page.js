"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function TermsOfService() {
  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-[var(--container-color)] p-6 sm:p-8 rounded-xl shadow-lg"
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-[var(--text-white)]">Terms of Service</h1>
        
        <div className="prose prose-invert max-w-none text-[var(--text-white)]">
          <p className="mb-4">Last Updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">1. Acceptance of Terms</h2>
          <p>
            By accessing or using WhatNow?! – Chaos Generator, you agree to these Terms of Service. If you do not agree, please do not use our app.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">2. Description of Service</h2>
          <p>
            WhatNow?! – Chaos Generator is an app that provides random, fun tasks for parties and social gatherings. The app includes both free and premium features.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">3. User Accounts</h2>
          <p>
            You may need to create an account to access certain features. You are responsible for:
          </p>
          <ul className="list-disc pl-5 my-3 space-y-2">
            <li>Maintaining the confidentiality of your account credentials</li>
            <li>All activities that occur under your account</li>
            <li>Notifying us immediately of any unauthorized use</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">4. User Content</h2>
          <p>
            You may submit content to our app, such as custom tasks or feedback. You retain ownership of your content, but grant us a license to use, modify, and display it in connection with the app.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">5. Prohibited Conduct</h2>
          <p>
            You agree not to:
          </p>
          <ul className="list-disc pl-5 my-3 space-y-2">
            <li>Use the app for any illegal purpose</li>
            <li>Submit content that is offensive, harmful, or violates others' rights</li>
            <li>Attempt to interfere with the app's operation or security</li>
            <li>Impersonate another person or entity</li>
            <li>Use the app to send unsolicited communications</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">6. Premium Features and Payments</h2>
          <p>
            We offer premium features for purchase. By making a purchase, you agree to:
          </p>
          <ul className="list-disc pl-5 my-3 space-y-2">
            <li>Pay all fees in the currency specified</li>
            <li>Provide accurate payment information</li>
            <li>The terms of any subscription service selected</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">7. Intellectual Property</h2>
          <p>
            All content, features, and functionality of the app, including text, graphics, logos, and code, are the exclusive property of KPZsProductions and are protected by copyright and other intellectual property laws.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">8. Disclaimer of Warranties</h2>
          <p>
            The app is provided "as is" and "as available" without warranties of any kind. We do not guarantee that the app will be uninterrupted, secure, or error-free.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">9. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, KPZsProductions shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the app.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">10. Changes to Terms</h2>
          <p>
            We may modify these Terms at any time. We will notify you of significant changes through the app or by email.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">11. Governing Law</h2>
          <p>
            These Terms shall be governed by the laws of Poland, without regard to its conflict of law provisions.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">12. Contact Us</h2>
          <p>
            If you have questions about these Terms, please contact us at:{" "}
            <Link href="mailto:info@KPZsProductions.com" className="text-[var(--primary)] hover:underline">
              info@KPZsProductions.com
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
} 