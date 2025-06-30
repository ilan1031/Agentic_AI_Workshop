module.exports = {
    reactStrictMode: true,
    images: {
      domains: ['images.unsplash.com', 'source.unsplash.com'],
    },
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:3001/api/:path*', // Proxy to Node.js backend
        },
        {
          source: '/agents/:path*',
          destination: 'http://0.0.0.0:8000/:path*', // Proxy to Python FastAPI
        }
      ];
    },
  };