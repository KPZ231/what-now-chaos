import { Montserrat } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/lib/AuthContext';

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "WhatNow?! - Generator Chaosu na Imprezy",
  description: "Rozkręć każdą imprezę dzięki absurdalnym, śmiesznym i wyzywającym zadaniom dla grupy znajomych. Różne tryby gry, timer i eksport historii!",
  keywords: ["impreza", "gra towarzyska", "zabawa", "wyzwania", "picie", "gra na imprezę", "zadania", "losowanie"],
  authors: [{ name: "WhatNow?!" }],
  creator: "WhatNow?!",
  publisher: "WhatNow?!",
  themeColor: "#ff4dbc",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
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
