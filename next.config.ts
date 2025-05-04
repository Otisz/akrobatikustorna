import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    ppr: true,
    reactCompiler: true,
    viewTransition: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: ["@payloadcms/db-sqlite"],
  images: {
    minimumCacheTTL: 86_400,
  },
  async headers() {
    return [
      {
        source: "/jelentkezes",
        headers: [
          { key: "Content-Security-Policy", value: "frame-ancestors docs.google.com;" },
          { key: "Access-Control-Allow-Origin", value: "*" },
        ],
      },
    ];
  },
};

export default withPayload(nextConfig);
