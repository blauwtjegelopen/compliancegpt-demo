// next.config.mjs
const nextConfig = {
  reactStrictMode: true,

  async redirects() {
    return [
      {
        source: '/research',
        destination: '/state-of-ai-governance',
        permanent: true,
      },
      {
        source: '/research/:path*',
        destination: '/state-of-ai-governance',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;