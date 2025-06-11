const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: true,
      },
    ]
  },
  async rewrites() {
    return {
      fallback: [
        {
          source: '/:path*',
          destination: '/404',
        },
      ],
    }
  },
  optimizeFonts: true,
}

export default nextConfig
