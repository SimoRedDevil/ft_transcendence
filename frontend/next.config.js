// next.config.js
module.exports = {
  images: {
    domains: ['localhost', 'cdn.intra.42.fr'],
  },
  reactStrictMode: false, // Disable React Strict Mode
  webpack: (config, { dev }) => {
    if (dev) {
      config.devtool = false; // Disable source maps in development
    }
    return config;
  },
};
