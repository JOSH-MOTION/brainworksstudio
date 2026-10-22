const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // Every external host actually used as an <Image src>: ImageKit (main
    // portfolio/blog/pricing uploads), Cloudinary (profile pictures), and
    // YouTube (showreel thumbnails).
    remotePatterns: [
      { protocol: 'https', hostname: 'ik.imagekit.io' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'img.youtube.com' },
    ],
  },
  async redirects() {
    return [
      // A real HTTP redirect, so search engines don't index /videography as a
      // duplicate carrying the homepage title.
      { source: '/videography', destination: '/videography/all', permanent: true },
    ];
  },
};

module.exports = nextConfig;
