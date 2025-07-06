import { NextResponse } from 'next/server';

// This route dynamically generates the sitemap.xml
export async function GET() {
  // Base URL
  const baseUrl = 'https://what-now-chaos.vercel.app';
  
  // Get current date for lastmod
  const date = new Date().toISOString().split('T')[0];
  
  // Define your website's routes
  const routes = [
    { url: '/', priority: '1.0', changefreq: 'weekly' },
    { url: '/play', priority: '0.9', changefreq: 'weekly' },
    { url: '/modes', priority: '0.8', changefreq: 'monthly' },
    { url: '/about', priority: '0.7', changefreq: 'monthly' },
    { url: '/premium', priority: '0.8', changefreq: 'monthly' },
    { url: '/premium-advantages', priority: '0.7', changefreq: 'monthly' },
    { url: '/login', priority: '0.6', changefreq: 'yearly' },
    { url: '/register', priority: '0.6', changefreq: 'yearly' },
    { url: '/privacy-policy', priority: '0.5', changefreq: 'yearly' },
    { url: '/terms-of-service', priority: '0.5', changefreq: 'yearly' },
    { url: '/cookie-policy', priority: '0.5', changefreq: 'yearly' },
    { url: '/subscription-policy', priority: '0.5', changefreq: 'yearly' },
  ];

  // Generate sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${baseUrl}${route.url}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  // Return the XML with the correct content type
  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800' // 1 day cache, 7 days stale
    },
  });
} 