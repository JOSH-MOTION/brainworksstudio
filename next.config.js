const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  async redirects() {
    return [
      // A real HTTP redirect, so search engines don't index /videography as a
      // duplicate carrying the homepage title.
      { source: '/videography', destination: '/videography/all', permanent: true },
    ];
  },
};

module.exports = nextConfig;
