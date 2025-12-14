/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['gateway.pinata.cloud', 'ipfs.io'],
  },
  webpack: (config, { isServer }) => {
    // Fix for WalletConnect indexedDB issue during SSR
    if (isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    
    // Ignore React Native packages that are incorrectly imported
    config.resolve.alias = {
      ...config.resolve.alias,
      '@react-native-async-storage/async-storage': false,
    }
    
    // Ignore optional dependencies
    config.resolve.fallback = {
      ...config.resolve.fallback,
      'pino-pretty': false,
    }
    
    // Ignore modules that cause issues in browser environment
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      }
    }
    
    return config
  },
}

module.exports = nextConfig

