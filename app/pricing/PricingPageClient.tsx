// app/pricing/page.tsx
'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { motion } from 'framer-motion';
import { ArrowRight, Camera } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { formatCategoryName } from '@/lib/pricing-format';
import { PRICING_FAQ } from '@/lib/pricing-faq';

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

export default function PricingPageClient({ initialCategories }: { initialCategories: PricingCategory[] }) {
  const [categories] = useState<PricingCategory[]>(initialCategories);
  // Real work, not a stock/gradient hero — use whichever category has the
  // most packages as the flagship image (falls back to the first with a photo).
  const heroImage = [...categories].sort((a, b) => (b.packages?.length || 0) - (a.packages?.length || 0)).find(
    (c) => c.imageUrl
  )?.imageUrl;

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-28 sm:py-36">
        {heroImage ? (
          <div className="absolute inset-0 z-0">
            <Image src={heroImage} alt="Brain Works Studio Africa production" fill sizes="100vw" className="object-cover" priority />
            <div className="absolute inset-0 bg-navy-950/80" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-navy-950/70" />
          </div>
        ) : (
          <div className="absolute inset-0 z-0 bg-navy-950" />
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Choose Your
            <span className="block mt-2 text-gold-300">Perfect Package</span>
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
                              alt={formatCategoryName(category.name)}
                              fill
                              sizes="(max-width: 768px) 100vw, 40vw"
                              className="object-cover transition-transform duration-700 group-hover:scale-110"
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder-image.jpg';
                              }}
                            />
                          ) : (
                            <div className="absolute inset-0 bg-navy-900 flex items-center justify-center">
                              <Camera className="h-10 w-10 text-gold-400/50" strokeWidth={1.5} />
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
                          <h2 className="font-serif text-3xl font-bold text-slate-900 mb-3 group-hover:text-gold-600 transition-colors">
                            {formatCategoryName(category.name)}
                          </h2>
                          <p className="text-gray-600 mb-6 leading-relaxed">
                            {category.description}
                          </p>
                          <div className="flex items-center text-gold-600 font-bold group-hover:gap-3 gap-2 transition-all text-lg">
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

      {/* FAQ Section — only real, admin-confirmed policy answers */}
      {PRICING_FAQ.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 mb-10 text-center"
            >
              Frequently Asked Questions
            </motion.h2>
            <Accordion type="single" collapsible className="w-full">
              {PRICING_FAQ.map((item, index) => (
                <AccordionItem key={index} value={`faq-${index}`}>
                  <AccordionTrigger className="text-left text-base sm:text-lg font-semibold text-slate-900">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 text-base leading-relaxed">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-slate-950 via-slate-900 to-navy-950">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-6">
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