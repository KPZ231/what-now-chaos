import { Montserrat } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/lib/AuthContext';
import MobileNavbar from './partial/mobile-navbar';
import Script from "next/script";
import PWAWrapper from './components/PWAWrapper';
import CookieConsent from './components/CookieConsent';

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "WhatNow?! - Generator Imprezowego Chaosu",
  description: "Ożyw każdą imprezę absurdalnymi, zabawnymi i wyzywającymi zadaniami dla grup znajomych. Różne tryby gry: Soft, Chaos, Hardcore i Quick. Licznik czasu, historia sesji i eksport raportów!",
  keywords: [
    "gra imprezowa", 
    "gra alkoholowa", 
    "wyzwania imprezowe", 
    "zadania na imprezę", 
    "generator zadań", 
    "losowe wyzwania", 
    "gry grupowe", 
    "rozrywka na imprezę",
    "aplikacja na imprezy",
    "zabawa w grupie",
    "wyzwania dla znajomych",
    "imprezowe wyzwania",
    "licznik zadań",
    "historia sesji",
    "raport z imprezy",
    "eksport PDF",
    "tryby gry",
    "soft gra",
    "chaos gra",
    "hardcore gra",
    "quick gra"
  ],
  authors: [{ name: "WhatNow?!" }],
  creator: "WhatNow?!",
  publisher: "WhatNow?!",
  manifest: "/manifest.json",
  metadataBase: new URL("https://what-now-chaos.vercel.app"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: "WhatNow?! - Generator Imprezowego Chaosu",
    description: "Ożyw każdą imprezę absurdalnymi, zabawnymi i wyzywającymi zadaniami dla grup znajomych. Różne tryby gry: Soft, Chaos, Hardcore i Quick. Licznik czasu, historia sesji i eksport raportów!",
    url: "https://what-now-chaos.vercel.app",
    siteName: "WhatNow?!",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "Logo WhatNow?! - Generator Imprezowego Chaosu",
      },
    ],
    locale: "pl_PL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WhatNow?! - Generator Imprezowego Chaosu",
    description: "Ożyw każdą imprezę absurdalnymi, zabawnymi i wyzywającymi zadaniami dla grup znajomych. Różne tryby gry: Soft, Chaos, Hardcore i Quick. Licznik czasu, historia sesji i eksport raportów!",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'verification_token', // Replace with your actual Google verification token if available
  },
  appleWebApp: {
    title: 'WhatNow?!',
    statusBarStyle: 'black-translucent',
    startupImage: [
      {
        url: '/icons/apple-splash-2048-2732.jpg',
        media: '(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
      },
      {
        url: '/icons/apple-splash-1668-2388.jpg',
        media: '(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
      },
      {
        url: '/icons/apple-splash-1536-2048.jpg',
        media: '(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
      },
      {
        url: '/icons/apple-splash-1242-2688.jpg',
        media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)'
      },
      {
        url: '/icons/apple-splash-1125-2436.jpg',
        media: '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)'
      },
      {
        url: '/icons/apple-splash-828-1792.jpg',
        media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
      },
      {
        url: '/icons/apple-splash-750-1334.jpg',
        media: '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
      },
      {
        url: '/icons/apple-splash-640-1136.jpg',
        media: '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
      }
    ]
  },
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#120e29',
    'msapplication-tap-highlight': 'no',
    'theme-color': '#ff4dbc'
  }
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#ff4dbc",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl" className={`${montserrat.variable}`}>
      <head>
        {/* PWA meta tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#120e29" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#ff4dbc" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/favicon.png" />
      </head>
      <body>
        <AuthProvider>
          <MobileNavbar />
          {children}
          <PWAWrapper />
          <CookieConsent />
        </AuthProvider>
        
        {/* Register service worker */}
        <Script 
          src="/service-worker-register.js"
          strategy="lazyOnload"
          id="service-worker-register"
        />
        
        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3053617786081495"
          strategy="lazyOnload"
          id="google-adsense"
          crossOrigin="anonymous"
        />
      </body>
    </html>
  );
}
