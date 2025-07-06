import { Montserrat } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/lib/AuthContext';

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "WhatNow?! - Party Chaos Generator",
  description: "Boost any party with absurd, funny, and challenging tasks for groups of friends. Different game modes, timer, and session history export!",
  keywords: ["party game", "drinking game", "challenges", "fun activities", "party tasks", "random challenges", "group games", "party entertainment"],
  authors: [{ name: "WhatNow?!" }],
  creator: "WhatNow?!",
  publisher: "WhatNow?!",
  manifest: "/manifest.json",
  metadataBase: new URL("https://what-now-chaos.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "WhatNow?! - Party Chaos Generator",
    description: "Boost any party with absurd, funny, and challenging tasks for groups of friends. Different game modes, timer, and session history export!",
    url: "https://what-now-chaos.vercel.app",
    siteName: "WhatNow?!",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "WhatNow?! Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WhatNow?! - Party Chaos Generator",
    description: "Boost any party with absurd, funny, and challenging tasks for groups of friends. Different game modes, timer, and session history export!",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#ff4dbc",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
