/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // This is a Next.js 14.2.16 configuration.
  // No specific custom configurations are added here beyond the default.
  // If you need to add custom configurations (e.g., image optimization domains,
  // webpack configurations), you can add them here.
  // For example:
  // images: {
  //   domains: ['example.com'],
  // },
  // experimental: {
  //   serverActions: true,
  // },
}

module.exports = nextConfig
