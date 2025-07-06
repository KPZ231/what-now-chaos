"use client";

import Script from "next/script";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Reusable SEO component for page-level SEO optimization
 * 
 * @param {Object} props
 * @param {string} props.title - The page title
 * @param {string} props.description - The page description
 * @param {string} props.canonicalUrl - The canonical URL for the page
 * @param {string} props.ogImage - The Open Graph image URL
 * @param {string[]} props.keywords - Keywords for SEO
 * @param {Object} props.structuredData - Optional JSON-LD structured data
 * @param {boolean} props.noIndex - Whether to prevent search engines from indexing this page
 */
export default function SEO({
  title = "WhatNow?! - Party Chaos Generator",
  description = "Boost any party with absurd, funny, and challenging tasks for groups of friends. Different game modes, timer, and session history export!",
  canonicalUrl,
  ogImage = "/logo.png",
  keywords = [],
  structuredData = null,
  noIndex = false,
}) {
  // Construct canonical URL
  const baseUrl = "https://what-now-chaos.vercel.app";
  const pathname = usePathname();
  const fullCanonicalUrl = canonicalUrl ? `${baseUrl}${canonicalUrl}` : `${baseUrl}${pathname}`;
  
  // Default keywords if none provided
  const defaultKeywords = [
    "party game",
    "drinking game", 
    "challenges", 
    "fun activities", 
    "party tasks", 
    "random challenges", 
    "group games", 
    "party entertainment"
  ];
  
  const allKeywords = [...new Set([...defaultKeywords, ...keywords])].join(", ");
  
  // Default structured data for the app
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": title,
    "url": fullCanonicalUrl,
    "description": description,
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
      "url": baseUrl
    }
  };
  
  // Use provided structured data or default
  const finalStructuredData = structuredData || defaultStructuredData;
  
  // Update document meta tags
  useEffect(() => {
    // Update title
    document.title = title;
    
    // Update meta tags
    updateMetaTag("description", description);
    updateMetaTag("keywords", allKeywords);
    
    // Open Graph tags
    updateMetaTag("og:title", title, "property");
    updateMetaTag("og:description", description, "property");
    updateMetaTag("og:type", "website", "property");
    updateMetaTag("og:url", fullCanonicalUrl, "property");
    updateMetaTag("og:image", `${baseUrl}${ogImage}`, "property");
    updateMetaTag("og:site_name", "WhatNow?!", "property");
    
    // Twitter tags
    updateMetaTag("twitter:card", "summary_large_image", "name");
    updateMetaTag("twitter:title", title, "name");
    updateMetaTag("twitter:description", description, "name");
    updateMetaTag("twitter:image", `${baseUrl}${ogImage}`, "name");
    
    // Robot tags for indexing control
    if (noIndex) {
      updateMetaTag("robots", "noindex, nofollow");
    } else {
      updateMetaTag("robots", "index, follow");
    }
    
    // Update canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.href = fullCanonicalUrl;
    } else {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      canonicalLink.href = fullCanonicalUrl;
      document.head.appendChild(canonicalLink);
    }
    
    // Clean up function
    return () => {
      // Optional: remove tags when component unmounts
    };
  }, [title, description, fullCanonicalUrl, ogImage, allKeywords, noIndex]);
  
  // Helper function to update meta tags
  const updateMetaTag = (name, content, attributeName = "name") => {
    let metaTag = document.querySelector(`meta[${attributeName}="${name}"]`);
    if (metaTag) {
      metaTag.content = content;
    } else {
      metaTag = document.createElement('meta');
      metaTag.setAttribute(attributeName, name);
      metaTag.content = content;
      document.head.appendChild(metaTag);
    }
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <Script id={`json-ld-${pathname}`} type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(finalStructuredData)}
      </Script>
    </>
  );
} 