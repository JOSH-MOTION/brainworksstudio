// app/blog/[slug]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Layout from '@/components/Layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowLeft, Clock, Eye, Share2, Twitter, Facebook, Linkedin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  featuredImage: string;
  author: { name: string };
  category: string;
  tags: string[];
  createdAt: string;
  views: number;
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchPost();
    } else {
      setError('No slug provided');
      setLoading(false);
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      console.log('Fetching post for slug:', slug);
      // Add incrementView=true to track views
      const response = await fetch(`/api/blog?slug=${slug}&published=true&incrementView=true`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      console.log('API response status:', response.status);
      if (!response.ok) {
        throw new Error(`Failed to fetch post: ${response.statusText}`);
      }
      const data = await response.json();
      console.log('API response data:', data);
      if (data.length > 0) {
        setPost(data[0]);
      } else {
        throw new Error('Post not found');
      }
    } catch (error: any) {
      console.error('Error fetching blog post:', error);
      setError(error.message || 'Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = post?.title || 'Blog Post';
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };

    if (platform in shareUrls) {
      window.open(shareUrls[platform as keyof typeof shareUrls], '_blank', 'width=600,height=400');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-gray-900 mb-4"></div>
            <p className="text-gray-600 font-medium">Loading article...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center px-4">
          <div className="max-w-md text-center">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-12">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ArrowLeft className="h-10 w-10 text-red-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Post Not Found</h1>
              <p className="text-gray-600 mb-8">{error || 'The requested blog post could not be found.'}</p>
              <Link href="/blog">
                <Button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-6 rounded-xl font-semibold shadow-lg">
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back to Blog
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const readingTime = Math.ceil((post.content?.split(' ').length || 0) / 200);

  return (
    <Layout>
      <div className="bg-gradient-to-br from-gray-50 to-white min-h-screen">
        {/* Hero Section with Featured Image */}
        <div className="relative w-full bg-gray-900">
          <div className="relative w-full aspect-[21/9] max-h-[600px] overflow-hidden">
            <Image
              src={post.featuredImage || '/placeholder-image.jpg'}
              alt={post.title || 'Blog post image'}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Content Overlay */}
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-12">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Link href="/blog">
                  <Button 
                    variant="outline" 
                    className="mb-6 bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 rounded-xl"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Blog
                  </Button>
                </Link>
                
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <Badge className="bg-white text-gray-900 px-4 py-1.5 rounded-full font-semibold">
                    {post.category || 'Uncategorized'}
                  </Badge>
                  {post.tags?.slice(0, 3).map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="outline" 
                      className="border-white/30 text-white backdrop-blur-sm bg-white/10 px-3 py-1 rounded-full"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  {post.title || 'Untitled'}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 text-white/90">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    <span className="font-medium">{post.author?.name || 'Unknown Author'}</span>
                  </div>
                  <span className="text-white/50">•</span>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    <span>
                      {post.createdAt
                        ? new Date(post.createdAt).toLocaleDateString('en-US', { 
                            month: 'long', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })
                        : 'Unknown Date'}
                    </span>
                  </div>
                  <span className="text-white/50">•</span>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    <span>{readingTime} min read</span>
                  </div>
                  <span className="text-white/50">•</span>
                  <div className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    <span>{post.views || 0} views</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Share Buttons - Sticky */}
            <div className="hidden lg:block fixed left-8 top-1/2 -translate-y-1/2 z-10">
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => handleShare('twitter')}
                  className="w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group border border-gray-200 hover:border-gray-300"
                  aria-label="Share on Twitter"
                >
                  <Twitter className="h-5 w-5 text-gray-600 group-hover:text-blue-500 transition-colors" />
                </button>
                <button
                  onClick={() => handleShare('facebook')}
                  className="w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group border border-gray-200 hover:border-gray-300"
                  aria-label="Share on Facebook"
                >
                  <Facebook className="h-5 w-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group border border-gray-200 hover:border-gray-300"
                  aria-label="Share on LinkedIn"
                >
                  <Linkedin className="h-5 w-5 text-gray-600 group-hover:text-blue-700 transition-colors" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-lg prose-gray max-w-none">
              <style jsx global>{`
                .prose {
                  color: #374151;
                }
                .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
                  color: #111827;
                  font-weight: 700;
                  margin-top: 2em;
                  margin-bottom: 0.75em;
                }
                .prose h2 {
                  font-size: 2em;
                }
                .prose h3 {
                  font-size: 1.5em;
                }
                .prose p {
                  margin-bottom: 1.5em;
                  line-height: 1.875;
                  font-size: 1.125rem;
                }
                .prose a {
                  color: #111827;
                  font-weight: 600;
                  text-decoration: underline;
                  text-decoration-color: #d1d5db;
                  transition: all 0.2s;
                }
                .prose a:hover {
                  text-decoration-color: #111827;
                }
                .prose strong {
                  color: #111827;
                  font-weight: 700;
                }
                .prose ul, .prose ol {
                  margin-top: 1.5em;
                  margin-bottom: 1.5em;
                }
                .prose li {
                  margin-bottom: 0.5em;
                }
                .prose blockquote {
                  border-left: 4px solid #111827;
                  padding-left: 1.5em;
                  font-style: italic;
                  color: #4b5563;
                  margin: 2em 0;
                }
                .prose img {
                  border-radius: 1rem;
                  margin: 2em 0;
                  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                }
                .prose code {
                  background: #f3f4f6;
                  padding: 0.25em 0.5em;
                  border-radius: 0.375rem;
                  font-size: 0.875em;
                  color: #111827;
                }
                .prose pre {
                  background: #1f2937;
                  color: #f9fafb;
                  padding: 1.5em;
                  border-radius: 1rem;
                  overflow-x: auto;
                  margin: 2em 0;
                }
                .prose pre code {
                  background: transparent;
                  padding: 0;
                  color: #f9fafb;
                }
              `}</style>
              
              {post.content ? (
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              ) : (
                <p className="text-gray-600 italic">No content available for this post.</p>
              )}
            </div>
          </motion.div>

          {/* Share Section - Mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 pt-12 border-t-2 border-gray-200"
          >
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Share this article</h3>
                  <p className="text-gray-600">Let others discover this story</p>
                </div>
                <Share2 className="h-8 w-8 text-gray-400" />
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => handleShare('twitter')}
                  className="flex-1 sm:flex-initial bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-6 py-6"
                >
                  <Twitter className="h-5 w-5 mr-2" />
                  Twitter
                </Button>
                <Button
                  onClick={() => handleShare('facebook')}
                  className="flex-1 sm:flex-initial bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-6"
                >
                  <Facebook className="h-5 w-5 mr-2" />
                  Facebook
                </Button>
                <Button
                  onClick={() => handleShare('linkedin')}
                  className="flex-1 sm:flex-initial bg-blue-700 hover:bg-blue-800 text-white rounded-xl px-6 py-6"
                >
                  <Linkedin className="h-5 w-5 mr-2" />
                  LinkedIn
                </Button>
                <Button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: post.title || 'Blog Post',
                        url: window.location.href,
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link copied to clipboard!');
                    }
                  }}
                  variant="outline"
                  className="flex-1 sm:flex-initial border-2 border-gray-300 hover:bg-gray-50 rounded-xl px-6 py-6"
                >
                  <Share2 className="h-5 w-5 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Author Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12"
          >
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Written by</p>
                  <p className="text-xl font-bold">{post.author?.name || 'Unknown Author'}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Back to Blog */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12 text-center"
          >
            <Link href="/blog">
              <Button 
                variant="outline" 
                className="border-2 border-gray-300 hover:bg-gray-50 rounded-xl px-8 py-6 font-semibold"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to All Posts
              </Button>
            </Link>
          </motion.div>
        </article>
      </div>
    </Layout>
  );
}