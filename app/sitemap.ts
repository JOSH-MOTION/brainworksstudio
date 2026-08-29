// app/sitemap.ts
import { MetadataRoute } from 'next';
import { getPortfolioItems } from '@/lib/portfolio-server';
import { getPublishedBlogPosts } from '@/lib/blog-server';
import { getPublishedPricingCategories } from '@/lib/pricing-server';
import { PHOTOGRAPHY_CATEGORY_LABELS } from '@/lib/photography-categories';
import { VIDEOGRAPHY_CATEGORY_LABELS } from '@/lib/videography-categories';
import { SERVICES } from '@/lib/services-config';

const BASE_URL = 'https://brainworksstudioafrica.com';

const staticRoutes: { path: string; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; priority: number }[] = [
  { path: '', changeFrequency: 'daily', priority: 1.0 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/contact', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/portfolio', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/photography', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/services', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/pricing', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/blog', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/reviews/submit', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/booking', changeFrequency: 'monthly', priority: 0.6 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [portfolioItems, blogPosts, pricingCategories] = await Promise.all([
    getPortfolioItems(),
    getPublishedBlogPosts(),
    getPublishedPricingCategories(),
  ]);

  const staticUrls = staticRoutes.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const portfolioUrls = portfolioItems.map((item) => ({
    url: `${BASE_URL}/portfolio/${item.id}`,
    lastModified: new Date(item.updatedAt || item.createdAt),
    changeFrequency: 'monthly' as const,
    priority: item.featured ? 0.8 : 0.6,
  }));

  const blogUrls = blogPosts
    .filter((post) => post.slug)
    .map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt || post.createdAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

  const pricingUrls = pricingCategories
    .filter((category) => category.slug)
    .map((category) => ({
      url: `${BASE_URL}/pricing/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

  const photographyCategoryUrls = Object.keys(PHOTOGRAPHY_CATEGORY_LABELS).map((slug) => ({
    url: `${BASE_URL}/photography/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const videographyCategoryUrls = Object.keys(VIDEOGRAPHY_CATEGORY_LABELS).map((slug) => ({
    url: `${BASE_URL}/videography/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const serviceUrls = SERVICES.map((service) => ({
    url: `${BASE_URL}/services/${service.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.85,
  }));

  return [
    ...staticUrls,
    ...portfolioUrls,
    ...blogUrls,
    ...pricingUrls,
    ...photographyCategoryUrls,
    ...videographyCategoryUrls,
    ...serviceUrls,
  ];
}
