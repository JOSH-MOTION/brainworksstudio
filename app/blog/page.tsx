// app/blog/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Calendar, User, Search, ArrowRight, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  author: { name: string };
  category: string;
  tags: string[];
  createdAt: string;
  views: number;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [searchTerm, selectedCategory, posts]);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/blog?published=true');
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
        setFilteredPosts(data);
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPosts = () => {
    let filtered = posts;

    if (searchTerm) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }

    setFilteredPosts(filtered);
  };

  const categories = ['all', ...Array.from(new Set(posts.map((post) => post.category)))];
  const featuredPost = filteredPosts[0];
  const regularPosts = filteredPosts.slice(1);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-gray-900 mb-4"></div>
            <p className="text-gray-600 font-medium">Loading posts...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <Badge className="mb-4 bg-white/10 text-white border-white/20 px-4 py-1.5 rounded-full font-medium">
                Blog
              </Badge>
              <h1 className="text-5xl sm:text-6xl font-bold mb-6 tracking-tight">
                Stories & Insights
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Explore tips, insights, and inspiration from the world of photography and videography
              </p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-12"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 rounded-xl border-gray-200 focus:border-gray-900 focus:ring-gray-900 text-base"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedCategory === category
                        ? 'bg-gray-900 text-white hover:bg-gray-800 shadow-md'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.div>

          {filteredPosts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-white rounded-2xl border border-gray-200"
            >
              <div className="max-w-md mx-auto">
                <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No posts found</h3>
                <p className="text-gray-600">Try adjusting your search or filter to find what you're looking for.</p>
              </div>
            </motion.div>
          ) : (
            <>
              {/* Featured Post */}
              {featuredPost && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mb-16"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-5 w-5 text-gray-900" />
                    <span className="text-sm font-bold text-gray-900 uppercase tracking-wider">Featured</span>
                  </div>
                  <Link href={`/blog/${featuredPost.slug}`}>
                    <Card className="overflow-hidden border-gray-200 hover:shadow-2xl transition-all duration-500 cursor-pointer group rounded-3xl bg-white">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                        <div className="relative w-full aspect-[16/10] lg:aspect-auto lg:h-full overflow-hidden bg-gray-100">
                          <Image
                            src={featuredPost.featuredImage || '/placeholder-image.jpg'}
                            alt={featuredPost.title}
                            fill
                            className="object-contain group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-8 lg:p-12 flex flex-col justify-center">
                          <div className="flex items-center gap-2 mb-4">
                            <Badge className="bg-gray-900 text-white px-3 py-1 rounded-full">
                              {featuredPost.category}
                            </Badge>
                          </div>
                          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 group-hover:text-gray-700 transition-colors line-clamp-3">
                            {featuredPost.title}
                          </h2>
                          <p className="text-gray-600 text-lg mb-6 line-clamp-3 leading-relaxed">
                            {featuredPost.excerpt}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span className="font-medium">{featuredPost.author.name}</span>
                              </div>
                              <span className="text-gray-400">•</span>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(featuredPost.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-gray-900 font-semibold group-hover:gap-4 transition-all">
                              Read more
                              <ArrowRight className="h-5 w-5" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              )}

              {/* Regular Posts Grid */}
              {regularPosts.length > 0 && (
                <>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Recent Posts</h2>
                    <p className="text-gray-600 mt-1">Explore our latest articles and stories</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-16">
                    {regularPosts.map((post, index) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
                      >
                        <Link href={`/blog/${post.slug}`}>
                          <Card className="h-full hover:shadow-2xl transition-all duration-300 cursor-pointer group overflow-hidden border-gray-200 rounded-2xl bg-white">
                            <div className="relative w-full aspect-[16/10] overflow-hidden bg-gray-100">
                              <Image
                                src={post.featuredImage || '/placeholder-image.jpg'}
                                alt={post.title}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                              <div className="absolute top-4 left-4">
                                <Badge className="bg-white/90 text-gray-900 backdrop-blur-sm px-3 py-1 rounded-full font-medium shadow-lg">
                                  {post.category}
                                </Badge>
                              </div>
                            </div>
                            <CardHeader className="p-6">
                              <CardTitle className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-gray-700 transition-colors mb-3">
                                {post.title}
                              </CardTitle>
                              <CardDescription className="line-clamp-3 text-gray-600 leading-relaxed">
                                {post.excerpt}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="px-6 pb-6">
                              <div className="flex items-center justify-between text-sm text-gray-600 pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4" />
                                  <span className="font-medium">{post.author.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20 px-4 mt-16">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-4">Stay Updated</h2>
              <p className="text-xl text-gray-300 mb-8">
                Get the latest stories and insights delivered to your inbox
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="h-12 rounded-xl bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
                <button className="bg-white text-gray-900 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}