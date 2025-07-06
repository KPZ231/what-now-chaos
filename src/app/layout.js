import { Montserrat } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/lib/AuthContext';
import MobileNavbar from './partial/mobile-navbar';

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "WhatNow?! - Generator Imprezowego Chaosu",
  description: "Ożyw każdą imprezę absurdalnymi, zabawnymi i wyzywającymi zadaniami dla grup znajomych. Różne tryby gry, licznik czasu i eksport historii sesji!",
  keywords: ["gra imprezowa", "gra alkoholowa", "wyzwania", "zabawy", "zadania imprezowe", "losowe wyzwania", "gry grupowe", "rozrywka na imprezę"],
  authors: [{ name: "WhatNow?!" }],
  creator: "WhatNow?!",
  publisher: "WhatNow?!",
  manifest: "/manifest.json",
  metadataBase: new URL("https://what-now-chaos.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "WhatNow?! - Generator Imprezowego Chaosu",
    description: "Ożyw każdą imprezę absurdalnymi, zabawnymi i wyzywającymi zadaniami dla grup znajomych. Różne tryby gry, licznik czasu i eksport historii sesji!",
    url: "https://what-now-chaos.vercel.app",
    siteName: "WhatNow?!",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "Logo WhatNow?!",
      },
    ],
    locale: "pl_PL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WhatNow?! - Generator Imprezowego Chaosu",
    description: "Ożyw każdą imprezę absurdalnymi, zabawnymi i wyzywającymi zadaniami dla grup znajomych. Różne tryby gry, licznik czasu i eksport historii sesji!",
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
    <html lang="pl">
      <body
        className={`${montserrat.variable} antialiased`}
      >
        <AuthProvider>
          {children}
          <MobileNavbar />
        </AuthProvider>
      </body>
    </html>
  );
}
