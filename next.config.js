/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = {
  env: {
    NEBIUS_API_KEY: process.env.NEBIUS_API_KEY,
  },
};
