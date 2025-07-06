"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function SubscriptionPolicy() {
  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-[var(--container-color)] p-6 sm:p-8 rounded-xl shadow-lg"
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-[var(--text-white)]">Subscription Policy</h1>
        
        <div className="prose prose-invert max-w-none text-[var(--text-white)]">
          <p className="mb-4">Last Updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">1. Subscription Services</h2>
          <p>
            WhatNow?! – Chaos Generator offers premium subscription services that provide access to additional content, features, and services. This policy outlines the terms and conditions for these subscriptions.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">2. Subscription Plans</h2>
          <p>
            We offer the following subscription options:
          </p>
          <ul className="list-disc pl-5 my-3 space-y-2">
            <li><strong>Monthly Plan:</strong> Access to premium features for one month, automatically renewed each month.</li>
            <li><strong>Annual Plan:</strong> Access to premium features for one year, automatically renewed annually at a discounted rate.</li>
            <li><strong>One-time Purchases:</strong> Specific premium content packages available for a one-time fee with permanent access.</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">3. Free Trial</h2>
          <p>
            We may offer free trial periods for our premium services. At the end of the trial period, your subscription will automatically convert to a paid subscription unless you cancel before the trial ends.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">4. Billing and Payments</h2>
          <p>
            By subscribing to our premium services:
          </p>
          <ul className="list-disc pl-5 my-3 space-y-2">
            <li>You authorize us to charge the payment method you provide on a recurring basis for the subscription plan you select.</li>
            <li>Payment will be charged at the beginning of your subscription period.</li>
            <li>For recurring subscriptions, payment will automatically renew unless you cancel at least 24 hours before the end of the current period.</li>
            <li>All fees are non-refundable except as required by law or as explicitly stated in this policy.</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">5. Cancellation</h2>
          <p>
            You can cancel your subscription at any time through your account settings. Upon cancellation:
          </p>
          <ul className="list-disc pl-5 my-3 space-y-2">
            <li>You will continue to have access to premium features until the end of your current billing period.</li>
            <li>No partial refunds will be issued for unused subscription periods.</li>
            <li>Your subscription will not automatically renew after the current billing period ends.</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">6. Price Changes</h2>
          <p>
            We may change our subscription fees at any time. Any price changes will apply to billing periods after the date of the change. We will notify you of any price changes before they take effect.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">7. Refunds</h2>
          <p>
            Generally, purchases are non-refundable. However, in exceptional circumstances, we may provide refunds at our sole discretion. If you believe you qualify for a refund, please contact our customer support.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">8. Account Termination</h2>
          <p>
            If we terminate your account for violation of our Terms of Service, you will not be entitled to a refund of any subscription fees.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">9. Changes to Subscription Services</h2>
          <p>
            We reserve the right to modify, suspend, or discontinue any part of our subscription services at any time. If we discontinue a subscription service entirely, we may provide a pro-rata refund for the unused portion of your subscription.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">10. Contact Us</h2>
          <p>
            If you have questions about our Subscription Policy, please contact us at:{" "}
            <Link href="mailto:info@KPZsProductions.com" className="text-[var(--primary)] hover:underline">
              info@KPZsProductions.com
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
} 