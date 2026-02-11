/** @type {import('next').NextConfig} */
const nextConfig = {
  // ccxt uses Node.js modules that shouldn't be bundled client-side
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
        child_process: false,
      };
    }
    return config;
  },
};

export default nextConfig;
