// lib/youtube-helper.ts
/**
 * Extract YouTube video ID from various URL formats
 */
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;

  const patterns = [
    // Standard watch URL
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    // Shortened youtu.be URL
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    // Embed URL
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    // URL with additional parameters
    /(?:youtube\.com\/watch\?.*v=)([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Get YouTube thumbnail URL from video URL
 * Returns high quality thumbnail (maxresdefault), falls back to hqdefault if not available
 */
export function getYouTubeThumbnail(url: string, quality: 'max' | 'hq' | 'mq' | 'sd' = 'max'): string | null {
  const videoId = extractYouTubeId(url);
  if (!videoId) return null;

  const qualityMap = {
    max: 'maxresdefault', // 1280x720 (if available)
    hq: 'hqdefault',      // 480x360
    mq: 'mqdefault',      // 320x180
    sd: 'sddefault',      // 640x480
  };

  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
}

/**
 * Get preview image for portfolio item
 * Handles both images and videos
 */
export function getPortfolioPreviewImage(item: {
  imageUrls?: string[];
  videoUrl?: string | null;
  type: 'photography' | 'videography';
}): string {
  // If it has images, use the first one
  if (item.imageUrls && item.imageUrls.length > 0) {
    return item.imageUrls[0];
  }

  // If it's a video with YouTube URL, get thumbnail
  if (item.videoUrl) {
    if (item.videoUrl.includes('youtube.com') || item.videoUrl.includes('youtu.be')) {
      const thumbnail = getYouTubeThumbnail(item.videoUrl);
      if (thumbnail) return thumbnail;
    }

    // For other video URLs (Vimeo, direct video files), return the URL itself
    // The video tag will show first frame as poster
    if (item.videoUrl.includes('vimeo.com')) {
      // For Vimeo, we'd need to make an API call to get thumbnail
      // For now, return placeholder
      return '/video-placeholder.png';
    }

    // For direct video files from ImageKit or other CDNs
    if (item.videoUrl.match(/\.(mp4|webm|ogg)$/i)) {
      return item.videoUrl; // HTML video will show first frame
    }
  }

  // Fallback to placeholder
  return '/placeholder-image.jpg';
}

/**
 * Check if URL is a YouTube video
 */
export function isYouTubeUrl(url: string): boolean {
  return url.includes('youtube.com') || url.includes('youtu.be');
}

/**
 * Check if URL is a Vimeo video
 */
export function isVimeoUrl(url: string): boolean {
  return url.includes('vimeo.com');
}

/**
 * Convert YouTube watch URL to embed URL
 */
export function getYouTubeEmbedUrl(url: string): string | null {
  const videoId = extractYouTubeId(url);
  if (!videoId) return null;
  return `https://www.youtube.com/embed/${videoId}`;
}