/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "example.com", // Allow images from example.com
      },
      {
        protocol: "https",
        hostname: "**.supabase.co", // Allow images from Supabase storage
      },
    ],
    unoptimized: true,
  },
}

module.exports = nextConfig
