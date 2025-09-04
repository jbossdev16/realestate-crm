/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingRoot: '../../',
  },
  output: 'standalone',
  transpilePackages: ['@realestate-crm/ui', '@realestate-crm/config', '@realestate-crm/types'],
}

module.exports = nextConfig
