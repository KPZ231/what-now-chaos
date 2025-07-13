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
 * @param {Object[]} props.breadcrumbs - Optional breadcrumbs data for structured data
 * @param {Object[]} props.faq - Optional FAQ data for structured data
 * @param {string} props.language - Page language (defaults to 'pl')
 */
export default function SEO({
  title = "WhatNow?! - Generator Imprezowego Chaosu",
  description = "Ożyw każdą imprezę absurdalnymi, zabawnymi i wyzywającymi zadaniami dla grup znajomych. Różne tryby gry, licznik czasu i eksport historii sesji!",
  canonicalUrl,
  ogImage = "/logo.png",
  keywords = [],
  structuredData = null,
  noIndex = false,
  breadcrumbs = null,
  faq = null,
  language = "pl",
}) {
  // Construct canonical URL
  const baseUrl = "https://what-now-chaos.vercel.app";
  const pathname = usePathname();
  const fullCanonicalUrl = canonicalUrl ? `${baseUrl}${canonicalUrl}` : `${baseUrl}${pathname}`;
  
  // Default keywords if none provided
  const defaultKeywords = [
    "gra imprezowa",
    "gra alkoholowa", 
    "wyzwania imprezowe", 
    "zadania na imprezę", 
    "generator zadań", 
    "losowe wyzwania", 
    "gry grupowe", 
    "rozrywka na imprezę"
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
    "inLanguage": language,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "PLN",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "27"
    },
    "author": {
      "@type": "Organization",
      "name": "WhatNow?!",
      "url": baseUrl
    }
  };
  
  // Use provided structured data or default
  const finalStructuredData = structuredData || defaultStructuredData;
  
  // Create breadcrumbs structured data if provided
  let breadcrumbsStructuredData = null;
  if (breadcrumbs) {
    breadcrumbsStructuredData = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": `${baseUrl}${item.url}`
      }))
    };
  }
  
  // Create FAQ structured data if provided
  let faqStructuredData = null;
  if (faq && faq.length > 0) {
    faqStructuredData = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faq.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer
        }
      }))
    };
  }
  
  // Update document meta tags
  useEffect(() => {
    // Update title
    document.title = title;
    
    // Update meta tags
    updateMetaTag("description", description);
    updateMetaTag("keywords", allKeywords);
    
    // Language tag
    updateMetaTag("content-language", language);
    
    // Open Graph tags
    updateMetaTag("og:title", title, "property");
    updateMetaTag("og:description", description, "property");
    updateMetaTag("og:type", "website", "property");
    updateMetaTag("og:url", fullCanonicalUrl, "property");
    updateMetaTag("og:image", `${baseUrl}${ogImage}`, "property");
    updateMetaTag("og:site_name", "WhatNow?!", "property");
    updateMetaTag("og:locale", language === "pl" ? "pl_PL" : "en_US", "property");
    
    // Twitter tags
    updateMetaTag("twitter:card", "summary_large_image", "name");
    updateMetaTag("twitter:title", title, "name");
    updateMetaTag("twitter:description", description, "name");
    updateMetaTag("twitter:image", `${baseUrl}${ogImage}`, "name");
    
    // Robot tags for indexing control
    if (noIndex) {
      updateMetaTag("robots", "noindex, nofollow");
    } else {
      updateMetaTag("robots", "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1");
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
  }, [title, description, fullCanonicalUrl, ogImage, allKeywords, noIndex, language]);
  
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
      
      {/* Breadcrumbs Structured Data */}
      {breadcrumbsStructuredData && (
        <Script id={`json-ld-breadcrumbs-${pathname}`} type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify(breadcrumbsStructuredData)}
        </Script>
      )}
      
      {/* FAQ Structured Data */}
      {faqStructuredData && (
        <Script id={`json-ld-faq-${pathname}`} type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify(faqStructuredData)}
        </Script>
      )}
    </>
  );
} 