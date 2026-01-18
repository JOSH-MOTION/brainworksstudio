// app/pricing/[slug]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Check, Star, ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface PricingPackage {
  name: string;
  price: string;
  duration?: string;
  description: string;
  includes: string[];
  featured: boolean;
  order: number;
}

interface PricingCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  imageUrl: string;
  published: boolean;
  order: number;
  packages: PricingPackage[];
}

export default function CategoryPackagesPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [category, setCategory] = useState<PricingCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchCategory();
    }
  }, [slug]);

  const fetchCategory = async () => {
    try {
      const response = await fetch('/api/pricing-categories?published=true');
      if (response.ok) {
        const categories = await response.json();
        const foundCategory = categories.find((cat: PricingCategory) => cat.slug === slug);
        
        if (foundCategory) {
          setCategory(foundCategory);
        } else {
          setNotFound(true);
        }
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error('Error fetching category:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-coral-600"></div>
        </div>
      </Layout>
    );
  }

  if (notFound || !category) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Category Not Found</h1>
            <p className="text-gray-600 mb-8">The pricing category you're looking for doesn't exist.</p>
            <Link href="/pricing">
              <Button className="bg-teal-500 hover:bg-teal-600">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Pricing
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section with Category Image */}
      <section className="relative h-[400px] overflow-hidden">
        {category.imageUrl ? (
          <>
            <Image
              src={category.imageUrl}
              alt={category.name}
              fill
              sizes="100vw"
              className="object-cover"
              priority
              onError={(e) => {
                e.currentTarget.src = '/placeholder-image.jpg';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900" />
        )}

        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link href="/pricing">
                <Button variant="ghost" className="text-white hover:text-teal-400 mb-6 -ml-2">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to All Categories
                </Button>
              </Link>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-4"
              >
                <Sparkles className="w-4 h-4 text-teal-400" />
                <span className="text-sm text-white font-medium">
                  {category.packages.length} {category.packages.length === 1 ? 'Package' : 'Packages'} Available
                </span>
              </motion.div>

              <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4">
                {category.name}
              </h1>
              <p className="text-xl text-gray-200 max-w-2xl">
                {category.description}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Long Description (if available) */}
      {category.longDescription && (
        <section className="py-12 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="prose prose-lg max-w-none"
            >
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {category.longDescription}
              </p>
            </motion.div>
          </div>
        </section>
      )}

      {/* Packages Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Choose Your Package
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Select the perfect package that matches your needs and budget
            </p>
          </motion.div>

          {category.packages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-xl text-gray-600 mb-2">No packages available yet</p>
              <p className="text-gray-500 mb-6">We&apos;re working on adding packages to this category.</p>
              <Link href="/contact">
                <Button className="bg-coral-500 hover:bg-coral-600">
                  Contact Us for Custom Quote
                </Button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {category.packages.map((pkg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    className={`h-full relative ${
                      pkg.featured
                        ? 'border-2 border-coral-500 shadow-xl scale-105'
                        : 'border border-gray-200 shadow-lg'
                    }`}
                  >
                    {pkg.featured && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-coral-500 text-white flex items-center gap-1 px-4 py-1.5 shadow-lg">
                          <Star className="h-4 w-4" />
                          Most Popular
                        </Badge>
                      </div>
                    )}

                    <CardHeader className="text-center pb-4 pt-8">
                      <CardTitle className="text-2xl text-slate-900 mb-2">
                        {pkg.name}
                      </CardTitle>
                      <CardDescription className="text-gray-600 mb-4">
                        {pkg.description}
                      </CardDescription>
                      <div className="mt-4">
                        <span className="text-4xl font-bold text-coral-600">
                          {pkg.price}
                        </span>
                        {pkg.duration && (
                          <p className="text-sm text-gray-500 mt-2">{pkg.duration}</p>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent>
                      <ul className="space-y-3 mb-8">
                        {pkg.includes.map((item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>

                      <Link href={`/booking?category=${encodeURIComponent(category.slug)}&package=${encodeURIComponent(pkg.name)}`}>
                        <Button
                          className={`w-full ${
                            pkg.featured
                              ? 'bg-coral-500 hover:bg-coral-600 text-white shadow-lg'
                              : 'bg-teal-600 hover:bg-teal-700 text-white'
                          }`}
                        >
                          Book {pkg.name}
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Have Questions?
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Not sure which package is right for you? Get in touch and we&apos;ll help you choose the perfect option.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button className="bg-white text-slate-900 hover:bg-gray-100 font-bold px-8 py-6 rounded-full">
                Contact Us
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" className="border-white/30 text-teal-500 hover:text-white hover:bg-white/10 font-bold px-8 py-6 rounded-full">
                View Other Categories
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </Layout>
  );
}