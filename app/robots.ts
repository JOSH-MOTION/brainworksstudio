// app/robots.ts
import { MetadataRoute } from 'next';

const BASE_URL = 'https://brainworksstudioafrica.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/', // Allow crawling of all pages by default
        
        // Explicitly Disallow admin and login pages
        disallow: [
          '/login', 
          '/admin', 
          '/dashboard',
          // Use wildcards for routes you want to block entirely
          '/private/*', 
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}