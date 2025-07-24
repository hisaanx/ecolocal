const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true, // 👈 prevents build from failing due to lint errors
  },
};

export default nextConfig;
