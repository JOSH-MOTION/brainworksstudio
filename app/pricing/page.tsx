'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Check, Star, Camera, Video, Zap, Search, X } from 'lucide-react';
import Link from 'next/link';

interface RateCard {
  id?: string;
  serviceType: 'photography' | 'videography' | 'both';
  category: string;
  serviceName: string;
  description: string;
  price: string;
  duration?: string;
  includes: string[];
  featured: boolean;
  order: number;
}

const serviceTypes = [
  { value: 'all', label: 'All Services', icon: Zap },
  { value: 'photography', label: 'Photography', icon: Camera },
  { value: 'videography', label: 'Videography', icon: Video },
  { value: 'both', label: 'Combined Packages', icon: Zap }
];

const getServiceTypeColor = (type: string) => {
  switch (type) {
    case 'photography':
      return 'bg-blue-100 text-blue-700 border-blue-300';
    case 'videography':
      return 'bg-purple-100 text-purple-700 border-purple-300';
    case 'both':
      return 'bg-amber-100 text-amber-700 border-amber-300';
    default:
      return 'bg-coral-100 text-coral-700 border-coral-300';
  }
};

export default function PricingPage() {
  const [rateCards, setRateCards] = useState<RateCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedServiceType, setSelectedServiceType] = useState<'all' | 'photography' | 'videography' | 'both'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchRateCards();
  }, []);

  const fetchRateCards = async () => {
    try {
      const response = await fetch('/api/rate-cards');
      if (response.ok) {
        const data = await response.json();
        setRateCards(data.sort((a: RateCard, b: RateCard) => a.order - b.order || a.serviceName.localeCompare(b.serviceName)));
      } else {
        console.error('Failed to fetch rate cards:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching rate cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...Array.from(new Set(rateCards.map((card) => card.category)))];
  
  const filteredCards = rateCards.filter(card => {
    const categoryMatch = selectedCategory === 'all' || card.category === selectedCategory;
    const serviceTypeMatch = selectedServiceType === 'all' || card.serviceType === selectedServiceType;
    
    // Search functionality - searches in multiple fields
    const searchMatch = searchQuery === '' || 
      card.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.price.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.includes.some(item => item.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return categoryMatch && serviceTypeMatch && searchMatch;
  });

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedServiceType('all');
    setSearchQuery('');
  };

  const hasActiveFilters = selectedCategory !== 'all' || selectedServiceType !== 'all' || searchQuery !== '';

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
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-[#001F44] mb-4">Our Pricing</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transparent pricing for professional photography and videography services
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by service name, description, price, or features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 py-6 text-base border-2 border-gray-200 focus:border-coral-500 focus:ring-coral-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="text-sm text-gray-600 mt-2 text-center">
              Found {filteredCards.length} result{filteredCards.length !== 1 ? 's' : ''} for "{searchQuery}"
            </p>
          )}
        </motion.div>

        {/* Service Type Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {serviceTypes.map((type) => (
            <Badge
              key={type.value}
              variant={selectedServiceType === type.value ? 'default' : 'outline'}
              className={`cursor-pointer px-4 py-2 text-sm flex items-center gap-2 transition-all ${
                selectedServiceType === type.value
                  ? 'bg-coral-500 text-white'
                  : `${getServiceTypeColor(type.value)} hover:opacity-80`
              }`}
              onClick={() => setSelectedServiceType(type.value as any)}
            >
              <type.icon className="h-3 w-3" />
              {type.label}
            </Badge>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              className={`cursor-pointer px-4 py-2 text-sm transition-all ${
                selectedCategory === category
                  ? 'bg-coral-500 text-white'
                  : 'border-coral-300 text-coral-600 hover:bg-coral-50'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-center mb-6"
          >
            <Button
              onClick={clearAllFilters}
              variant="outline"
              className="border-coral-300 text-coral-600 hover:bg-coral-50 flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Clear All Filters
            </Button>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCards.map((card, index) => (
            <motion.div
              key={card.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className={`h-full relative ${
                  card.featured
                    ? 'border-2 border-coral-500 shadow-lg'
                    : 'border border-gray-200'
                }`}
              >
                {card.featured && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-coral-500 text-white flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <div className="flex flex-col gap-2 mb-2">
                    <Badge className={`w-fit mx-auto ${getServiceTypeColor(card.serviceType)} flex items-center gap-1`}>
                      {card.serviceType === 'photography' && <Camera className="h-3 w-3" />}
                      {card.serviceType === 'videography' && <Video className="h-3 w-3" />}
                      {card.serviceType === 'both' && <Zap className="h-3 w-3" />}
                      {card.serviceType.charAt(0).toUpperCase() + card.serviceType.slice(1)}
                    </Badge>
                    <Badge className="w-fit mx-auto bg-teal-100 text-teal-700">
                      {card.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl text-[#001F44]">{card.serviceName}</CardTitle>
                  <CardDescription className="text-gray-600">{card.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-coral-600">{card.price}</span>
                    {card.duration && (
                      <p className="text-sm text-gray-500 mt-1">{card.duration}</p>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {card.includes.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={`/booking?rateCardId=${encodeURIComponent(card.id || card.serviceName)}&category=${encodeURIComponent(card.category)}&serviceType=${encodeURIComponent(card.serviceType)}`}>
                    <Button
                      className={`w-full ${
                        card.featured
                          ? 'bg-coral-500 hover:bg-coral-600 text-white'
                          : 'bg-teal-600 hover:bg-teal-700 text-white'
                      }`}
                    >
                      Book Now
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredCards.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-2">
              {searchQuery 
                ? `No results found for "${searchQuery}"`
                : 'No pricing packages found for the selected filters.'}
            </p>
            <p className="text-gray-500 text-sm mb-4">
              Try adjusting your search or filters
            </p>
            <Button
              onClick={clearAllFilters}
              className="bg-coral-500 hover:bg-coral-600 text-white"
            >
              Clear All Filters
            </Button>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <Card className="bg-gradient-to-br from-teal-50 to-coral-50 border-none">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-[#001F44] mb-4">
                Need a Custom Package?
              </h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Every project is unique. Contact us to discuss your specific requirements and 
                we'll create a tailored package that fits your needs and budget.
              </p>
              <Link href="/contact">
                <Button size="lg" className="bg-coral-500 hover:bg-coral-600 text-white">
                  Get a Custom Quote
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
}