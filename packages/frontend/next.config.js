/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const BrotliPlugin = require('brotli-webpack-plugin');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  generateEtags: false,

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },

  env: {
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:3000',
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_dummy',
  },

  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    config.optimization.splitChunks = {
      chunks: 'all',
      minSize: 20000,
      maxSize: 240000,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 20,
          reuseExistingChunk: true,
        },
        common: {
          name: 'common',
          minChunks: 2,
          priority: 10,
          reuseExistingChunk: true,
        },
      },
    };

    // ✅ Add Brotli compression only for client builds
    if (!isServer) {
      config.plugins.push(
        new BrotliPlugin({
          asset: '[path].br[query]',
          test: /\.(js|css|html|svg)$/,
          threshold: 10240,
          minRatio: 0.8,
        })
      );
    }

    return config;
  },
//   async redirects() {
//   return [
//     {
//       source: '/',
//       destination: '/landing.html',
//       permanent: false,
//     },
//   ];
// },


  async headers() {
    return [
      {
        source: '/_next/static/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/static/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
        ],
      },
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig);





// /** @type {import('next').NextConfig} */
// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// });

// const nextConfig = {
//   reactStrictMode: true,
//   swcMinify: true,
//   compress: true,
//   poweredByHeader: false,
//   generateEtags: false,

//   experimental: {
//     appDir: false,
//     optimizeCss: false, // ✅ added safe optimization
//   },

//   compiler: {
//     removeConsole: process.env.NODE_ENV === 'production',
//   },

//   images: {
//     domains: ['localhost'],
//     formats: ['image/webp', 'image/avif'],
//     minimumCacheTTL: 60,
//   },

//   env: {
//     API_BASE_URL: process.env.API_BASE_URL,
//     STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
//   },

//   webpack: (config, { isServer, dev }) => {
//     // ✅ Add safe fallbacks to avoid "fs", "net", "tls" errors in browser builds
//     config.resolve.fallback = {
//       ...config.resolve.fallback,
//       fs: false,
//       net: false,
//       tls: false,
//     };

//     // ✅ Handle extension alias for better module resolution
//     config.resolve.extensionAlias = {
//       '.js': ['.js', '.ts', '.tsx'],
//       '.jsx': ['.jsx', '.tsx'],
//       '.ts': ['.ts', '.tsx'],
//       '.tsx': ['.tsx'],
//     };

//     // ✅ Improved chunk optimization
//     config.optimization = {
//       ...config.optimization,
//       splitChunks: {
//         chunks: 'all',
//         cacheGroups: {
//           vendor: {
//             test: /[\\/]node_modules[\\/]/,
//             name: 'vendors',
//             priority: 20,
//             reuseExistingChunk: true,
//           },
//           common: {
//             name: 'common',
//             minChunks: 2,
//             priority: 10,
//             reuseExistingChunk: true,
//           },
//           react: {
//             name: 'react',
//             test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
//             chunks: 'all',
//             priority: 25,
//           },
//           ui: {
//             name: 'ui',
//             test: /[\\/]node_modules[\\/](@radix-ui|class-variance-authority|clsx|tailwind-merge)[\\/]/,
//             chunks: 'all',
//             priority: 15,
//           },
//         },
//       },
//     };

//     // ✅ Keep bundle analyzer support
//     if (process.env.ANALYZE) {
//       const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
//       config.plugins.push(
//         new BundleAnalyzerPlugin({
//           analyzerMode: 'server',
//           analyzerPort: isServer ? 8888 : 8889,
//           openAnalyzer: true,
//         })
//       );
//     }

//     return config;
//   },

//   // ✅ Security + caching headers (keep from your version)
//   async headers() {
//     return [
//       {
//         source: '/_next/static/(.*)',
//         headers: [
//           { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
//         ],
//       },
//       {
//         source: '/static/(.*)',
//         headers: [
//           { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
//         ],
//       },
//       {
//         source: '/(.*)',
//         headers: [
//           { key: 'X-Content-Type-Options', value: 'nosniff' },
//           { key: 'X-Frame-Options', value: 'DENY' },
//           { key: 'X-XSS-Protection', value: '1; mode=block' },
//         ],
//       },
//     ];
//   },
// };

// module.exports = withBundleAnalyzer(nextConfig);



// /** @type {import('next').NextConfig} */
// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// });

// const nextConfig = {
//   reactStrictMode: true,
//   swcMinify: true,
//   compress: true,
//   poweredByHeader: false,
//   generateEtags: false,

//   experimental: {
//     appDir: false,
//   },

//   compiler: {
//     removeConsole: process.env.NODE_ENV === 'production',
//   },

//   images: {
//     domains: ['localhost'], // ✅ kept your domain
//     formats: ['image/webp', 'image/avif'], // ✅ added optimized formats
//     minimumCacheTTL: 60,
//   },

//   env: {
//     API_BASE_URL: process.env.API_BASE_URL,
//     STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
//   },

//   webpack: (config, { isServer, dev }) => {
//     // Optimize chunks
//     config.optimization = {
//       ...config.optimization,
//       splitChunks: {
//         chunks: 'all',
//         cacheGroups: {
//           vendor: {
//             test: /[\\/]node_modules[\\/]/,
//             name: 'vendors',
//             priority: 20,
//             reuseExistingChunk: true,
//           },
//           common: {
//             name: 'common',
//             minChunks: 2,
//             priority: 10,
//             reuseExistingChunk: true,
//           },
//         },
//       },
//     };

//     // Keep your bundle analyzer plugin
//     if (process.env.ANALYZE) {
//       const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
//       config.plugins.push(
//         new BundleAnalyzerPlugin({
//           analyzerMode: 'server',
//           analyzerPort: isServer ? 8888 : 8889,
//           openAnalyzer: true,
//         })
//       );
//     }

//     return config;
//   },

//   // Security + caching headers
//   async headers() {
//     return [
//       {
//         source: '/_next/static/(.*)',
//         headers: [
//           { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
//         ],
//       },
//       {
//         source: '/static/(.*)',
//         headers: [
//           { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
//         ],
//       },
//       {
//         source: '/(.*)',
//         headers: [
//           { key: 'X-Content-Type-Options', value: 'nosniff' },
//           { key: 'X-Frame-Options', value: 'DENY' },
//           { key: 'X-XSS-Protection', value: '1; mode=block' },
//         ],
//       },
//     ];
//   },
// };

// module.exports = withBundleAnalyzer(nextConfig);




