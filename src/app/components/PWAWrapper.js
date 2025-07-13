"use client";

import dynamic from 'next/dynamic';

// Dynamically import the InstallPWA component with no SSR
const InstallPWA = dynamic(() => import('./InstallPWA'), {
  ssr: false,
});

export default function PWAWrapper() {
  return <InstallPWA />;
} 