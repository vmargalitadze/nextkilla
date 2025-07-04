import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
 
const nextConfig: NextConfig = {
  // Improve stability during development
  experimental: {
    optimizePackageImports: ['swiper'],
  },
  // Reduce memory usage
  swcMinify: true,
  // Better error handling
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // Optimize images
  images: {
    formats: ['image/webp', 'image/avif'],
  },
};
 
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);