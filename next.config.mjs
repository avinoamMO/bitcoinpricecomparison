/** @type {import('next').NextConfig} */
const nextConfig = {
  // ccxt is a large package with native Node.js dependencies.
  // serverExternalPackages prevents it from being bundled into serverless functions,
  // letting Vercel resolve it at runtime instead (avoids 50MB+ function size).
  serverExternalPackages: ["ccxt"],
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
