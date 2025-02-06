import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    ppr: true,
    inlineCss: true,
    reactCompiler: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: ["@payloadcms/db-sqlite"],
};

export default withPayload(nextConfig);
