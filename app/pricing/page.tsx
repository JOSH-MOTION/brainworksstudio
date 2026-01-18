// app/pricing/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface PricingCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  published: boolean;
  order: number;
  packages: any[];
}

export default function PricingPage() {
  const [categories, setCategories] = useState<PricingCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/pricing-categories?published=true');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        console.error('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
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

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '48px 48px'
          }} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-6"
          >
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span className="text-sm text-white font-medium">Transparent & Flexible Pricing</span>
          </motion.div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Choose Your
            <span className="block mt-2 bg-gradient-to-r from-white via-teal-200 to-teal-400 bg-clip-text text-transparent">
              Perfect Package
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Explore our service categories and find the perfect package that fits your needs and budget
          </p>
        </motion.div>
      </section>

      {/* Categories Grid */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {categories.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-xl text-gray-600">No pricing categories available at the moment.</p>
              <p className="text-gray-500 mt-2">Please check back later or contact us for custom quotes.</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={`/pricing/${category.slug}`}>
                    <Card className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer bg-white rounded-2xl h-full">
                      <div className="flex flex-col md:flex-row h-full">
                        {/* Image Section */}
                        <div className="relative w-full md:w-2/5 h-64 md:h-auto overflow-hidden">
                          {category.imageUrl ? (
                            <Image
                              src={category.imageUrl}
                              alt={category.name}
                              fill
                              sizes="(max-width: 768px) 100vw, 40vw"
                              className="object-cover transition-transform duration-700 group-hover:scale-110"
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder-image.jpg';
                              }}
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-coral-500 flex items-center justify-center">
                              <span className="text-6xl font-bold text-white opacity-20">
                                {category.name.charAt(0)}
                              </span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                          
                          {/* Package count badge */}
                          <div className="absolute top-4 right-4">
                            <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                              <span className="text-sm font-bold text-slate-900">
                                {category.packages?.length || 0} {category.packages?.length === 1 ? 'Package' : 'Packages'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Content Section */}
                        <CardContent className="flex-1 p-8 flex flex-col justify-center">
                          <h2 className="text-3xl font-bold text-slate-900 mb-3 group-hover:text-teal-600 transition-colors">
                            {category.name}
                          </h2>
                          <p className="text-gray-600 mb-6 leading-relaxed">
                            {category.description}
                          </p>
                          <div className="flex items-center text-teal-600 font-bold group-hover:gap-3 gap-2 transition-all text-lg">
                            View Packages
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Need a Custom Package?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Every project is unique. Contact us to discuss your specific requirements and 
            we&apos;ll create a tailored package that fits your needs and budget.
          </p>
          <Link href="/contact">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white text-slate-900 hover:bg-gray-100 font-bold py-4 px-10 rounded-full text-lg shadow-2xl transition-colors"
            >
              Get a Custom Quote
            </motion.button>
          </Link>
        </motion.div>
      </section>
    </Layout>
  );
}