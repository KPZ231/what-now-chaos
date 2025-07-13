"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';

export default function AdComponent({ adSlot, adFormat = 'auto' }) {
  const { user } = useAuth();
  const [adLoaded, setAdLoaded] = useState(false);
  
  // Don't show ads for premium users
  const shouldShowAds = !user?.isPremium;
  
  useEffect(() => {
    // Only proceed if we should show ads and the ads haven't been loaded yet
    if (!shouldShowAds || adLoaded) return;
    
    // Check if AdSense is loaded
    if (window.adsbygoogle) {
      try {
        // Push the ad
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        setAdLoaded(true);
      } catch (error) {
        console.error('AdSense error:', error);
      }
    } else {
      console.log('AdSense not loaded yet');
    }
  }, [shouldShowAds, adLoaded, adSlot]);
  
  // Don't render anything for premium users
  if (!shouldShowAds) {
    return null;
  }
  
  return (
    <div className="ad-container my-4">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-3053617786081495"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
      <div className="text-xs text-gray-500 text-center mt-1">
        Reklama - przejdź na wersję Premium, aby je wyłączyć
      </div>
    </div>
  );
} 