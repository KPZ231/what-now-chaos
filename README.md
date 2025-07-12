![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/KPZ231/what-now-chaos?utm_source=oss&utm_medium=github&utm_campaign=KPZ231%2Fwhat-now-chaos&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews)
# WhatNow?! - Party Chaos Generator

A web and mobile application (PWA) that throws absurd, funny, or challenging tasks at a group of friends every few minutes, increasing the fun and chaos at parties.

## Features

- Set up the number of players and choose a game mode
- Four game modes: Soft, Chaos, Hardcore, Quick
- Random task displayed every X minutes with a countdown and sound
- Option to skip tasks
- Session history: save completed tasks, player statistics
- Export session as a Party Report PDF
- Premium mode: additional task packs, customization, AI-generated tasks
- Colorful, party UI with animations

## Technologies

- Frontend: React (Next.js) + Tailwind CSS + Framer Motion
- Backend: Optionally Supabase/Firebase for storing accounts and payments
- PWA: Offline support as a Progressive Web App
- Monetization: Stripe/PayPal - one-time purchases and subscriptions
- PDF Export: jsPDF or pdfmake
- Audio: Sounds and animations for better UX


The app uses Stripe for processing premium plan payments. Here's how to set it up:

## SEO Optimizations

The website has been optimized for search engines with the following implementations:

### Meta Tags and Structured Data
- Comprehensive metadata in layout.js with proper title, description, and keywords
- Open Graph and Twitter card metadata for better social sharing
- JSON-LD structured data for rich search results
- Canonical URLs to prevent duplicate content issues

### Technical SEO
- Server-side rendering (SSR) for better indexability
- Proper use of semantic HTML elements
- Dynamic sitemap generation with /api/sitemap route
- Static sitemap.xml file
- Optimized robots.txt with specific crawler instructions
- Comprehensive headers configuration in next.config.mjs

### Page-Level SEO
- Reusable SEO component (src/lib/SEO.js) for consistent implementation across pages
- Page-specific metadata and structured data
- Keyword optimization based on content
- Proper heading hierarchy (h1, h2, h3)

### Performance Optimizations
- Image optimization with Next.js Image component
- Font optimization with next/font
- Gzip compression enabled
- PWA configuration for mobile users
- Cache control headers for static assets

### Multilingual Support
- Content translated to English for broader reach
- Language attribute set correctly in HTML tag

### SEO-Friendly URLs
- Clean URL structure
- Proper redirects for common URL patterns
- Trailing slashes for consistency

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) to see the app

## License

Copyright © 2023 KPZsProductions. All rights reserved.
