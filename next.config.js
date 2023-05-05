/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    mdxRs: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      require("./scripts/generate-sitemap");
    }

    return config;
  },
};

const withMDX = require("@next/mdx")();
module.exports = withMDX(nextConfig);
