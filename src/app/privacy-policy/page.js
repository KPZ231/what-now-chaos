"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-[var(--container-color)] p-6 sm:p-8 rounded-xl shadow-lg"
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-[var(--text-white)]">Privacy Policy</h1>
        
        <div className="prose prose-invert max-w-none text-[var(--text-white)]">
          <p className="mb-4">Last Updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">1. Introduction</h2>
          <p>
            Welcome to WhatNow?! – Chaos Generator. This Privacy Policy explains how KPZsProductions ("we", "us", "our") collects, uses, and shares your information when you use our app.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">2. Information We Collect</h2>
          <p>We collect the following types of information:</p>
          <ul className="list-disc pl-5 my-3 space-y-2">
            <li><strong>Account Information:</strong> When you register, we collect your email and a password.</li>
            <li><strong>Profile Information:</strong> Optional information like your username and profile picture.</li>
            <li><strong>Game Data:</strong> Information about your game sessions, including tasks completed and settings chosen.</li>
            <li><strong>Payment Information:</strong> If you make purchases, payment details are processed by our payment processors.</li>
            <li><strong>Technical Information:</strong> Information about your device and how you interact with our app.</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">3. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul className="list-disc pl-5 my-3 space-y-2">
            <li>Provide, maintain, and improve our app</li>
            <li>Process transactions and send related information</li>
            <li>Send updates, security alerts, and support messages</li>
            <li>Respond to your comments and questions</li>
            <li>Develop new products and services</li>
            <li>Generate anonymous, aggregate statistics about app usage</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">4. Information Sharing and Disclosure</h2>
          <p>We may share your information with:</p>
          <ul className="list-disc pl-5 my-3 space-y-2">
            <li><strong>Service Providers:</strong> Companies that perform services for us</li>
            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
            <li><strong>Business Transfers:</strong> If we're involved in a merger, acquisition, or sale of assets</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">5. Your Choices</h2>
          <p>You can:</p>
          <ul className="list-disc pl-5 my-3 space-y-2">
            <li>Update your account information in your profile settings</li>
            <li>Opt out of marketing communications</li>
            <li>Request deletion of your account by contacting us</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">6. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your information. However, no method of transmission over the internet is 100% secure.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">7. Children's Privacy</h2>
          <p>
            Our app is not intended for children under 13, and we do not knowingly collect information from children under 13.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">8. Changes to This Policy</h2>
          <p>
            We may update this policy from time to time. We will notify you of any changes by posting the new policy on this page.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">9. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us at:{" "}
            <Link href="mailto:info@KPZsProductions.com" className="text-[var(--primary)] hover:underline">
              info@KPZsProductions.com
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
} 