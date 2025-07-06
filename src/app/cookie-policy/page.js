"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function CookiePolicy() {
  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-[var(--container-color)] p-6 sm:p-8 rounded-xl shadow-lg"
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-[var(--text-white)]">Cookie Policy</h1>
        
        <div className="prose prose-invert max-w-none text-[var(--text-white)]">
          <p className="mb-4">Last Updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">1. Introduction</h2>
          <p>
            This Cookie Policy explains how KPZsProductions ("we", "us", "our") uses cookies and similar technologies on the WhatNow?! – Chaos Generator app and website. It explains what these technologies are and why we use them, as well as your rights to control our use of them.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">2. What Are Cookies?</h2>
          <p>
            Cookies are small text files that are stored on your computer or mobile device when you visit a website. They allow the website to recognize your device and remember if you've been to the website before. Cookies are widely used to make websites work more efficiently and provide information to the website owners.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">3. Types of Cookies We Use</h2>
          <p>
            We use the following types of cookies:
          </p>
          <ul className="list-disc pl-5 my-3 space-y-2">
            <li><strong>Essential Cookies:</strong> These cookies are necessary for the website to function properly. They enable basic functions like page navigation, access to secure areas, and game functionality.</li>
            <li><strong>Preference Cookies:</strong> These cookies allow us to remember choices you make and provide enhanced, personalized features. They may be set by us or by third-party providers whose services we have added to our pages.</li>
            <li><strong>Analytics Cookies:</strong> These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. They help us improve the way our website works.</li>
            <li><strong>Marketing Cookies:</strong> These cookies are used to track visitors across websites. They are used to display ads that are relevant and engaging for individual users.</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">4. Specific Cookies We Use</h2>
          <p>
            Here are some examples of the cookies we use:
          </p>
          <ul className="list-disc pl-5 my-3 space-y-2">
            <li><strong>Authentication:</strong> We use cookies to identify you when you visit our website and to help you use interactive features.</li>
            <li><strong>Session:</strong> We use cookies to maintain your session while you're using our app.</li>
            <li><strong>Preferences:</strong> We use cookies to remember your settings and preferences.</li>
            <li><strong>Security:</strong> We use cookies to help identify and prevent security risks.</li>
            <li><strong>Analytics:</strong> We use cookies to help us understand how our website is being used.</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">5. Third-Party Cookies</h2>
          <p>
            Some cookies are placed by third parties on our behalf. Third parties include search engines, providers of measurement and analytics services, social media networks, and advertising companies. These cookies enable:
          </p>
          <ul className="list-disc pl-5 my-3 space-y-2">
            <li>Integration with social platforms</li>
            <li>Usage statistics to improve our service and marketing</li>
            <li>Payment processing</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">6. Managing Cookies</h2>
          <p>
            Most web browsers allow you to control cookies through their settings preferences. However, limiting cookies may affect your experience of our website. Here's how to manage cookies in popular browsers:
          </p>
          <ul className="list-disc pl-5 my-3 space-y-2">
            <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies and other site data</li>
            <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</li>
            <li><strong>Safari:</strong> Preferences → Privacy → Cookies and website data</li>
            <li><strong>Edge:</strong> Settings → Site permissions → Cookies and site data</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">7. Your Choices</h2>
          <p>
            You have the right to decide whether to accept or reject cookies. You can exercise this right by adjusting your browser settings to refuse cookies. If you choose to reject cookies, you may still use our website, but your access to some functionality and areas may be restricted.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">8. Updates to This Cookie Policy</h2>
          <p>
            We may update this Cookie Policy from time to time in order to reflect changes to the cookies we use or for other operational, legal, or regulatory reasons. Please revisit this Cookie Policy regularly to stay informed about our use of cookies.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">9. Contact Us</h2>
          <p>
            If you have questions about our Cookie Policy, please contact us at:{" "}
            <Link href="mailto:info@KPZsProductions.com" className="text-[var(--primary)] hover:underline">
              info@KPZsProductions.com
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
} 