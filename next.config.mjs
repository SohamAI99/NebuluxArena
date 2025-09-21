/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
  // Ensure proper handling of static assets
  experimental: {
    optimizeCss: true,
  },
  // Add asset prefix for proper static asset handling
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: /node_modules/,
      };
    }
    
    // Handle CSS modules
    config.module.rules.push({
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader',
        'postcss-loader',
      ],
    });
    
    return config;
  },
}

export default nextConfig