// app/sitemap.ts
import { MetadataRoute } from 'next';

const BASE_URL = 'https://brainworksstudioafrica.com';

// 1. Define the paths you want to exclude from the sitemap.
// This is crucial for keeping admin or private pages out of Google's index.
const EXCLUDED_PATHS = [
    // Pages you don't want indexed
    '/login',
    '/admin',
    '/dashboard',
    
    // Any dynamic route that should be excluded (e.g., /user/[id])
    // Note: Use a more sophisticated method for dynamic exclusions if needed.
];

// 2. Define your static routes
const staticRoutes = [
    '', // Represents the home page: /
    '/about',
    '/contact',
    '/portfolio',
    '/services', // Example service overview page
];


// Function to get dynamic content (like individual project pages)
async function getDynamicUrls() {
    // 💡 Replace this with your actual data fetching from your database or CMS
    // Example: Fetching all project IDs to generate project pages
    const projects = [
        { slug: 'wedding-photography', date: '2025-10-08' },
        { slug: 'product-videography', date: '2025-10-01' },
    ];

    return projects.map((project) => ({
        url: `${BASE_URL}/portfolio/${project.slug}`,
        lastModified: new Date(project.date).toISOString().split('T')[0],
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }));
}


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const dynamicUrls = await getDynamicUrls();

    const staticUrls = staticRoutes
        .filter(path => !EXCLUDED_PATHS.includes(path)) // Filter out excluded pages
        .map((route) => ({
            url: `${BASE_URL}${route}`,
            lastModified: new Date().toISOString().split('T')[0],
            // Set priority and frequency based on the page's importance
            changeFrequency: route === '' ? 'daily' as const : 'monthly' as const,
            priority: route === '' ? 1.0 : 0.8,
        }));
    
    // Combine the static and dynamic URLs
    return [...staticUrls, ...dynamicUrls];
}

// 💡 IMPORTANT: Ensure your build script runs the Next.js build: npm run build