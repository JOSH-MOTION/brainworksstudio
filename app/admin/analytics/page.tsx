// app/admin/analytics/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Users, 
  Eye, 
  Clock, 
  Globe, 
  Smartphone,
  Monitor,
  Tablet,
  RefreshCw,
  Calendar,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { motion, Variants } from 'framer-motion';

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const sectionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, ease: 'easeOut' } },
};

interface AnalyticsData {
  pageViews: number;
  visitors: number;
  bounceRate: number;
  averageTime: number;
  topPages: Array<{ path: string; views: number }>;
  topReferrers: Array<{ source: string; visits: number }>;
  devices: { desktop: number; mobile: number; tablet: number };
  countries: Array<{ country: string; visits: number }>;
  range: string;
}

export default function AdminAnalyticsPage() {
  const { user, isAdmin, loading: authLoading, firebaseUser } = useAuth();
  const router = useRouter();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRange, setSelectedRange] = useState<string>('7d');

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/auth/login');
    }
  }, [user, isAdmin, authLoading, router]);

  useEffect(() => {
    if (user && isAdmin && firebaseUser) {
      fetchAnalytics();
    }
  }, [user, isAdmin, firebaseUser, selectedRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!firebaseUser) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      const token = await firebaseUser.getIdToken();
      const response = await fetch(`/api/admin/analytics?range=${selectedRange}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Failed to fetch analytics');
      }

      const data = await response.json();
      setAnalyticsData(data);
    } catch (err: any) {
      console.error('Error fetching analytics:', err);
      setError(err.message || 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  const getRangeLabel = (range: string): string => {
    switch (range) {
      case '1d': return 'Last 24 Hours';
      case '7d': return 'Last 7 Days';
      case '30d': return 'Last 30 Days';
      case '90d': return 'Last 90 Days';
      default: return 'Last 7 Days';
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Analytics</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              {error.includes('credentials not configured') && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 text-left">
                  <p className="text-sm text-amber-800 font-medium mb-2">Setup Required:</p>
                  <ol className="text-xs text-amber-700 space-y-1 list-decimal list-inside">
                    <li>Go to <a href="https://vercel.com/account/tokens" target="_blank" rel="noopener noreferrer" className="underline">Vercel → Settings → Tokens</a></li>
                    <li>Create a new token with Analytics access</li>
                    <li>Add <code className="bg-amber-100 px-1 rounded">VERCEL_TOKEN</code> to your environment variables</li>
                    <li>Add <code className="bg-amber-100 px-1 rounded">VERCEL_PROJECT_ID</code> from your project settings</li>
                    <li>Add <code className="bg-amber-100 px-1 rounded">VERCEL_TEAM_ID</code> if using a team (optional)</li>
                  </ol>
                </div>
              )}
              <Button onClick={fetchAnalytics} className="bg-teal-600 hover:bg-teal-700">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Website Analytics</h1>
            <p className="text-gray-600 mt-2">Track your website&apos;s performance and visitor insights</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={fetchAnalytics}
              variant="outline"
              size="sm"
              className="border-teal-300 text-teal-600 hover:bg-teal-50"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <a 
              href="https://vercel.com/dashboard/analytics" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm" className="border-gray-300">
                <ExternalLink className="h-4 w-4 mr-2" />
                Vercel Dashboard
              </Button>
            </a>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2">
          {['1d', '7d', '30d', '90d'].map((range) => (
            <Badge
              key={range}
              variant={selectedRange === range ? 'default' : 'outline'}
              className={`cursor-pointer px-4 py-2 ${
                selectedRange === range
                  ? 'bg-teal-600 text-white'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setSelectedRange(range)}
            >
              <Calendar className="h-3 w-3 mr-1" />
              {getRangeLabel(range)}
            </Badge>
          ))}
        </div>
      </div>

      {analyticsData && (
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div variants={cardVariants}>
              <Card className="border-teal-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Page Views
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">
                    {formatNumber(analyticsData.pageViews)}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{getRangeLabel(selectedRange)}</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants}>
              <Card className="border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Unique Visitors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">
                    {formatNumber(analyticsData.visitors)}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{getRangeLabel(selectedRange)}</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants}>
              <Card className="border-amber-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Bounce Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">
                    {analyticsData.bounceRate.toFixed(1)}%
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Lower is better</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants}>
              <Card className="border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Avg. Time on Site
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">
                    {formatTime(analyticsData.averageTime)}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Per session</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Top Pages & Referrers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div variants={cardVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-teal-600" />
                    Top Pages
                  </CardTitle>
                  <CardDescription>Most viewed pages on your site</CardDescription>
                </CardHeader>
                <CardContent>
                  {analyticsData.topPages.length > 0 ? (
                    <div className="space-y-3">
                      {analyticsData.topPages.slice(0, 5).map((page, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-700 truncate flex-1">
                            {page.path}
                          </span>
                          <Badge variant="secondary" className="ml-2">
                            {formatNumber(page.views)}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No data available</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ExternalLink className="h-5 w-5 text-blue-600" />
                    Top Referrers
                  </CardTitle>
                  <CardDescription>Where your visitors come from</CardDescription>
                </CardHeader>
                <CardContent>
                  {analyticsData.topReferrers.length > 0 ? (
                    <div className="space-y-3">
                      {analyticsData.topReferrers.slice(0, 5).map((referrer, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-700 truncate flex-1">
                            {referrer.source}
                          </span>
                          <Badge variant="secondary" className="ml-2">
                            {formatNumber(referrer.visits)}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No data available</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Devices & Countries */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div variants={cardVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5 text-purple-600" />
                    Device Breakdown
                  </CardTitle>
                  <CardDescription>How visitors access your site</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(analyticsData.devices).map(([device, count]) => {
                      const total = Object.values(analyticsData.devices).reduce((a, b) => a + b, 0);
                      const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : '0';
                      const Icon = device === 'desktop' ? Monitor : device === 'mobile' ? Smartphone : Tablet;
                      
                      return (
                        <div key={device} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              {device.charAt(0).toUpperCase() + device.slice(1)}
                            </span>
                            <span className="text-sm text-gray-600">{percentage}%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-teal-600 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-green-600" />
                    Top Countries
                  </CardTitle>
                  <CardDescription>Geographic distribution of visitors</CardDescription>
                </CardHeader>
                <CardContent>
                  {analyticsData.countries.length > 0 ? (
                    <div className="space-y-3">
                      {analyticsData.countries.slice(0, 5).map((country, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-700">
                            {country.country}
                          </span>
                          <Badge variant="secondary">
                            {formatNumber(country.visits)}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No data available</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
}