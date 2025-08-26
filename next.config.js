/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has TypeScript errors.
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['images.unsplash.com', 'storage.googleapis.com'],
    // Keep unoptimized false for Node.js deployment
    unoptimized: false,
  },
  // Comment out for Node.js deployment, uncomment for static export
  // output: 'export',
  // trailingSlash: true,
  basePath: '',
}

module.exports = nextConfig