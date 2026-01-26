// app/api/admin/analytics/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    let decodedToken;
    
    try {
      decodedToken = await adminAuth?.verifyIdToken(token);
    } catch (error) {
      console.error('Token verification failed:', error);
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    if (!decodedToken) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Check if user is admin
    const userDoc = await adminDb?.collection('users').doc(decodedToken.uid).get();
    const userData = userDoc?.data();
    if (!userData?.role || userData.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Fetch analytics data from Vercel
    const vercelToken = process.env.VERCEL_TOKEN;
    const vercelProjectId = process.env.VERCEL_PROJECT_ID;
    const vercelTeamId = process.env.VERCEL_TEAM_ID;

    if (!vercelToken || !vercelProjectId) {
      return NextResponse.json({ 
        error: 'Vercel credentials not configured',
        message: 'Please add VERCEL_TOKEN and VERCEL_PROJECT_ID to your environment variables'
      }, { status: 503 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '7d'; // 1d, 7d, 30d, 90d

    // Build Vercel Analytics API URL
    let analyticsUrl = `https://vercel.com/api/web/insights/stats?projectId=${vercelProjectId}&from=${getFromTimestamp(range)}`;
    if (vercelTeamId) {
      analyticsUrl += `&teamId=${vercelTeamId}`;
    }

    console.log('Fetching analytics from Vercel...');

    // Fetch from Vercel API
    const response = await fetch(analyticsUrl, {
      headers: {
        'Authorization': `Bearer ${vercelToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Vercel API error:', response.status, errorText);
      return NextResponse.json({ 
        error: 'Failed to fetch analytics from Vercel',
        details: errorText,
        status: response.status
      }, { status: response.status });
    }

    const data = await response.json();

    // Format the response
    const formattedData = {
      pageViews: data.pageViews || 0,
      visitors: data.visitors || 0,
      bounceRate: data.bounceRate || 0,
      averageTime: data.averageTime || 0,
      topPages: data.topPages || [],
      topReferrers: data.topReferrers || [],
      devices: data.devices || { desktop: 0, mobile: 0, tablet: 0 },
      countries: data.countries || [],
      range,
    };

    return NextResponse.json(formattedData, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch analytics',
      message: error.message 
    }, { status: 500 });
  }
}

// Helper function to get timestamp for different ranges
function getFromTimestamp(range: string): number {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  
  switch (range) {
    case '1d':
      return now - day;
    case '7d':
      return now - (7 * day);
    case '30d':
      return now - (30 * day);
    case '90d':
      return now - (90 * day);
    default:
      return now - (7 * day);
  }
}