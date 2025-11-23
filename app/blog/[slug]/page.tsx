'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Layout from '@/components/Layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowLeft, Clock } from 'lucide-react';
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
      const response = await fetch(`/api/blog?slug=${slug}&published=true`, {
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

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-coral-600"></div>
        </div>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto py-12 px-4 text-center">
          <h1 className="text-3xl font-bold text-[#001F44] mb-4">Post Not Found</h1>
          <p className="text-red-600 mb-4">{error || 'The requested blog post could not be found.'}</p>
          <Link href="/blog">
            <Button className="bg-coral-500 hover:bg-coral-600 text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <article className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link href="/blog">
          <Button variant="outline" className="mb-6 border-coral-300 text-coral-600 hover:bg-coral-50">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Button>
        </Link>

        {/* Featured Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative h-96 w-full mb-8 rounded-lg overflow-hidden"
        >
          <Image
            src={post.featuredImage || '/placeholder-image.jpg'}
            alt={post.title || 'Blog post image'}
            fill
            className="object-cover"
          />
        </motion.div>

        {/* Post Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Badge className="bg-coral-100 text-coral-600">{post.category || 'Uncategorized'}</Badge>
            {post.tags?.map((tag) => (
              <Badge key={tag} variant="outline" className="border-teal-300 text-teal-600">
                {tag}
              </Badge>
            ))}
          </div>
          <h1 className="text-4xl font-bold text-[#001F44] mb-4">{post.title || 'Untitled'}</h1>
          <div className="flex items-center gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <span>{post.author?.name || 'Unknown Author'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>
                {post.createdAt
                  ? new Date(post.createdAt).toLocaleDateString()
                  : 'Unknown Date'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>
                {post.content
                  ? `${Math.ceil(post.content.split(' ').length / 200)} min read`
                  : 'N/A'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Post Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="prose prose-lg max-w-none"
        >
          {post.content ? (
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          ) : (
            <p className="text-gray-600 italic">No content available for this post.</p>
          )}
        </motion.div>

        {/* Share Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 pt-8 border-t border-gray-200"
        >
          <h3 className="text-xl font-semibold text-[#001F44] mb-4">Share this post</h3>
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="border-coral-300 text-coral-600 hover:bg-coral-50"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: post.title || 'Blog Post',
                    url: window.location.href,
                  });
                }
              }}
            >
              Share
            </Button>
          </div>
        </motion.div>
      </article>
    </Layout>
  );
}